import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RecipeCard from "../RecipeCard";
import {
  mockAuthContext,
  mockNotificationContext,
} from "../../test/mocks/contexts";
import { mockPush } from "../../test/setup";

// Mock all dependencies
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
}));

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => mockAuthContext,
}));

vi.mock("@/contexts/NotificationContext", () => ({
  useNotification: () => mockNotificationContext,
}));

const mockIsRecipeSaved = vi.fn(() => false);
const mockToggleSaveRecipe = vi.fn(() => true);

vi.mock("@/hooks", () => ({
  useSavedRecipes: () => ({
    isRecipeSaved: mockIsRecipeSaved,
    toggleSaveRecipe: mockToggleSaveRecipe,
  }),
}));

vi.mock("@/design-system", () => ({
  colors: {
    interface: {
      background: {
        primary: "#ffffff",
        secondary: "#f5f5f5",
        tertiary: "#e0e0e0",
      },
      text: {
        primary: "#000000",
        secondary: "#666666",
      },
    },
    brand: {
      primary: {
        500: "#3b82f6",
        600: "#2563eb",
      },
    },
    base: {
      white: "#ffffff",
    },
    app: {
      recipeCard: {
        shadow: "rgba(0, 0, 0, 0.1)",
      },
    },
  },
  typography: {
    styles: {
      subtitle: {
        fontSize: "1.125rem",
        fontWeight: 600,
        lineHeight: "1.5",
        letterSpacing: "0.025em",
      },
      caption: {
        fontSize: "0.875rem",
        fontWeight: 400,
        lineHeight: "1.25",
        letterSpacing: "0.025em",
      },
      button: {
        fontSize: "0.875rem",
        fontWeight: 500,
        lineHeight: "1.25",
        letterSpacing: "0.025em",
      },
    },
  },
}));

vi.mock("react-icons/bi", () => ({
  BiTime: ({ ...props }) => <div data-testid="bi-time" {...props} />,
  BiUser: ({ ...props }) => <div data-testid="bi-user" {...props} />,
  BiStar: ({ ...props }) => <div data-testid="bi-star" {...props} />,
  BiBookmark: ({ ...props }) => <div data-testid="bi-bookmark" {...props} />,
  BiShare: ({ ...props }) => <div data-testid="bi-share" {...props} />,
}));

vi.mock("react-icons/fa6", () => ({
  FaPencil: ({ ...props }) => <div data-testid="fa-pencil" {...props} />,
}));

vi.mock("react-icons/md", () => ({
  MdDelete: ({ ...props }) => <div data-testid="md-delete" {...props} />,
}));

