# post-client 维护指南

本指南用于维护规则内容、阅读界面和生产部署。项目入口见 [README](../README.md)，组件与加载机制见 [实现说明](architecture.md)。

## 开发环境

使用 Node.js 24 和 npm。在项目根目录执行 `npm ci`，按 `package-lock.json` 安装依赖，再运行 `npm run dev`。`.nvmrc` 指定 Node.js 24，`package.json` 要求至少 22.22.0。开发和构建不需要业务环境变量。

修改依赖时同步提交 `package.json` 与 `package-lock.json`。构建产物位于被 Git 忽略的 `dist/`，不要手工编辑或提交。

## 编辑规则正文

编辑 [`public/rules/rule.md`](../public/rules/rule.md)。该文件会被复制到构建产物，页面运行时从 `/rules/rule.md` 请求；修改后需要重新构建和发布。

保留一个一级文档标题，章节使用二级标题，小节使用三级标题，案例等更细内容使用四级标题。将 `[TOC]` 作为独立段落放在文档标题之后，只放一次，不要放进列表或与说明文字混写。目录收录到三级标题。

````markdown
# 社区规则

[TOC]

## 一、基本规定

### 适用范围

- 主要条款。
  - 从属于该条款的说明。
  - 同级的另一项说明。

#### 案例说明

```text
需要保留换行和缩进的示例文本。
```
````

| 内容 | 编辑要求 |
| --- | --- |
| 条款列表 | 使用项目符号；示例中的无序子列表缩进两个空格，不使用任务复选框表达条款层级 |
| 标题和段落 | 保留必要空行，不用额外空行调整视觉间距 |
| 示例文本 | 使用 `text`、`plain` 或 `plaintext` 围栏，避免不必要的语法高亮 |
| 程序代码 | 使用对应的语言标记，例如 `javascript`；无标记围栏按普通代码块显示 |
| 数学公式 | 使用 `$...$` 行内公式或 `$$...$$` 块级公式，检查最终 KaTeX 渲染 |
| 段内换行 | 确需换行时使用行尾两个空格，注意不要被格式化工具意外删除 |
| 章节引用 | 从渲染页面复制目标链接；标题改动后复查引用，标题文字会影响锚点 |
| HTML | 使用 Markdown 表达内容，不依赖 HTML 标签、内联样式或分页标签 |

## 调整界面

正文排版在 [`ServerRules.css`](../src/pages/rules/ServerRules.css)，页面框架在 [`Root.css`](../src/pages/root/Root.css)，全局字体与焦点样式在 [`src/index.css`](../src/index.css)。正文行高为 `1.7`；调整列表间距时同时检查列表、列表项和内部段落的 margin。

中英文常用界面文案在 [`locale.json`](../src/locale/locale.json)，每个键包含 `zh`、`en`。导航名称和跳转入口在 [`Root.tsx`](../src/pages/root/Root.tsx)，固定双语状态提示在 [`ServerRules.tsx`](../src/pages/rules/ServerRules.tsx)。修改时按文案所在位置更新。

原生语言选择框只切换界面标签及页面标题，规则正文仍为中文。选择不持久保存，刷新后按浏览器语言初始化。HTML 默认标题、描述和图标在 [`index.html`](../index.html)，应用启动后标题会随语言更新。

## 验证改动

在项目根目录执行：

```sh
npm run build
npm run lint
npm test
npm run preview
```

预览命令持续运行，默认端口为 `4173`，实际地址以终端输出为准；结束时按 Ctrl+C。需要固定本机访问地址时，可运行 `npm run preview -- --host 127.0.0.1 --port 4173`。

自动测试仅覆盖目录生成逻辑，不代表下面的浏览器检查已完成：

