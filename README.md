# post-client

Post 社区规则展示站。规则页面位于 `/rules`，首页 `/` 和其他页面路径由前端重定向到 `/rules`。站点通过静态 Markdown 文件提供正文，无需后端 API、登录或业务环境变量。

线上地址：[Post 社区规则](https://post.246801357.xyz/)。

## 功能

- 展示规则正文，支持嵌套列表、表格、代码块及数学公式。
- 根据正文中的 `[TOC]` 生成默认折叠的章节目录，收录到三级标题；支持正文内引用和直接访问章节锚点。
- 提供加载提示和失败重试，检测 HTTP 错误、空正文及常见的 HTML 回退响应。
- 使用原生选择框切换中英文界面标签，同时更新浏览器标题和页面语言标记。正文始终为中文，语言选择不持久保存。
- 提供移动端布局、打印样式和键盘“跳至正文”入口。

## 开始开发

使用 [`.nvmrc`](.nvmrc) 指定的 Node.js 24；[`package.json`](package.json) 要求 Node.js 至少为 22.22.0。使用 npm 和仓库内的 `package-lock.json` 安装依赖。

```sh
# 使用 nvm 管理 Node.js 时执行
nvm install
nvm use

npm ci
npm run dev
```

打开终端输出的地址并访问 `/rules`。开发服务器默认端口为 `5173`，实际端口以终端输出为准。

| 命令 | 用途 |
| --- | --- |
| `npm run dev` | 启动 Vite 开发服务器 |
| `npm run build` | 执行 TypeScript 项目构建检查，并将静态产物输出到 `dist/` |
| `npm run lint` | 执行 ESLint 检查 |
| `npm test` | 通过 Node.js 测试运行器检查目录生成逻辑 |
| `npm run preview` | 预览已有的 `dist/`，默认端口为 `4173`，需先构建 |

## 技术与目录

项目使用 React、TypeScript、React Router 和 Vite（React SWC 插件）。正文由 React Markdown 渲染，GFM、标题锚点、公式及代码高亮由 remark/rehype 插件处理。界面语言使用组件内状态管理。

| 入口 | 用途 |
| --- | --- |
| [`public/rules/rule.md`](public/rules/rule.md) | 规则正文 |
| [`public/post.svg`](public/post.svg) | 站点标志和图标 |
| [`index.html`](index.html) | HTML 入口、默认标题、描述和语言标记 |
| [`src/main.tsx`](src/main.tsx) | React 与路由入口 |
| [`src/router/index.tsx`](src/router/index.tsx) | 页面路由及重定向 |
| [`src/pages/root/Root.tsx`](src/pages/root/Root.tsx) | 页眉、页脚、语言选择及正文入口 |
| [`src/pages/rules/ServerRules.tsx`](src/pages/rules/ServerRules.tsx) | 正文加载、错误重试、渲染及章节定位 |
| [`src/pages/rules/markdown.ts`](src/pages/rules/markdown.ts) | 目录生成与渲染插件加载 |
| [`src/locale/locale.json`](src/locale/locale.json) | 中英文界面文案 |
| [`src/index.css`](src/index.css)、[`Root.css`](src/pages/root/Root.css)、[`ServerRules.css`](src/pages/rules/ServerRules.css) | 全局、页面框架和正文样式 |
| [`tests/markdown.test.ts`](tests/markdown.test.ts) | 目录生成单元测试 |
| [`vite.config.ts`](vite.config.ts) | 构建插件及 `@` 到 `src` 的路径别名 |

## 验证与部署

```sh
npm run build
npm run lint
npm test
npm run preview
```

自动测试覆盖目录生成，浏览器交互、网络失败、响应式布局和打印效果需要另外检查，详见 [维护指南](docs/maintenance.md)。

当前生产部署使用 Cloudflare Pages 的 `postserver` 项目和 `release` 分支。改动先在 `main` 提交，再合并到 `release`。构建命令为 `npm run build`，输出目录为 `dist`，构建环境建议使用 Node.js 24。分支和构建设置由 Cloudflare Pages 控制台管理，仓库未定义部署工作流。

站点按域名根路径部署，托管服务需支持 SPA 回退到 `index.html`，并正常提供 `/rules/rule.md` 和 `/post.svg` 等静态资源。Git 推送成功后还需确认部署状态和线上页面。

## 文档

- [维护指南](docs/maintenance.md)：规则编辑、样式调整、验证、发布及故障排查。
- [实现说明](docs/architecture.md)：组件职责、数据加载、Markdown 插件、语言与可访问性。
