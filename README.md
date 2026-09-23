# 兔狐 · TUHU Travel App

新加坡＋揭阳旅行现场执行 App。当前维护基线：**v56**。

本仓库同时维护 Android 与 iOS，二者共享同一套 `www/` 旅行界面与数据；原生差异集中在 `native/` 与构建脚本中。

## 仓库约定

- `www/`：共享的离线 Web UI、行程数据、英语、票夹逻辑。
- `src/`：需要 bundle 的 JS 源码。
- `native/android/`：Android 自定义 Capacitor 插件源码。
- `scripts/`：构建、校验与平台准备脚本。
- `ci/`：iOS 导出配置等 CI 文件。
- `.github/workflows/`：Android / iOS 云端构建。
- `docs/`：架构、构建、发布与版本说明。
- `dist/`、`android/`、`ios/`：生成物，不提交 Git；安装包通过 GitHub Actions / Releases 发布。

## 版本基线

v56 延续 v55 / v54 的中心叠层时间轴、现场票夹、全屏凭证、多凭证切换、稳定 `booking_id` 和离线旅行助手；本版主要精修首页信息密度、图片渐变、英语离线播放和场景工具层级。

## 构建

```bash
npm install
npm run check:source
npm run android:prepare   # 生成 android/
npm run ios:prepare       # macOS / GitHub Actions 生成 ios/
```

完整运行时图片和离线音频属于版本媒体资产，见 `docs/MEDIA-ASSETS.md`。安装包不直接提交到 Git 历史，统一放 GitHub Actions Artifacts / Releases。二进制媒体资产会单独同步；在它们到位前 Android/iOS 构建工作流会主动失败，避免产出缺图或缺音频的残缺安装包。

## 隐私

票夹上传的 PDF、截图、二维码、订单号、持有人标签等均是**设备本地数据**，不得提交到公开仓库。仓库中的代码不得硬编码个人证件、订单凭证或 Apple/Android 签名密钥。
