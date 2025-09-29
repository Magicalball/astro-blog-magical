import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';

interface ImageProps {
  src: string;
  alt?: string;
  width?: string | number;
  height?: string | number;
  lazy?: boolean;
  priority?: boolean;
}

const Image = ({ 
  src, 
  alt = '', 
  width = 'auto', 
  height = 'auto', 
  lazy = true,
  priority = false 
}: ImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(!lazy || priority);

  useEffect(() => {
    if (!lazy || priority) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const imgElement = document.querySelector(`img[data-src="${src}"]`);
    if (imgElement) {
      observer.observe(imgElement);
    }

    return () => observer.disconnect();
  }, [src, lazy, priority]);

  // WebP支持检测
  const getOptimizedSrc = (originalSrc: string) => {
    // 如果是外部链接，直接返回
    if (originalSrc.startsWith('http')) return originalSrc;
    
    // 检查是否支持WebP
    const supportsWebP = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    };

    // 生成WebP版本的路径
    if (supportsWebP() && (originalSrc.endsWith('.jpg') || originalSrc.endsWith('.png'))) {
      return originalSrc.replace(/\.(jpg|png)$/, '.webp');
    }
    
    return originalSrc;
  };

  return (
    <img 
      src={inView ? getOptimizedSrc(src) : undefined}
      data-src={!inView ? src : undefined}
      alt={alt} 
      style={{ 
        width: width, 
        height: height,
        opacity: loaded ? 1 : 0.8,
        transition: 'opacity 0.3s ease'
      }}
      loading={priority ? 'eager' : 'lazy'}
      fetchpriority={priority ? 'high' : 'auto'}
      onLoad={() => setLoaded(true)}
      onError={(e) => {
        // WebP失败时回退到原格式
        const target = e.target as HTMLImageElement;
        if (target.src.includes('.webp')) {
          target.src = src;
        }
      }}
    />
  );
};

export default Image;
