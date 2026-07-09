import Image from "next/image";

interface LocationImageProps {
  title?: string;
  fallbackUrl: string;
  alt: string;
  className?: string;
  containerClassName?: string;
}

export function LocationImage({ fallbackUrl, alt, className = "", containerClassName = "" }: LocationImageProps) {
  // Avoid forcing 'relative' if 'absolute' is already provided
  const positionClass = containerClassName.includes("absolute") ? "" : "relative";
  
  return (
    <div className={`${positionClass} w-full h-full ${containerClassName}`.trim()}>
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