| 检查 | 预期结果 |
| --- | --- |
| 打开首页、其他页面路径 | 重定向至 `/rules` |
| 直接打开或刷新 `/rules` | 正文正常加载，静态资源无 404 |
| 慢速网络 | 显示加载提示，完成后展示正文 |
| 正文请求失败 | 显示错误提示；恢复网络后点击重试可恢复 |
| 正文返回空文本或 HTML 入口 | 显示错误提示，不把响应当成正常正文 |
| 目录展开、章节引用 | 目录默认折叠，链接目标存在且跳转正确 |
| 直接访问 `/rules#章节锚点` | 正文渲染完成后定位到目标标题 |
| Markdown 排版 | 列表、表格、代码块及公式正确显示 |
| 切换界面语言 | 标签、页面标题及 HTML 语言标记更新，正文保持中文 |
| 键盘操作 | Tab 可访问跳转入口和控件；跳至正文后无整圈容器边框，控件保留焦点提示 |
| 桌面与 320px、390px 窄屏 | 无页面级横向溢出，正文可读 |
| 打印预览 | 页眉和目录隐藏，正文排版正常 |
| 控制台与页面 | 正常加载无应用错误、空白页或开发错误遮罩 |

可在浏览器开发者工具中使用网络限速或请求阻止模拟慢速、断网；恢复后点击重试。HTTP 错误状态、空响应或 HTML 回退的验证需要本地响应替换或测试工具模拟，不要通过破坏生产文件来测试。

评估体积时，先构建，再从预览页面的网络面板统计实际加载的 JS、CSS 和字体。公式、高亮插件按内容加载，不能只比较入口文件大小，也不能将 `dist/assets` 中所有文件都视为首次访问下载量。

仅修改说明文档时，核对内容、链接、命令并运行 `git diff --check` 即可。规则正文属于页面输入，修改后应检查实际渲染。

## 提交与发布

开发分支为 `main`，生产发布分支为 `release`。以下命令假设两条本地分支已存在；每一步成功后再继续，遇到分叉或冲突时先处理并重新验证。

在开始修改前，保持工作区干净并同步主分支：

```sh
git fetch origin
git switch main
git merge --ff-only origin/main
```

完成修改和验证后，暂存本次涉及的具体文件，检查后提交。以文档变更为例：

```sh
git add README.md docs/maintenance.md docs/architecture.md
git diff --cached --check
git diff --cached
git commit -m "docs: update project documentation"
```

如果改动包含代码、测试或依赖，按实际内容暂存文件并调整提交信息。已有未提交改动时，先确认归属并妥善处理，不要直接切分支或覆盖文件。

发布到两个分支：

```sh
git fetch origin
git switch main
git merge --ff-only origin/main
git switch release
git merge --ff-only origin/release
git merge --no-edit main

npm ci
npm run build
npm run lint
npm test

git push --atomic origin main release
git switch main
```

合并后确认最终差异和构建结果，不使用强制推送覆盖远端。如果只更新主分支，提交后执行 `git push origin main`，不执行 release 合并和推送。

Cloudflare Pages 使用 `postserver` 项目、`release` 生产分支、`npm run build` 构建命令和 `dist` 输出目录。控制台中的构建环境建议设置为 Node.js 24；这些平台设置不由仓库内工作流管理。

部署面向域名根路径。托管服务应将页面路由回退到 `index.html`，同时正常返回真实静态资源，尤其是 `/rules/rule.md` 和 `/post.svg`。资源请求不能被错误地替换为 HTML 入口。

推送后检查对应提交的 Cloudflare Pages 状态或控制台部署记录，确认成功，再打开 [线上站点](https://post.246801357.xyz/) 验证正文、章节链接和页面刷新。推送成功不等于部署完成。

## 常见问题

| 现象 | 检查方式 |
| --- | --- |
| Node.js 引擎警告或测试无法启动 | 检查 `node --version`，使用 `.nvmrc` 指定的版本后重新安装依赖 |
| 正文加载失败 | 查看 `/rules/rule.md` 的状态码和响应内容；检查动态 JS、CSS 请求及控制台错误 |
| 一直显示加载中 | 检查是否有未完成的网络请求；当前没有应用级超时 |
| 刷新 `/rules` 返回 404 | 检查托管平台 SPA 回退配置 |
| 目录不显示 | 确认 `[TOC]` 是独立顶层段落，且存在可生成目录的章节标题 |
| 章节链接失效 | 检查标题是否改名及目标元素的实际 ID |
| 代码没有高亮 | 检查围栏语言；普通文本、无语言标记及未知语言不保证高亮 |
| 部署后内容未更新 | 核对 release 提交、部署状态、资源响应和浏览器缓存 |
| Git 直连失败 | 确认可用代理后通过单次命令的 `git -c http.proxy=<代理地址> push ...` 重试，无需改动全局配置 |
