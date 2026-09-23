# v56 changelog

## 第一批：现场使用收束

- 首页图片策略由“按场景 kind 自动 fallback”改为“独立场景图优先 + 极少数显式 moment”。
- 纯执行节点允许无图，消除大量重复的找路 / 酒店 / 吃饭插画。
- 首页和场景详情优先选择现有高清 hero；保留少量有意义的角色图覆盖。
- 时间轴卡片仅显示时间 + 主任务，移除第二行解释。
- 场景工具按机场、路线、景点、酒店、环球、餐饮等类型动态排序，默认最多 4 个。
- D3108 状态刷新为“已开售 · 待购买”。
- package version 更新为 0.56.0。


## 第二批：场景英语与交通语义

- 行程节点进入英语页时，默认只展示 3–5 句“当前最可能用到”的现场短句。
- 焦点英语模式隐藏分类器与搜索框；需要完整词库时点“全部语句”，底部独立英语入口仍保留完整搜索。
- 抵达樟宜、酒店、NTU、USS、离境 T1 等场景均采用显式短句组合，不再一次展开多个分类的十几到二十多句。
- T1 移除误导性的旧 Changi/Jewel 大图，改为 Changi Airport / Terminal 1 / TR128 功能摘要。
- D3108 从内部 `flight` 类型修正为 `train`，详情页显示潮汕 → 上海南及厦门北中间站，不再出现飞机语义。
- 现场回归：主页滑动、离线英语播放、鱼尾狮/NTU/USS/T1/揭阳场景页、v54 票夹均通过浏览器 smoke。


## 第三批：发布前技术冻结

- Web 壳、Service Worker、Android versionCode/versionName、iOS MARKETING_VERSION、数据版本与图片注册表全部统一到 v56。
- Android/iOS/普通 CI 均改为使用 `package-lock.json` + `npm ci`，避免依赖漂移。
- `@capacitor/cli` 从 7.4.3 更新到 7.6.9（Capacitor 7 同 major 安全补丁）。
- GitHub runner 重新生成并提交 lock；锁定后的依赖审计结果为 0 info / 0 low / 0 moderate / 0 high / 0 critical。
- 新增 Dependency Audit workflow，后续 package / lock 变化会自动复核。
- 当前状态：**v56 功能冻结候选版**。后续不再增加主功能，只允许真机兼容修复、真实订单状态更新和独立图片高清替换。


## 第三批：发布前依赖与构建收尾

- Capacitor `core/android/ios/cli` 统一升级到 7.6.9，保持同一 major，避免跨到 Capacitor 8 的 breaking changes。
- `package-lock.json` 重新由 GitHub Linux runner 解析生成并同步回仓库，依赖图固定。
- CLI 依赖链中的 `tar` 已升级到 7.5.22。
- CI 改为严格 `npm ci`，并加入 `npm audit --audit-level=high`。
- v56 版本标记已统一；旧版标记仅保留在兼容注释/历史说明中，不影响运行时版本。
