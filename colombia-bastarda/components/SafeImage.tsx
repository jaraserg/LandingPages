"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
  priority?: boolean;
}

const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1493514789931-586cb221d7a7?w=800&auto=format&fit=crop&q=60';

export default function SafeImage({ src, alt, className, fallback = DEFAULT_FALLBACK, priority = false }: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src || fallback);

  useEffect(() => {
    setImgSrc(src || fallback);
  }, [src, fallback]);

  return (
    <div className={`relative ${className}`}>
      <Image
        src={imgSrc}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 768px) 100vw, 800px"
        className="object-cover"
        onError={() => setImgSrc(fallback)}
      />
    </div>
  );
}
