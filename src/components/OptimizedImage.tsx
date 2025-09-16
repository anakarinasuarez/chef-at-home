import { memo, useState } from "react";
import Image from "next/image";
import ImagePlaceholder from "./ImagePlaceholder";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
  fill?: boolean;
  sizes?: string;
  quality?: number;
}

const OptimizedImage = memo<OptimizedImageProps>(
  ({
    src,
    alt,
    width,
    height,
    className = "",
    priority = false,
    placeholder = "empty",
    blurDataURL,
    onLoad,
    onError,
    fill = false,
    sizes,
    quality = 75,
  }) => {
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const handleLoad = () => {
      setIsLoading(false);
      onLoad?.();
    };

    const handleError = () => {
      setIsLoading(false);
      setHasError(true);
      onError?.();
    };

    // Si hay error, mostrar ImagePlaceholder
    if (hasError) {
      return (
        <ImagePlaceholder
          title={alt}
          cuisine="International"
          className={className}
          ingredients={[]}
        />
      );
    }

    // Si es una imagen externa, usar el componente Image de Next.js con configuración especial
    if (src.startsWith("http")) {
      return (
        <div className={`relative ${className}`}>
          <Image
            src={src}
            alt={alt}
            width={width || 400}
            height={height || 300}
            className={`transition-opacity duration-300 ${
              isLoading ? "opacity-0" : "opacity-100"
            }`}
            priority={priority}
            placeholder={placeholder}
            blurDataURL={blurDataURL}
            onLoad={handleLoad}
            onError={handleError}
            quality={quality}
            sizes={sizes}
            unoptimized={false} // Permitir optimización de Next.js
          />
        </div>
      );
    }

    // Para imágenes locales o con fill
    if (fill) {
      return (
        <div className={`relative ${className}`}>
          <Image
            src={src}
            alt={alt}
            fill
            className={`object-cover transition-opacity duration-300 ${
              isLoading ? "opacity-0" : "opacity-100"
            }`}
            priority={priority}
            placeholder={placeholder}
            blurDataURL={blurDataURL}
            onLoad={handleLoad}
            onError={handleError}
            quality={quality}
            sizes={sizes}
          />
        </div>
      );
    }

    // Imagen estándar
    return (
      <Image
        src={src}
        alt={alt}
        width={width || 400}
        height={height || 300}
        className={`transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        } ${className}`}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        onLoad={handleLoad}
        onError={handleError}
        quality={quality}
        sizes={sizes}
      />
    );
  }
);

OptimizedImage.displayName = "OptimizedImage";

export default OptimizedImage;
