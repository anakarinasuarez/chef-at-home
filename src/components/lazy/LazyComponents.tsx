import { lazy } from "react";

// Lazy load de componentes pesados
export const LazyCreateRecipePage = lazy(() =>
  import("@/components/pages/CreateRecipePage").then((module) => ({
    default: module.default,
  }))
);

export const LazyRecipeCard = lazy(() =>
  import("@/components/RecipeCard").then((module) => ({
    default: module.default,
  }))
);

export const LazyDeleteConfirmationModal = lazy(() =>
  import("@/components/DeleteConfirmationModal").then((module) => ({
    default: module.default,
  }))
);

export const LazyAuthForm = lazy(() =>
  import("@/components/auth/AuthForm").then((module) => ({
    default: module.default,
  }))
);

// Lazy load de páginas completas
export const LazyMyRecipesPage = lazy(() =>
  import("@/app/my-recipes/page").then((module) => ({
    default: module.default,
  }))
);

export const LazyRecipesPage = lazy(() =>
  import("@/app/recipes/page").then((module) => ({
    default: module.default,
  }))
);

export const LazyRecipeDetailPage = lazy(() =>
  import("@/app/recipes/[id]/page").then((module) => ({
    default: module.default,
  }))
);
