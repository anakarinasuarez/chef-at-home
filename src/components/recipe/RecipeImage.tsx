import ImagePlaceholder from "../ImagePlaceholder";
import OptimizedImage from "../OptimizedImage";

interface Recipe {
  title: string;
  image?: string;
  source: string;
}

interface RecipeImageProps {
  recipe: Recipe;
  imageError: boolean;
  onImageError: () => void;
}

/**
 * Componente especializado en mostrar la imagen de una receta
 * Responsabilidad única: Renderizar imagen de receta con fallback
 */
export const RecipeImage = ({
  recipe,
  imageError,
  onImageError,
}: RecipeImageProps) => {
  return (
    <div className="px-6">
      <div className="relative h-48 overflow-hidden rounded-lg">
        {recipe.image && !imageError ? (
          <OptimizedImage
            src={recipe.image}
            alt={recipe.title}
            width={400}
            height={192}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={onImageError}
            quality={80}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <ImagePlaceholder
            title={recipe.title}
            cuisine={
              recipe.source === "fallback-enhanced"
                ? "Italian"
                : "International"
            }
            className="h-48"
            ingredients={[]}
          />
        )}
      </div>
    </div>
  );
};
