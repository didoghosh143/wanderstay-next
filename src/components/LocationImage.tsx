import Image from "next/image";

interface LocationImageProps {
  title?: string;
  fallbackUrl: string;
  alt: string;
  className?: string;
  containerClassName?: string;
}

export function LocationImage({ fallbackUrl, alt, className = "", containerClassName = "" }: LocationImageProps) {
  return (
    <div className={`relative ${containerClassName}`}>
      {fallbackUrl && (
        <Image
          src={fallbackUrl}
          alt={alt}
          fill
          className={className}
        />
      )}
    </div>
  );
}
