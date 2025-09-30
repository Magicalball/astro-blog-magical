import { validateFrontmatter } from './validation';
// 文章数据获取工具函数
export interface PostData {
  url: string;
  title: string;
  pubDate: string;
  author: string;
  tags: string[];
  description?: string;
}

// 从 Astro.glob 结果转换为标准化的文章数据
export function normalizePost(post: any): PostData {
  // 轻量校验与标准化（不改变渲染结构）
  const fm = validateFrontmatter(post.frontmatter);
  return {
    url: post.url,
    title: fm.title,
    pubDate: fm.pubDate,
    author: fm.author,
    tags: fm.tags || [],
    description: fm.description
  };
}

// 虚拟滚动配置
export const VIRTUAL_LIST_CONFIG = {
  itemHeight: 120, // 每个文章项的预估高度
  containerHeight: 600, // 容器高度
  bufferSize: 3, // 缓冲区大小 (优化: 从5减少到3)
  pageSize: 20 // 每页加载的文章数量
};
