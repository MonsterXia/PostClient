# post-client 维护指南

本指南说明规则内容、页面排版和生产发布的维护方式。项目功能范围及启动命令见 [README](../README.md)。

## 编辑规则正文

规则内容保存在 [`public/rules/rule.md`](../public/rules/rule.md)，页面运行时请求该文件。修改后需要随站点发布，线上内容才会更新。

保持一个一级标题，章节使用二级标题，章节内的小节使用三级标题，案例等更细的层级使用四级标题。将 `[TOC]` 单独放在标题后的段落中，渲染器会生成目录；四级及更深的标题不会进入目录。

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

- 普通条款使用项目符号列表；子列表缩进两个空格，不要用 `- [ ]` 任务复选框表示条款层级。
- 标题、段落和代码块之间保留必要的空行。列表项内部新增段落会改变列表结构，请检查实际渲染效果。
- 示例文本使用带 `text` 标记的围栏代码块；程序代码使用对应语言标记。
- 标题锚点由标题文本自动生成。修改标题后，检查正文中的章节链接和已有的外部引用；避免不必要的标题改名。
- 使用标准 Markdown 表达内容，不要添加 HTML 分页标签或用多余空行调整视觉间距。确需段内换行时，可使用 Markdown 行尾两个空格的语法。

## 调整排版与界面文案

正文样式集中在 [`ServerRules.css`](../src/pages/rules/ServerRules.css)，页面框架样式在 [`Root.css`](../src/pages/root/Root.css)。正文当前行高为 `1.7`；段落、列表项及其内部段落的间距分别受 CSS 控制。出现间距偏大时，应先检查这些元素的 margin 是否叠加。

界面文案维护于 [`src/locale`](../src/locale)。语言菜单只切换界面标签，规则正文仍来自同一份 Markdown。语言选择不持久保存，刷新后根据浏览器语言初始化。

## 发布前验证

在项目根目录运行：

```sh
npm run build
npm run lint
npm run preview
```

打开预览服务器输出的地址，检查：

- 首页和已下线的页面路径跳转到 `/rules`；直接打开或刷新 `/rules` 能正常显示。
- `/rules/rule.md` 返回规则正文，页面中的列表、附录、代码块及公式（如有）正确渲染。
- 目录默认折叠，展开后章节链接能够跳到对应标题；正文中的章节引用仍有效。
- 切换语言后界面标签更新，正文内容保持一致。
- 在桌面及窄屏（例如 320px、390px）下检查正文间距和页面横向溢出；修改打印样式时检查打印预览。

仅修改 README 或维护指南时，可检查文档内容、链接和 `git diff --check`，无需为文档变更重复运行页面测试。

## 提交与发布

开发改动在 `main` 提交，生产分支为 `release`。先确认工作区中的改动属于本次任务，再暂存相应文件并提交。以下流程假设使用本地已有的 `main`、`release` 分支；遇到分支分叉或合并冲突时，先解决并重新验证，不要强制推送覆盖远端。

```sh
git status
git fetch origin
git switch main
git merge --ff-only origin/main

# 暂存本次修改的具体文件，检查暂存差异后提交
# git add <本次修改的文件路径>
git diff --cached
git commit -m "docs: update post-client maintenance documentation"

git switch release
git merge --ff-only origin/release
git merge --no-edit main

npm run build
npm run lint

git push --atomic origin main release
git switch main
```

提交信息应描述实际改动；上面的信息用于文档更新。如果本次仅提交到主分支，提交后运行 `git push origin main` 即可，不执行后续 release 合并与推送步骤。

推送 `release` 后，检查对应提交的 Cloudflare Pages 状态或控制台部署记录，确认 `postserver` 项目部署成功。然后打开 [线上站点](https://post.246801357.xyz/)，检查规则内容、目录跳转以及 `/rules` 刷新是否正常。Git 推送成功不代表部署已经完成。

如果直连推送失败且本机已有可用代理，可通过单次命令的 `git -c http.proxy=<代理地址> push ...` 重试，无需修改仓库或全局 Git 配置。
