import { useState, useEffect, useRef, useMemo } from 'preact/hooks';
import { VIRTUAL_LIST_CONFIG } from '../utils/getPosts';

interface VirtualBlogListProps {
  posts: any[]; // 原始的 Astro.glob 结果或标准化后的PostData数组
  itemHeight?: number;
  className?: string;
}

export default function VirtualBlogList({
  posts,
  itemHeight = VIRTUAL_LIST_CONFIG.itemHeight,
  className = ''
}: VirtualBlogListProps) {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(800); // 动态计算容器高度
  const containerRef = useRef<HTMLDivElement>(null);

  // 计算可见范围 (优化依赖)
  const visibleRange = useMemo(() => {
    const viewportHeight = containerHeight;
    const start = Math.floor(scrollTop / itemHeight);
    const visibleCount = Math.ceil(viewportHeight / itemHeight);
    const end = Math.min(
      start + visibleCount + VIRTUAL_LIST_CONFIG.bufferSize * 2,
      posts.length
    );
    
    const rangeStart = Math.max(0, start - VIRTUAL_LIST_CONFIG.bufferSize);
    const rangeEnd = end;
    
    return { start: rangeStart, end: rangeEnd };
  }, [scrollTop, itemHeight, containerHeight, posts.length]);

  // 获取可见的文章 (使用 useRef 缓存避免频繁重新计算)
  const visiblePostsCache = useRef<{ range: string; posts: any[] }>({ range: '', posts: [] });
  
  const visiblePosts = useMemo(() => {
    const rangeKey = `${visibleRange.start}-${visibleRange.end}`;
    
    // 如果范围没有变化，返回缓存的结果
    if (visiblePostsCache.current.range === rangeKey) {
      return visiblePostsCache.current.posts;
    }
    
    // 计算新的可见文章
    const newPosts = posts.slice(visibleRange.start, visibleRange.end);
    
    // 更新缓存
    visiblePostsCache.current = {
      range: rangeKey,
      posts: newPosts
    };
    
    return newPosts;
  }, [posts, visibleRange]);

  // 总高度
  const totalHeight = posts.length * itemHeight;

  // 防抖的滚动事件处理器
  const scrollTimeoutRef = useRef<number | null>(null);
  
  const handlePageScroll = () => {
    // 清除之前的定时器
    if (scrollTimeoutRef.current) {
      cancelAnimationFrame(scrollTimeoutRef.current);
    }
    
    // 使用 requestAnimationFrame 优化性能
    scrollTimeoutRef.current = requestAnimationFrame(() => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const viewportTop = -rect.top;
        setScrollTop(Math.max(0, viewportTop));
        setContainerHeight(window.innerHeight);
      }
    });
  };

  // 绑定页面滚动事件
  useEffect(() => {
    // 初始化容器高度
    setContainerHeight(window.innerHeight);
    
    // 监听页面滚动
    window.addEventListener('scroll', handlePageScroll, { passive: true });
    window.addEventListener('resize', handlePageScroll, { passive: true });
    
    // 初始调用
    handlePageScroll();
    
    return () => {
      // 清理事件监听器
      window.removeEventListener('scroll', handlePageScroll);
      window.removeEventListener('resize', handlePageScroll);
      
      // 清理待执行的动画帧
      if (scrollTimeoutRef.current) {
        cancelAnimationFrame(scrollTimeoutRef.current);
        scrollTimeoutRef.current = null;
      }
      
      // 清理所有缓存
      dateCache.current.clear();
      visiblePostsCache.current = { range: '', posts: [] };
    };
  }, []);

  // 缓存格式化的日期以避免重复计算
  const dateCache = useRef<Map<string, string>>(new Map());
  
  const getFormattedDate = (dateStr: string) => {
    if (!dateCache.current.has(dateStr)) {
      const formatted = new Date(dateStr).toLocaleDateString();
      dateCache.current.set(dateStr, formatted);
    }
    return dateCache.current.get(dateStr)!;
  };

  // 渲染单个文章项（内存优化版本）
  const renderPostItem = (post: any, index: number) => {
    const actualIndex = visibleRange.start + index;
    
    // 适配不同的数据格式：原始 Astro.glob 结果或标准化的 PostData
    const title = post.frontmatter?.title || post.title;
    const url = post.url;
    const pubDate = post.frontmatter?.pubDate || post.pubDate;
    
    const formattedDate = getFormattedDate(pubDate);

    return (
      <section
        key={`post-${actualIndex}-${url}`} // 更稳定的key
        class="blog-post"
        style={{
          position: 'absolute',
          top: `${actualIndex * itemHeight}px`,
          left: 0,
          right: 0,
          height: `${itemHeight}px`,
          // 移除动画延迟以减少内存占用
        }}
      >
        <div class="block">
          <h2>
            <a href={url} style={{ textDecoration: 'none', color: 'inherit' }}>
              {title}
            </a>
          </h2>
          <p>{formattedDate}</p>
        </div>
      </section>
    );
  };

  return (
    <div class={`virtual-blog-list ${className}`}>
      <style>{`
        .virtual-blog-list .blog-post {
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding: 0.5rem;
          border-radius: 4px;
        }

        .virtual-blog-list .block {
          display: flex;
          flex-direction: column;
          border-radius: 8px;
          box-shadow: 0 5px 8px #c8c8c8;
          overflow: hidden;
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 0.8s forwards;
          animation-delay: 0.2s;
          background-size: cover;
          background-position: center;
          border-bottom: 3px solid #c4c4c4;
          background-color: rgb(255, 255, 255);
          padding: 16px;
        }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* 虚拟列表容器样式 */
        .virtual-blog-list {
          width: 100%;
          position: relative;
        }
      `}</style>
      <div
        ref={containerRef}
        style={{
          height: `${totalHeight}px`,
          position: 'relative',
          width: '100%'
        }}
      >
        {visiblePosts.map(renderPostItem)}
      </div>
    </div>
  );
}
