import React, { useState } from "react";
import Image from "next/image";
import ImagePlaceholder from "@/components/ImagePlaceholder";

interface RecipeCardImageProps {
  image?: string;
  title: string;
  source: string;
}

export default function RecipeCardImage({
  image,
  title,
  source,
}: RecipeCardImageProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="px-6">
      <div className="relative h-48 overflow-hidden rounded-lg">
        {image && !imageError ? (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <ImagePlaceholder
            title={title}
            cuisine={
              source === "fallback-enhanced" ? "Italian" : "International"
            }
            className="h-48"
            ingredients={[]}
          />
        )}
      </div>
    </div>
  );
}
