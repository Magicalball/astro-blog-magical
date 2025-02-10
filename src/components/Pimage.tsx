import { h } from 'preact';

interface ImageProps {
  src: string;
  alt?: string;
  width?: string | number;
  height?: string | number;
}

const Image = ({ src, alt = '', width = 'auto', height = 'auto' }: ImageProps) => (
  <img 
    src={src} 
    alt={alt} 
    style={{ width: width, height: height }} 
  />
);

export default Image;
