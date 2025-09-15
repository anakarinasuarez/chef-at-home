import { useEffect } from "react";
import { useActiveIndex, useAppActions } from "@/stores/appStore";

interface UseRecipesNavigationReturn {
  activeIndex: number;
  scrollToRecipe: (index: number) => void;
}

export const useRecipesNavigationZustand = (
  recipesCount: number
): UseRecipesNavigationReturn => {
  const activeIndex = useActiveIndex();
  const { setActiveIndex } = useAppActions();

  const scrollToRecipe = (index: number) => {
    const container = document.querySelector(".overflow-x-auto") as HTMLElement;
    if (container) {
      const recipeCard = container.children[index] as HTMLElement;
      if (recipeCard) {
        recipeCard.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "start",
        });
        setActiveIndex(index);
      }
    }
  };

  // Detectar scroll automáticamente para actualizar el punto activo
  useEffect(() => {
    const container = document.querySelector(".overflow-x-auto") as HTMLElement;
    if (!container) return;

    const handleScroll = () => {
      const containerRect = container.getBoundingClientRect();
      const containerLeft = containerRect.left;

      // Encontrar qué receta está más visible
      let mostVisibleIndex = 0;
      let maxVisibility = 0;

      Array.from(container.children).forEach((child, index) => {
        const childRect = child.getBoundingClientRect();
        const childLeft = childRect.left;
        const childRight = childRect.right;

        // Calcular qué tan visible está la receta
        const visibleLeft = Math.max(containerLeft, childLeft);
        const visibleRight = Math.min(
          containerLeft + container.offsetWidth,
          childRight
        );
        const visibility = Math.max(0, visibleRight - visibleLeft);

        if (visibility > maxVisibility) {
          maxVisibility = visibility;
          mostVisibleIndex = index;
        }
      });

      setActiveIndex(mostVisibleIndex);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [recipesCount, setActiveIndex]);

  return {
    activeIndex,
    scrollToRecipe,
  };
};
