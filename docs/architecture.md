# post-client 实现说明

本文描述当前代码的结构和运行行为。开发命令见 [README](../README.md)，操作步骤见 [维护指南](maintenance.md)。

## 页面结构与路由

[`src/main.tsx`](../src/main.tsx) 在 React `StrictMode` 中挂载 `RouterProvider`。路由使用浏览器 History API，定义于 [`src/router/index.tsx`](../src/router/index.tsx)。

| 路径 | 行为 |
| --- | --- |
| `/rules` | 在公共页面框架中显示规则正文 |
| `/` | 使用 `replace` 重定向到 `/rules` |
| 其他页面路径 | 使用 `replace` 重定向到 `/rules` |

[`Root.tsx`](../src/pages/root/Root.tsx) 提供页眉、导航、语言选择框、`main` 和页脚，`Outlet` 承载规则页面。正文通过 JavaScript 请求和渲染，没有服务端渲染或预渲染步骤。直接访问页面路径时，静态托管服务必须先返回 HTML 入口。

## 正文加载与状态

[`ServerRules.tsx`](../src/pages/rules/ServerRules.tsx) 使用 `loading`、`ready`、`error` 三种互斥状态：

1. 挂载后请求 `/rules/rule.md`，初始显示中英文加载提示。
2. 检查 `response.ok`，读取正文，并拒绝空白文本以及以 `<!doctype html` 或 `<html` 开头的常见 HTML 回退响应。
3. 根据正文加载渲染插件。插件加载完成后进入 `ready`，一次性展示正文。
4. 请求、响应验证或插件加载失败时进入 `error`，显示提示和重试按钮，并通过 `console.error` 记录错误。
5. 点击重试重新进入 `loading` 并发起请求。组件清理时通过 `AbortController` 取消请求；已取消的加载不会更新状态或显示错误。

没有自动重试、应用层正文缓存或请求超时配置。网络请求长期未完成时会保持加载状态；浏览器自身的 HTTP 缓存仍受响应头控制。HTML 回退检测针对上述常见开头，不是通用 HTML 校验器。

## Markdown 渲染

正文交给 `react-markdown` 渲染，插件由 [`markdown.ts`](../src/pages/rules/markdown.ts) 装配。

| 能力 | 实现与加载条件 |
| --- | --- |
| GFM 列表、表格等 | 每份正文加载 `remark-gfm` |
| 标题锚点 | 每份正文加载 `rehype-slug` |
| 目录 | 本地 `remarkToc` 配合 `mdast-util-toc` |
| 数学公式 | 原文包含 `$` 时加载 `remark-math`、`rehype-katex` 和 KaTeX CSS |
| 代码高亮 | 检测到带语言标记的反引号或波浪线围栏时加载 `rehype-highlight` 和高亮 CSS；`text`、`plain`、`plaintext` 不触发加载 |

插件条件检查基于原文，是加载优化而非语法校验。出现 `$` 不一定代表存在公式；未知代码语言通过 `ignoreMissing` 保留普通显示。未标语言的代码块不触发高亮加载。依赖通过动态导入拆分，构建产物中存在插件文件不代表每次访问都会请求全部插件。

没有启用 `rehype-raw`，正文中的 HTML 不作为任意 HTML 元素执行。内容应使用 Markdown 表达。

### 目录与代码块

`remarkToc` 查找文档顶层第一个独立的 `[TOC]` 段落：段落必须只有一个文本节点，内容精确匹配 `[TOC]`。嵌在说明文字、列表或其他结构中的标记不会作为目录入口。

目录生成器设置 `maxDepth: 3`。按规则正文“一级文档标题、二级章节、三级小节”的结构，目录展示章节与小节，四级标题不收录。生成的列表带有 `toc-list` 标记，渲染为默认折叠的原生 `details`。代码块使用统一的 `pre.code-block` 样式，行内代码由 CSS 按所在结构区分。

### 章节定位

正文完成渲染后，通过 `requestAnimationFrame` 查找 URL hash 对应的标题并调用 `scrollIntoView`。页面也监听 `hashchange`；CSS 为标题设置 `scroll-margin-top: 28px`。找不到目标时不滚动，无法解码的 hash 不影响阅读。

标题文字决定锚点。修改标题可能使已有引用失效，应检查生成后的链接，避免手工猜测锚点。

## 语言与可访问性

语言状态仅存在于 `Root` 组件。浏览器语言以 `zh` 开头时默认中文，否则默认英文；不使用本地存储，刷新后重新初始化。

[`locale.json`](../src/locale/locale.json) 提供站点名、规则链接、语言选择标签和版权文案。导航名称和“跳至正文”文案在 `Root.tsx` 中定义；加载、错误、重试和目录标签在规则组件中使用固定双语文本。

切换语言会同步 `document.title` 和 HTML 的 `lang`。正文 `article` 始终标记为 `zh-CN`，不会翻译规则内容。

键盘可聚焦“跳至正文”链接，将焦点移至 `main#main-content`。正文容器不显示整圈焦点轮廓，交互控件保留 `:focus-visible` 提示。加载状态使用 `role="status"` 与 `aria-busy`，错误使用 `role="alert"`。

## 样式与构建边界

- [`src/index.css`](../src/index.css)：字体、颜色、全局盒模型、选择颜色和控件焦点样式；页面最小宽度为 320px。
- [`Root.css`](../src/pages/root/Root.css)：页面框架与语言控件，600px 以下采用窄屏布局。
- [`ServerRules.css`](../src/pages/rules/ServerRules.css)：正文行高、列表、目录、代码、公式、表格和打印样式。正文行高为 `1.7`，宽代码块、表格和块级公式允许局部横向滚动。
- 打印样式隐藏页眉、文档标签、目录及跳转入口，简化正文边框、阴影与留白；页脚仍保留。

Vite 将应用及动态插件构建到 `dist/`，并复制 `public/` 中的资源。正文、标志和图标使用根路径 URL，当前配置面向域名根目录部署。修改 HTML 入口、应用代码或正文都需要重新构建并部署。

## 测试边界

[`tests/markdown.test.ts`](../tests/markdown.test.ts) 使用 Node.js 内置测试运行器及 TypeScript 类型擦除，覆盖目录 slug、四级标题排除、非独立标记保留、无标记文档和空文档。

`npm test` 不验证浏览器 DOM、动态插件加载、请求失败恢复、样式或打印。`npm run build` 检查 TypeScript 项目并生成产物；`npm run lint` 执行静态检查。发布前还需完成维护指南中的浏览器检查，仓库没有单独的浏览器端到端测试脚本。
