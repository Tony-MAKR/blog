# 本项目的协作规则

这是 **L的博客** 的项目目录。网站用 Hexo 生成，托管在 GitHub Pages 上。

---

## 一、用户是谁

用户**不懂编程**，会自己在 GitHub 网页上写文章、传图片、改错别字。

- **所有沟通用中文**，用大白话；不要贴大段代码让用户看
- 汇报时说清「改了什么、为什么改、现在什么效果」
- 涉及技术方案选择时，列出 2~3 个方案讲清优缺点，让用户拍板

## 二、每次开工前必做

1. **先 `git pull`** —— 用户可能已经在网页上改过内容
2. 推送被拒时**先查看远程多出什么**，绝对不要覆盖用户的内容

## 三、★ 更新日志义务（每次改动网站都要做）

**每次改动网站后，必须在更新日志文章里追加一行，并跟改动放在同一次提交里发布。**

- 文件：`source/_posts/tech/changelog.md`
- 位置：「更新记录」表格的**表头正下方第一行**（最新的在最上面），文件里有一行 `★ 维护提示` 注释标着位置
- 格式：`| 日期 | 使用的技术 / 工具 | 更新内容 |`
- 内容：简略说明「何时用何种技术实现了什么功能」
- 如果只是一处小修正，可并入当天已有的那一行，不必新开一行

这条规则的目的是让用户随时能看到「网站什么时候、因为什么而变过」。

## 四、容易踩的坑

- **图片路径**：Hexo 会自动在正文里的图片地址前补上 `/blog/` 前缀。
  用户在文章里写 `/img/图片名.jpg` 是**正确**的。
  **绝对不要建议用户加 `/blog/` 前缀** —— 那会变成 `/blog/blog/img/...`，图片反而显示不出来。
- **判断线上图片是否正常**，要看生成后网页 HTML 里的实际地址，不能拿 Markdown 原文里的路径直接去请求。
- `source/` 里以下划线开头的文件会被 Hexo 忽略（`_posts` 除外）。
- 若表格、正文格式错乱，多半是开头 `---` 之间的信息区被误删，或 `categories:`/`tags:` 下的缩进不对（`- ` 前要两个空格）。

## 五、github.com 连不上时的应对

本机 `github.com` 的 443 端口会**间歇性连不上**（`git push` 报 `Failed to connect ... port 443`），但 `api.github.com` 通常正常。

改用 API 通道提交：
1. `gh api repos/Tony-MAKR/blog/git/refs/heads/main --jq .object.sha` 取父提交
2. 逐个文件 POST `git/blobs`（内容 base64）→ POST `git/trees`（带 `base_tree`）→ POST `git/commits` → PATCH `git/refs/heads/main`
3. gh 的端点参数**不要写开头的斜杠**（Git Bash 会把 `/repos/...` 改写成 `D:/Git/repos/...`）
4. 完成后 `git fetch`，`git diff --stat main origin/main` 确认无差异，再 `git reset --hard origin/main`

下载文件改用 `codeload.github.com` 或国内镜像 `registry.npmmirror.com`。

## 六、改了结构要同步文档

网站结构、功能或发文方式有变动时，同步更新：

- `docs/发布指南.md` —— 写给用户看的操作教程（用户会照着做，写错会误导他）
- `docs/功能文档.md` —— 网站功能清单与状态

## 七、网站基本信息

| 项目 | 内容 |
|---|---|
| 网站 | https://tony-makr.github.io/blog/ |
| 仓库 | https://github.com/Tony-MAKR/blog |
| 本地目录 | `D:\Blog` |
| 文章位置 | `source/_posts/life/`（生活随笔）、`source/_posts/tech/`（技术笔记） |
| 图片位置 | `source/img/` |
| 发布方式 | 保存后 GitHub Actions 自动构建发布，1~2 分钟生效 |
| 查看结果 | 仓库 Actions 标签页，绿色对勾 ✅ = 发布成功 |
