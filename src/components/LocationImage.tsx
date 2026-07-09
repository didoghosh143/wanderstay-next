"use client";
import { useState } from "react";
import { useWikipediaImage } from "@/lib/exploreApi";
import { Loader2, Compass } from "lucide-react";

interface LocationImageProps {
  title: string;
  fallbackUrl: string;
  alt: string;
  className?: string;
  containerClassName?: string;
}

export function LocationImage({ title, fallbackUrl, alt, className = "", containerClassName = "" }: LocationImageProps) {
  const { data: imageUrl, isLoading, isError } = useWikipediaImage(title);
  const [imgLoaded, setImgLoaded] = useState(false);

  // If Wikipedia returns an image, we use it. Otherwise, use the fallback Unsplash image.
  const finalSrc = !isLoading && !isError && imageUrl ? imageUrl : fallbackUrl;

  return (
    <div className={`relative bg-gray-200 overflow-hidden flex items-center justify-center ${containerClassName}`}>
      {/* Loading Skeleton */}
      {(isLoading || (!imgLoaded && finalSrc)) && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 shimmer-skeleton">
          <Loader2 size={24} className="animate-spin text-gray-400" />
        </div>
      )}
      
      {/* Fallback Icon if Both Fail */}
      {!isLoading && !finalSrc && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200 text-gray-400">
          <Compass size={32} className="opacity-50 mb-2" />
          <span className="text-xs font-medium uppercase tracking-widest">No Image</span>
        </div>
      )}

      {/* Actual Image */}
      {finalSrc && (
        <img
          src={finalSrc}
          alt={alt}
          className={`${className} ${imgLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
          onLoad={() => setImgLoaded(true)}
          loading="lazy"
        />
      )}
    </div>
  );
}
