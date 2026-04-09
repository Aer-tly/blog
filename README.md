# Aertly

一个偏静态、偏手札感的个人博客。

## 当前结构

- `index.html`：首页封面
- `essays.html`：文章列表页
- `projects.html`：笔记列表页
- `about.html`：关于页
- `post.html`：文章详情页，使用 `?slug=...`
- `note.html`：笔记详情页，使用 `?slug=...`
- `styles.css`：全站视觉样式
- `content.js`：站点内容数据
- `app.js`：页面渲染、评论、音乐和动画逻辑
- `supabase-comments.sql`：评论表 SQL
- `supabase-pageviews.sql`：首页浏览量表 SQL
- `supabase-config.js`：Supabase 配置

## 如何更新内容

- 新增文章：在 `content.js` 的 `posts` 数组里添加对象
- 新增笔记：在 `content.js` 的 `projects` 数组里添加对象
- 修改关于页：编辑 `content.js` 的 `about` 对象
- 修改样式：编辑 `styles.css`

## 评论配置

1. 在 Supabase 创建项目
2. 执行 `supabase-comments.sql`
3. 在 `supabase-config.js` 填入项目地址和 `anonKey`

完成后，文章页和笔记页的评论会保存到线上数据库。

## 浏览量配置

1. 在 Supabase 执行 `supabase-pageviews.sql`
2. 首页会开始统计 `page_views` 表里的访问记录

如果没有执行这一步，首页会先用本地浏览器计数作为回退。
