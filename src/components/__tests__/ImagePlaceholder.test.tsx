import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ImagePlaceholder from "../ImagePlaceholder";

// Mock the design system
vi.mock("@/design-system", () => ({
  colors: {
    interface: {
      background: {
        secondary: "#f5f5f5",
      },
      text: {
        primary: "#000000",
        secondary: "#666666",
      },
    },
    brand: {
      primary: {
        500: "#3b82f6",
      },
    },
  },
  typography: {
    styles: {
      subtitle: {
        fontSize: "1.125rem",
        fontWeight: 600,
      },
    },
  },
}));

describe("ImagePlaceholder", () => {
  const defaultProps = {
    title: "Test Recipe",
  };

  describe("Rendering", () => {
    it("renders with default props", () => {
      render(<ImagePlaceholder {...defaultProps} />);

      expect(screen.getByText("Test Recipe")).toBeInTheDocument();
      expect(screen.getByText("International Cuisine")).toBeInTheDocument();
      expect(screen.getByText("🍽️")).toBeInTheDocument();
    });

    it("renders with custom title", () => {
      render(<ImagePlaceholder title="Custom Recipe Title" />);

      expect(screen.getByText("Custom Recipe Title")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      const { container } = render(
        <ImagePlaceholder {...defaultProps} className="custom-class" />
      );

      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("renders with ingredients prop (even though not used in component)", () => {
      const ingredients = ["tomato", "onion", "garlic"];
      render(<ImagePlaceholder {...defaultProps} ingredients={ingredients} />);

      // Component should still render normally
      expect(screen.getByText("Test Recipe")).toBeInTheDocument();
    });
  });

  describe("Cuisine Icons", () => {
    it("displays Italian cuisine icon", () => {
      render(<ImagePlaceholder {...defaultProps} cuisine="Italian" />);

      expect(screen.getByText("🍝")).toBeInTheDocument();
      expect(screen.getByText("Italian Cuisine")).toBeInTheDocument();
    });

    it("displays Mexican cuisine icon", () => {
      render(<ImagePlaceholder {...defaultProps} cuisine="Mexican" />);

      expect(screen.getByText("🌮")).toBeInTheDocument();
      expect(screen.getByText("Mexican Cuisine")).toBeInTheDocument();
    });

    it("displays Asian cuisine icon", () => {
      render(<ImagePlaceholder {...defaultProps} cuisine="Asian" />);

      expect(screen.getByText("🍜")).toBeInTheDocument();
      expect(screen.getByText("Asian Cuisine")).toBeInTheDocument();
    });

    it("displays French cuisine icon", () => {
      render(<ImagePlaceholder {...defaultProps} cuisine="French" />);

      expect(screen.getByText("🥖")).toBeInTheDocument();
      expect(screen.getByText("French Cuisine")).toBeInTheDocument();
    });

    it("displays Indian cuisine icon", () => {
      render(<ImagePlaceholder {...defaultProps} cuisine="Indian" />);

      expect(screen.getByText("🍛")).toBeInTheDocument();
      expect(screen.getByText("Indian Cuisine")).toBeInTheDocument();
    });

    it("displays Mediterranean cuisine icon", () => {
      render(<ImagePlaceholder {...defaultProps} cuisine="Mediterranean" />);

      expect(screen.getByText("🐟")).toBeInTheDocument();
      expect(screen.getByText("Mediterranean Cuisine")).toBeInTheDocument();
    });

    it("displays Thai cuisine icon", () => {
      render(<ImagePlaceholder {...defaultProps} cuisine="Thai" />);

      expect(screen.getByText("🥘")).toBeInTheDocument();
      expect(screen.getByText("Thai Cuisine")).toBeInTheDocument();
    });

    it("displays International cuisine icon by default", () => {
      render(<ImagePlaceholder {...defaultProps} />);

      expect(screen.getByText("🍽️")).toBeInTheDocument();
      expect(screen.getByText("International Cuisine")).toBeInTheDocument();
    });

    it("displays International cuisine icon when cuisine is explicitly set to International", () => {
      render(<ImagePlaceholder {...defaultProps} cuisine="International" />);

      expect(screen.getByText("🍽️")).toBeInTheDocument();
      expect(screen.getByText("International Cuisine")).toBeInTheDocument();
    });

    it("displays no icon for unknown cuisine types", () => {
      render(<ImagePlaceholder {...defaultProps} cuisine="Unknown" />);

      // Should display no icon since no case matches
      const iconSpan = screen
        .getByText("Unknown Cuisine")
        .closest("div")
        ?.querySelector("span");
      expect(iconSpan).toBeEmptyDOMElement();
      expect(screen.getByText("Unknown Cuisine")).toBeInTheDocument();
    });
  });

  describe("Styling", () => {
    it("applies correct CSS classes", () => {
      const { container } = render(<ImagePlaceholder {...defaultProps} />);
      const mainDiv = container.firstChild as HTMLElement;

      expect(mainDiv).toHaveClass(
        "w-full",
        "h-full",
        "flex",
        "flex-col",
        "items-center",
        "justify-center",
        "rounded-lg"
      );
    });

    it("applies inline styles correctly", () => {
      const { container } = render(<ImagePlaceholder {...defaultProps} />);
      const mainDiv = container.firstChild as HTMLElement;

      expect(mainDiv).toHaveStyle("background-color: #f5f5f5");
    });

    it("applies custom className along with default classes", () => {
      const { container } = render(
        <ImagePlaceholder {...defaultProps} className="test-class" />
      );
      const mainDiv = container.firstChild as HTMLElement;

      expect(mainDiv).toHaveClass("test-class");
      expect(mainDiv).toHaveClass("w-full", "h-full", "flex", "flex-col");
    });
  });

  describe("Accessibility", () => {
    it("has proper heading structure", () => {
      render(<ImagePlaceholder {...defaultProps} />);

      const heading = screen.getByRole("heading", { level: 3 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent("Test Recipe");
    });

    it("has proper text content for screen readers", () => {
      render(<ImagePlaceholder {...defaultProps} cuisine="Italian" />);

      expect(screen.getByText("Test Recipe")).toBeInTheDocument();
      expect(screen.getByText("Italian Cuisine")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles empty title", () => {
      render(<ImagePlaceholder title="" />);

      const heading = screen.getByRole("heading", { level: 3 });
      expect(heading).toHaveTextContent("");
    });

    it("handles very long title", () => {
      const longTitle =
        "This is a very long recipe title that should be handled gracefully by the component";
      render(<ImagePlaceholder title={longTitle} />);

      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it("handles special characters in title", () => {
      const specialTitle = "Recipe with Special Characters: @#$%^&*()";
      render(<ImagePlaceholder title={specialTitle} />);

      expect(screen.getByText(specialTitle)).toBeInTheDocument();
    });

    it("handles undefined cuisine gracefully", () => {
      render(<ImagePlaceholder {...defaultProps} cuisine={undefined as any} />);

      // Should fall back to default International
      expect(screen.getByText("🍽️")).toBeInTheDocument();
      expect(screen.getByText("International Cuisine")).toBeInTheDocument();
    });
  });

  describe("Performance", () => {
    it("does not re-render unnecessarily with same props", () => {
      const { rerender } = render(<ImagePlaceholder {...defaultProps} />);

      const initialHeading = screen.getByText("Test Recipe");

      // Re-render with same props
      rerender(<ImagePlaceholder {...defaultProps} />);

      const rerenderedHeading = screen.getByText("Test Recipe");
      expect(rerenderedHeading).toBe(initialHeading);
    });

    it("handles multiple rapid re-renders", () => {
      const { rerender } = render(<ImagePlaceholder {...defaultProps} />);

      // Multiple rapid re-renders
      for (let i = 0; i < 10; i++) {
        rerender(<ImagePlaceholder {...defaultProps} title={`Recipe ${i}`} />);
      }

      expect(screen.getByText("Recipe 9")).toBeInTheDocument();
    });
  });
});
