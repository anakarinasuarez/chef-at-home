interface Recipe {
  title: string;
  servings: number;
  cookingTime: string;
}

interface RecipeInfoProps {
  recipe: Recipe;
}

/**
 * Componente especializado en mostrar la información básica de una receta.
 * Figma card-save: título (Title/3) + dos líneas de meta (Caption).
 */
export const RecipeInfo = ({ recipe }: RecipeInfoProps) => {
  return (
    <div className='flex flex-col gap-sm'>
      {/* Title — single line */}
      <h3 className='line-clamp-1 text-xl font-semibold text-fg' title={recipe.title}>
        {recipe.title}
      </h3>

      {/* Meta — two caption lines */}
      <div className='flex flex-col gap-1'>
        <span className='text-sm text-muted'>for {recipe.servings} people</span>
        <span className='text-sm text-muted'>duration {recipe.cookingTime}</span>
      </div>
    </div>
  );
};
