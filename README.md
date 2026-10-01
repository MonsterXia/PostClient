# post-client

Post 社区规则展示站，规则页面位于 `/rules`。首页 `/` 和其他页面路径均由前端重定向到 `/rules`。

站点通过静态 Markdown 文件提供规则内容，无需配置业务环境变量。

## 当前功能

- 从 [`public/rules/rule.md`](public/rules/rule.md) 加载规则正文，支持 Markdown 列表、表格、代码高亮和数学公式。
- 根据 `[TOC]` 生成默认折叠的目录，包含一至三级标题，并支持标题锚点跳转。
- 提供适配桌面和移动端的阅读布局及打印样式。
- 支持中英文界面标签切换；规则正文仍为中文，不会自动翻译。刷新后按浏览器语言重新选择界面语言。

## 本地开发

推荐使用 [`.nvmrc`](.nvmrc) 指定的 Node.js 24，最低版本为 Node.js 22.22.0。

```sh
# 已安装 nvm 时使用
nvm install
nvm use

npm ci
npm run dev
```

打开终端输出的本地地址并访问 `/rules`。Vite 默认开发端口为 `5173`，实际端口以终端输出为准。

| 命令 | 用途 |
| --- | --- |
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 执行 TypeScript 检查并构建到 `dist/` |
| `npm run lint` | 执行 ESLint 检查 |
| `npm run preview` | 本地预览已生成的构建产物，需先运行构建 |

发布前运行构建和 lint，并按维护指南检查页面。

## 维护入口

| 文件或目录 | 用途 |
| --- | --- |
| [`public/rules/rule.md`](public/rules/rule.md) | 规则正文，修改条款时优先编辑此文件 |
| [`public/post.svg`](public/post.svg) | 站点标志 |
| [`src/pages/rules/ServerRules.tsx`](src/pages/rules/ServerRules.tsx) | Markdown 渲染、目录和标题锚点 |
| [`src/pages/rules/ServerRules.css`](src/pages/rules/ServerRules.css) | 正文排版、段落与列表间距、打印样式 |
| [`src/pages/root/Root.tsx`](src/pages/root/Root.tsx) / [`Root.css`](src/pages/root/Root.css) | 页面框架、页眉、页脚和语言菜单 |
| [`src/locale`](src/locale) | 中英文界面文案 |
| [`src/router/index.tsx`](src/router/index.tsx) | `/rules` 路由及重定向 |

规则编辑规范、页面检查和分支发布步骤见 [维护指南](docs/maintenance.md)。

## 部署

线上站点：[Post 社区规则](https://post.246801357.xyz/)。当前通过 Cloudflare Pages 的 `postserver` 项目部署，生产发布分支为 `release`；改动先进入 `main`，再合并到 `release` 触发部署。

构建命令为 `npm run build`，输出目录为 `dist`，构建环境建议使用 Node.js 24。Cloudflare Pages 的分支和构建设置由控制台管理，仓库内没有部署工作流文件。

站点按域名根路径部署，正文和标志分别从 `/rules/rule.md`、`/post.svg` 加载。托管服务需要支持 SPA 回退到 `index.html`，才能直接打开或刷新 `/rules`，并让其他页面路径进入前端重定向逻辑。推送成功后还需确认 Cloudflare Pages 部署成功，详见维护指南。
