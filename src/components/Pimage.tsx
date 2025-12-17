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

  return (
    <img 
      src={inView ? src : undefined}
      data-src={!inView ? src : undefined}
      alt={alt} 
      style={{ 
        width: width, 
        height: height,
        maxWidth: '100%',
        opacity: loaded ? 1 : 0.8,
        transition: 'opacity 0.3s ease'
      }}
      loading={priority ? 'eager' : 'lazy'}
      fetchpriority={priority ? 'high' : 'auto'}
      onLoad={() => setLoaded(true)}
      onError={() => {
        // 图片加载失败处理
        setLoaded(false);
      }}
    />
  );
};

export default Image;
