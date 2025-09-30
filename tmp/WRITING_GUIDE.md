# 写作格式参考（Frontmatter 规范与示例）

仅作参考文件，放在 tmp 下，不参与渲染。

## 必填字段
- title: 文章标题（string，非空）
- pubDate: 发布日期（YYYY-MM-DD）

## 可选字段
- author: 作者（string，缺省回落为 Magicalball）
- tags: 标签（string[]，如 ["学习", "ACG"]）
- description: 简介（string，用于 SEO/摘要）
- coverImage: 封面图（string，绝对路径以 "/" 开头，或完整 URL）

## 静态资源组织（建议，不强制）
- 每篇文章目录：`src/pages/posts/<slug>/index.md(x)`
- 每篇文章资源目录：`public/images/posts/<slug>/`
  - 例：文章 `src/pages/posts/221013/index.mdx` → 资源 `/images/posts/221013/`
- 封面：frontmatter 设置 `coverImage: "/images/posts/221013/cover.webp"`
- 正文图片：使用绝对路径（位于 public/）或你的组件引用
- 说明：原 `/pimages` 已废弃，请统一迁移到 `/images/posts/<slug>/`

## Markdown 示例（.md）
```md
---
layout: ../../../layouts/MarkdownPostLayout.astro
title: "示例标题：用 Docker 快速安装 MySQL"
pubDate: "2025-09-30"
# author 可省略：author: "Magicalball"
tags: ["学习", "教程"]
description: "这是一段简短的文章摘要，用于 SEO 和列表预览。"
coverImage: "/images/posts/250930/cover.webp"
---

这里是正文（支持标准 Markdown）。

![正文插图](/images/posts/250930/step-01.webp)
```

## MDX 示例（.mdx）
```mdx
---
layout: ../../../layouts/MarkdownPostLayout.astro
title: "示例标题：在平板上敲代码"
pubDate: "2025-09-30"
tags: ["学习"]
description: "使用 AidLux 配置开发环境的简单记录。"
coverImage: "/images/posts/250930/cover.webp"
---

import Image from '../../../components/Pimage.tsx';

正文支持 MDX：可以直接使用组件。

<Image src="/images/posts/250930/screen-01.webp" width="700px" />
```

## 注意事项
- 严格使用 YYYY-MM-DD；内部按 UTC 排序。
- 标签会去重/排序，命名尽量统一。
- 未提供 author 时回落为 "Magicalball"。
