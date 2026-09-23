from pathlib import Path
import mimetypes, json, time
from playwright.sync_api import sync_playwright
ROOT=Path('/mnt/data/v55_work/tuhu_v55_app/www')
OUT=Path('/mnt/data/v55_work/tuhu_v55_app/dist')
index=(ROOT/'index.html').read_text('utf-8')
index=index.replace('<head>','<head><base href="https://tuhu.local/">',1)

def handler(route):
    u=route.request.url
    path=u.split('https://tuhu.local/',1)[-1].split('?',1)[0].split('#',1)[0]
    if not path: path='index.html'
    p=(ROOT/path).resolve()
    try:
        p.relative_to(ROOT.resolve())
    except ValueError:
        return route.abort()
    if p.is_file():
        typ=mimetypes.guess_type(str(p))[0] or 'application/octet-stream'
        return route.fulfill(path=str(p),content_type=typ)
    return route.abort()

def make_page(browser):
    ctx=browser.new_context(viewport={"width":430,"height":932},device_scale_factor=1)
    p=ctx.new_page()
    errors=[]
    failed=[]
    p.on('pageerror',lambda e: errors.append(str(e)))
    p.on('requestfailed',lambda r: failed.append((r.url,r.failure)))
    p.route('https://tuhu.local/**', handler)
    p.set_content(index,wait_until='load',timeout=60000)
    p.wait_for_function("window.Tuhu && window.Tuhu.version === 'v55'",timeout=30000)
    p.wait_for_timeout(2850)
    return ctx,p,errors,failed

report={}
with sync_playwright() as pw:
    browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage','--autoplay-policy=no-user-gesture-required'])

    # Home + swipe
    ctx,p,errors,failed=make_page(browser)
    p.evaluate("Tuhu.changeDay('03')")
    p.wait_for_timeout(500)
    p.wait_for_function("document.querySelector('.fn-select img') ? document.querySelector('.fn-select img').naturalWidth > 0 : true",timeout=10000)
    p.evaluate("(()=>{const t=document.querySelector('#toast');if(t)t.style.display='none'})()")
    p.screenshot(path=str(OUT/'tuhu_v55_home_day03.png'),full_page=False)
    before=p.evaluate("Tuhu.getState().index")
    box=p.locator('#homeStage').bounding_box()
    if box:
        x=box['x']+box['width']*.55
        p.mouse.move(x,box['y']+box['height']*.76)
        p.mouse.down()
        p.mouse.move(x,box['y']+box['height']*.22,steps=8)
        p.mouse.up()
        p.wait_for_timeout(850)
    after=p.evaluate("Tuhu.getState().index")
    report['home']={'before_index':before,'after_index':after,'swipe_advanced':after>before,'errors':errors,'failed':failed[:5]}
    ctx.close()

    # Merlion scene
    ctx,p,errors,failed=make_page(browser)
    p.evaluate("Tuhu.changeDay('03'); Tuhu.open({type:'scene',key:'merlion',day:'03'})")
    p.wait_for_selector("#appDialog[open]",timeout=10000)
    p.wait_for_timeout(300)
    hero=p.locator('#dialogBody .hero img')
    if hero.count():
        try:p.wait_for_function("document.querySelector('#dialogBody .hero img').complete && document.querySelector('#dialogBody .hero img').naturalWidth>0",timeout=10000)
        except:pass
    info=p.evaluate("""()=>{const im=document.querySelector('#dialogBody .hero img');return {src:im?.getAttribute('src')||'',currentSrc:im?.currentSrc||'',naturalWidth:im?.naturalWidth||0,naturalHeight:im?.naturalHeight||0,cls:im?.className||'',tiles:document.querySelectorAll('#dialogBody .scene-product-grid [data-a]').length,assistant:!!document.querySelector('#dialogBody .assistant-scene-button'),title:document.querySelector('#dialogTitle')?.textContent||''}}""")
    p.evaluate("(()=>{const t=document.querySelector('#toast');if(t)t.style.display='none'})()")
    p.screenshot(path=str(OUT/'tuhu_v55_scene_merlion.png'),full_page=False)
    info['errors']=errors;info['failed']=failed[:10]
    report['scene']=info
    ctx.close()

    # English view + audio
    ctx,p,errors,failed=make_page(browser)
    p.evaluate("Tuhu.changeDay('03'); Tuhu.open({type:'english',key:'arrival',day:'03'})")
    p.wait_for_selector("#appDialog[open]",timeout=10000)
    p.wait_for_timeout(300)
    body=p.locator('#dialogBody').inner_text()
    has_offline='离线语音' in body
    has_sys='系统语音' in body
    say=p.locator('#dialogBody [data-a="say"]').first
    audio_before=p.evaluate("Tuhu.getAudioStatus()")
    if say.count():
        say.click()
        p.wait_for_timeout(850)
    audio_after=p.evaluate("Tuhu.getAudioStatus()")
    p.evaluate("(()=>{const t=document.querySelector('#toast');if(t)t.style.display='none'})()")
    p.screenshot(path=str(OUT/'tuhu_v55_english.png'),full_page=False)
    report['english']={'offline_label':has_offline,'mentions_system_tts':has_sys,'say_buttons':p.locator('#dialogBody [data-a="say"]').count(),'audio_before':audio_before,'audio_after':audio_after,'errors':errors,'failed':failed[:10]}
    ctx.close()

    # Wallet
    ctx,p,errors,failed=make_page(browser)
    p.evaluate("Tuhu.changeDay('03'); Tuhu.open({type:'wallet',day:'03'})")
    p.wait_for_selector("#appDialog[open]",timeout=10000)
    p.wait_for_timeout(2850)
    txt=p.locator('#dialogBody').inner_text()
    p.evaluate("(()=>{const t=document.querySelector('#toast');if(t)t.style.display='none'})()")
    p.screenshot(path=str(OUT/'tuhu_v55_wallet.png'),full_page=False)
    report['wallet']={'has_now':bool(p.locator('#dialogBody .wallet-now').count()),'has_today':'今天' in txt,'has_all':'全部资料' in txt,'errors':errors,'failed':failed[:10]}
    ctx.close()
    browser.close()

(OUT/'v55-browser-smoke.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),'utf-8')
print(json.dumps(report,ensure_ascii=False,indent=2))