describe("RecipeCard", () => {
  const mockRecipe = {
    id: "test-recipe-id",
    title: "Test Recipe",
    servings: 4,
    cookingTime: "30 minutes",
    difficulty: "Easy",
    image: "https://example.com/image.jpg",
    source: "ai-generated",
  };

  const mockUseSavedRecipes = vi.fn();
  const mockRouter = { push: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();

    // Reset localStorage mock
    vi.mocked(localStorage.setItem).mockClear();
    vi.mocked(localStorage.getItem).mockClear();

    // Reset router mock
    vi.mocked(mockRouter.push).mockClear();

    // Reset notification mock
    vi.mocked(mockNotificationContext.showNotification).mockClear();

    // Reset auth context
    mockAuthContext.user = {
      id: "test-user-id",
      name: "Test User",
      email: "test@example.com",
    };
  });

  describe("Rendering", () => {
    it("renders recipe information correctly", () => {
      render(<RecipeCard recipe={mockRecipe} />);

      expect(screen.getByText("Test Recipe")).toBeInTheDocument();
      expect(screen.getByText("for 4 people")).toBeInTheDocument();
      expect(screen.getByText("duration 30 minutes")).toBeInTheDocument();
    });

    it("renders with default variant (save)", () => {
      render(<RecipeCard recipe={mockRecipe} />);

      expect(screen.getByText("Save")).toBeInTheDocument();
    });

    it("renders with my-recipes variant", () => {
      render(<RecipeCard recipe={mockRecipe} variant="my-recipes" />);

      expect(screen.getByTestId("fa-pencil")).toBeInTheDocument();
      expect(screen.getByTestId("md-delete")).toBeInTheDocument();
      expect(screen.getByTestId("bi-share")).toBeInTheDocument();
    });

    it("renders recipe image when available", () => {
      render(<RecipeCard recipe={mockRecipe} />);

      const image = screen.getByAltText("Test Recipe");
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute("src", "https://example.com/image.jpg");
    });

    it("renders ImagePlaceholder when no image", () => {
      const recipeWithoutImage = { ...mockRecipe, image: undefined };
      render(<RecipeCard recipe={recipeWithoutImage} />);

      expect(screen.getAllByText("Test Recipe")).toHaveLength(2); // One in card title, one in placeholder
      expect(screen.getByText("International Cuisine")).toBeInTheDocument();
    });

    it("renders ImagePlaceholder when image fails to load", async () => {
      render(<RecipeCard recipe={mockRecipe} />);

      const image = screen.getByAltText("Test Recipe");
      fireEvent.error(image);

      await waitFor(() => {
        expect(screen.getByText("International Cuisine")).toBeInTheDocument();
      });
    });
  });

  describe("User Interactions", () => {
    it("navigates to recipe detail on card click", () => {
      render(<RecipeCard recipe={mockRecipe} />);

      const card = screen
        .getAllByText("Test Recipe")[0]
        .closest("div")
        ?.closest("div");
      fireEvent.click(card!);

      expect(mockPush).toHaveBeenCalledWith("/recipes/test-recipe-id");
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "recipe-test-recipe-id",
        JSON.stringify(mockRecipe)
      );
    });

    it("navigates to recipe detail with from parameter for my-recipes variant", () => {
      render(<RecipeCard recipe={mockRecipe} variant="my-recipes" />);

      const card = screen
        .getAllByText("Test Recipe")[0]
        .closest("div")
        ?.closest("div");
      fireEvent.click(card!);

      expect(mockPush).toHaveBeenCalledWith(
        "/recipes/test-recipe-id?from=my-recipes"
      );
    });

    it("generates unique ID when recipe has no ID", () => {
      const recipeWithoutId = { ...mockRecipe, id: undefined };

      render(<RecipeCard recipe={recipeWithoutId} />);

      const card = screen
        .getAllByText("Test Recipe")[0]
        .closest("div")
        ?.closest("div");
      fireEvent.click(card!);

      expect(mockPush).toHaveBeenCalledWith(
        expect.stringMatching(/^\/recipes\/\d+$/)
      );
    });
  });

  describe("Save Functionality", () => {
    it("shows save button for save variant", () => {
      render(<RecipeCard recipe={mockRecipe} />);

      expect(screen.getByText("Save")).toBeInTheDocument();
    });

    it("handles save button click", async () => {
      const user = userEvent.setup();

      render(<RecipeCard recipe={mockRecipe} />);

      const saveButton = screen.getByText("Save");
      await user.click(saveButton);

      expect(mockToggleSaveRecipe).toHaveBeenCalledWith(mockRecipe);
      expect(mockNotificationContext.showNotification).toHaveBeenCalledWith(
        "Recipe saved to favorites",
        "success"
      );
    });

    it("redirects to login when user is not authenticated", async () => {
      const user = userEvent.setup();

      mockAuthContext.user = null;

      render(<RecipeCard recipe={mockRecipe} />);

      const saveButton = screen.getByText("Save");
      await user.click(saveButton);

      expect(mockPush).toHaveBeenCalledWith("/auth/login");
    });

    it("shows loading state while saving", async () => {
      const user = userEvent.setup();
      mockToggleSaveRecipe.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      render(<RecipeCard recipe={mockRecipe} />);

      const saveButton = screen.getByText("Save");
      await user.click(saveButton);

      expect(screen.getByText("Saving...")).toBeInTheDocument();
    });

    it("shows saved state when recipe is already saved", () => {
      mockIsRecipeSaved.mockReturnValue(true);

      render(<RecipeCard recipe={mockRecipe} />);

      expect(screen.getByText("Saved")).toBeInTheDocument();
      expect(screen.getByText("✓")).toBeInTheDocument();
    });

    it("handles save error gracefully", async () => {
      const user = userEvent.setup();
      mockToggleSaveRecipe.mockReturnValue(false);

      render(<RecipeCard recipe={mockRecipe} />);

      const saveButton = screen.getByText("Save");
      await user.click(saveButton);

      expect(mockNotificationContext.showNotification).toHaveBeenCalledWith(
        "Error saving recipe",
        "error"
      );
    });
  });

  describe("My Recipes Variant", () => {
    it("renders edit, delete, and share buttons", () => {
      const mockOnEdit = vi.fn();
      const mockOnDelete = vi.fn();
      const mockOnShare = vi.fn();

      render(
        <RecipeCard
          recipe={mockRecipe}
          variant="my-recipes"
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onShare={mockOnShare}
        />
      );

      expect(screen.getByTestId("fa-pencil")).toBeInTheDocument();
      expect(screen.getByTestId("md-delete")).toBeInTheDocument();
      expect(screen.getByTestId("bi-share")).toBeInTheDocument();
    });

    it("handles edit button click", async () => {
      const user = userEvent.setup();
      const mockOnEdit = vi.fn();

      render(
        <RecipeCard
          recipe={mockRecipe}
          variant="my-recipes"
          onEdit={mockOnEdit}
        />
      );

      const editButton = screen.getByTestId("fa-pencil").closest("button");
      await user.click(editButton!);

      expect(mockOnEdit).toHaveBeenCalledWith(mockRecipe);
    });

    it("handles delete button click", async () => {
      const user = userEvent.setup();
      const mockOnDelete = vi.fn();

      render(
        <RecipeCard
          recipe={mockRecipe}
          variant="my-recipes"
          onDelete={mockOnDelete}
        />
      );

      const deleteButton = screen.getByTestId("md-delete").closest("button");
      await user.click(deleteButton!);

      expect(mockOnDelete).toHaveBeenCalledWith("test-recipe-id");
    });

    it("handles share button click", async () => {
      const user = userEvent.setup();
      const mockOnShare = vi.fn();

      render(
        <RecipeCard
          recipe={mockRecipe}
          variant="my-recipes"
          onShare={mockOnShare}
        />
      );

      const shareButton = screen.getByTestId("bi-share").closest("button");
      await user.click(shareButton!);

      expect(mockOnShare).toHaveBeenCalledWith(mockRecipe);
    });

    it("does not trigger card click when action buttons are clicked", async () => {
      const user = userEvent.setup();
      const mockOnEdit = vi.fn();

      render(
        <RecipeCard
          recipe={mockRecipe}
          variant="my-recipes"
          onEdit={mockOnEdit}
        />
      );

      const editButton = screen.getByTestId("fa-pencil").closest("button");
      await user.click(editButton!);

      expect(mockOnEdit).toHaveBeenCalledWith(mockRecipe);
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe("Image Handling", () => {
    it("handles image load error", async () => {
      render(<RecipeCard recipe={mockRecipe} />);

      const image = screen.getByAltText("Test Recipe");
      fireEvent.error(image);

      await waitFor(() => {
        expect(screen.getByText("International Cuisine")).toBeInTheDocument();
      });
    });

    it("shows fallback-enhanced cuisine for fallback-enhanced source", () => {
      const recipeWithFallbackSource = {
        ...mockRecipe,
        source: "fallback-enhanced",
        image: undefined,
      };
      render(<RecipeCard recipe={recipeWithFallbackSource} />);

      expect(screen.getByText("Italian Cuisine")).toBeInTheDocument();
    });

    it("handles multiple image errors gracefully", async () => {
      render(<RecipeCard recipe={mockRecipe} />);

      const image = screen.getByAltText("Test Recipe");

      // Trigger multiple errors
      fireEvent.error(image);
      fireEvent.error(image);
      fireEvent.error(image);

      await waitFor(() => {
        expect(screen.getByText("International Cuisine")).toBeInTheDocument();
      });
    });
  });

  describe("Performance", () => {
    it("does not re-render unnecessarily with same props", () => {
      const { rerender } = render(<RecipeCard recipe={mockRecipe} />);

      const initialTitle = screen.getByText("Test Recipe");

      // Re-render with same props
      rerender(<RecipeCard recipe={mockRecipe} />);

      const rerenderedTitle = screen.getByText("Test Recipe");
      expect(rerenderedTitle).toBe(initialTitle);
    });

    it("handles rapid state changes", async () => {
      const user = userEvent.setup();

      render(<RecipeCard recipe={mockRecipe} />);

      const saveButton = screen.getByText("Save");

      // Rapid clicks
      await user.click(saveButton);
      await user.click(saveButton);
      await user.click(saveButton);

      expect(mockToggleSaveRecipe).toHaveBeenCalledTimes(3);
    });
  });

  describe("Edge Cases", () => {
    it("handles recipe without ID", () => {
      const recipeWithoutId = { ...mockRecipe, id: undefined };
      render(<RecipeCard recipe={recipeWithoutId} />);

      expect(screen.getByText("Test Recipe")).toBeInTheDocument();
    });

    it("handles recipe with empty title", () => {
      const recipeWithEmptyTitle = { ...mockRecipe, title: "" };
      render(<RecipeCard recipe={recipeWithEmptyTitle} />);

      const heading = screen.getByRole("heading", { level: 3 });
      expect(heading).toHaveTextContent("");
    });

    it("handles recipe with very long title", () => {
      const longTitle =
        "This is a very long recipe title that should be handled gracefully by the component and not break the layout";
      const recipeWithLongTitle = { ...mockRecipe, title: longTitle };
      render(<RecipeCard recipe={recipeWithLongTitle} />);

      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it("handles missing optional props gracefully", () => {
      render(<RecipeCard recipe={mockRecipe} />);

      expect(screen.getByText("Test Recipe")).toBeInTheDocument();
    });
  });
});
