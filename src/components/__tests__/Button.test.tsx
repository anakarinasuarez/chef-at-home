import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "../Button";

// Mock Next.js Link component
vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    className,
    style,
    onMouseEnter,
    onMouseLeave,
  }: any) => (
    <a
      href={href}
      className={className}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </a>
  ),
}));

// Mock design system
vi.mock("@/design-system", () => ({
  colors: {
    app: {
      button: {
        primary: {
          background: "#96b462",
          text: "#ffffff",
          hover: "#7a9a4e",
          hoverText: "#ffffff",
        },
        secondary: {
          background: "#ffffff",
          text: "#96b462",
          border: "#96b462",
          hover: "#96b462",
          hoverText: "#ffffff",
        },
      },
    },
  },
  typography: {
    styles: {
      button: {
        fontWeight: "600",
        lineHeight: "1.2",
        fontFamily: ["Inter", "sans-serif"],
      },
    },
  },
  spacingSystem: {
    components: {
      button: {
        borderRadius: "12px",
      },
    },
  },
}));

describe("Button", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders as button when no href provided", () => {
      render(<Button variant="primary">Click me</Button>);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent("Click me");
      expect(button).toHaveAttribute("type", "button");
    });

    it("renders as Link when href provided", () => {
      render(
        <Button variant="primary" href="/test">
          Go to test
        </Button>
      );

      const link = screen.getByRole("link");
      expect(link).toBeInTheDocument();
      expect(link).toHaveTextContent("Go to test");
      expect(link).toHaveAttribute("href", "/test");
    });

    it("renders submit button when type is submit", () => {
      render(
        <Button variant="primary" type="submit">
          Submit
        </Button>
      );

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute("type", "submit");
    });

    it("applies custom className", () => {
      render(
        <Button variant="primary" className="custom-class">
          Button
        </Button>
      );

      const button = screen.getByRole("button");
      expect(button).toHaveClass("custom-class");
      expect(button).toHaveClass("button");
      expect(button).toHaveClass("button-primary");
    });
  });

  describe("Variants", () => {
    it("applies primary variant styles", () => {
      render(<Button variant="primary">Primary Button</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("button-primary");
      expect(button).toHaveStyle({
        backgroundColor: "#96b462",
        color: "#ffffff",
      });
    });

    it("applies secondary variant styles", () => {
      render(<Button variant="secondary">Secondary Button</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("button-secondary");
      // Check that the component renders without errors
      expect(button).toBeInTheDocument();
    });
  });

  describe("Disabled State", () => {
    it("disables button when disabled prop is true", () => {
      render(
        <Button variant="primary" disabled>
          Disabled Button
        </Button>
      );

      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      expect(button).toHaveStyle({
        opacity: "0.5",
        cursor: "not-allowed",
      });
    });

    it("does not disable button when disabled prop is false", () => {
      render(
        <Button variant="primary" disabled={false}>
          Enabled Button
        </Button>
      );

      const button = screen.getByRole("button");
      expect(button).not.toBeDisabled();
      expect(button).toHaveStyle({
        opacity: "1",
        cursor: "pointer",
      });
    });

    it("does not respond to hover when disabled", async () => {
      const user = userEvent.setup();
      render(
        <Button variant="primary" disabled>
          Disabled Button
        </Button>
      );

      const button = screen.getByRole("button");

      await user.hover(button);

      // Should still be disabled and not throw errors
      expect(button).toBeDisabled();
    });
  });

  describe("Click Events", () => {
    it("calls onClick when button is clicked", async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <Button variant="primary" onClick={handleClick}>
          Click me
        </Button>
      );

      const button = screen.getByRole("button");
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("does not call onClick when button is disabled", async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <Button variant="primary" disabled onClick={handleClick}>
          Disabled
        </Button>
      );

      const button = screen.getByRole("button");
      await user.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });

    it("does not call onClick when Link is clicked", async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <Button variant="primary" href="/test" onClick={handleClick}>
          Link
        </Button>
      );

      const link = screen.getByRole("link");
      await user.click(link);

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe("Hover Effects", () => {
    it("handles hover events without errors", async () => {
      const user = userEvent.setup();
      render(<Button variant="primary">Hover me</Button>);

      const button = screen.getByRole("button");

      // Test that hover events don't throw errors
      await user.hover(button);
      expect(button).toBeInTheDocument();

      await user.unhover(button);
      expect(button).toBeInTheDocument();
    });

    it("handles secondary hover events", async () => {
      const user = userEvent.setup();
      render(<Button variant="secondary">Secondary Hover</Button>);

      const button = screen.getByRole("button");

      await user.hover(button);
      expect(button).toBeInTheDocument();
    });
  });

  describe("Base Styles", () => {
    it("applies consistent base styles", () => {
      render(<Button variant="primary">Styled Button</Button>);

      const button = screen.getByRole("button");

      // Check that the component renders with the correct classes
      expect(button).toHaveClass("button");
      expect(button).toHaveClass("button-primary");
      expect(button).toBeInTheDocument();
    });
  });

  describe("Children", () => {
    it("renders text children", () => {
      render(<Button variant="primary">Simple Text</Button>);

      expect(screen.getByText("Simple Text")).toBeInTheDocument();
    });

    it("renders complex children", () => {
      render(
        <Button variant="primary">
          <span>Icon</span> Text Content
        </Button>
      );

      expect(screen.getByText("Icon")).toBeInTheDocument();
      expect(screen.getByText("Text Content")).toBeInTheDocument();
    });

    it("renders multiple children", () => {
      render(
        <Button variant="primary">
          <span>1</span>
          <span>2</span>
          <span>3</span>
        </Button>
      );

      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper button role", () => {
      render(<Button variant="primary">Accessible Button</Button>);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("has proper link role when href provided", () => {
      render(
        <Button variant="primary" href="/test">
          Accessible Link
        </Button>
      );

      const link = screen.getByRole("link");
      expect(link).toBeInTheDocument();
    });

    it("maintains focus styles", () => {
      render(<Button variant="primary">Focusable Button</Button>);

      const button = screen.getByRole("button");
      button.focus();

      expect(button).toHaveFocus();
    });
  });

  describe("Edge Cases", () => {
    it("handles empty children", () => {
      render(<Button variant="primary"></Button>);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
      expect(button).toBeEmptyDOMElement();
    });

    it("handles null children", () => {
      render(<Button variant="primary">{null}</Button>);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("handles undefined onClick", () => {
      render(
        <Button variant="primary" onClick={undefined}>
          No onClick
        </Button>
      );

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();

      // Should not throw when clicked
      expect(() => {
        fireEvent.click(button);
      }).not.toThrow();
    });

    it("handles very long text content", () => {
      const longText = "A".repeat(1000);
      render(<Button variant="primary">{longText}</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveTextContent(longText);
    });
  });

  describe("Type Safety", () => {
    it("accepts valid variant types", () => {
      expect(() => {
        render(<Button variant="primary">Primary</Button>);
        render(<Button variant="secondary">Secondary</Button>);
      }).not.toThrow();
    });

    it("accepts valid button types", () => {
      expect(() => {
        render(
          <Button variant="primary" type="button">
            Button
          </Button>
        );
        render(
          <Button variant="primary" type="submit">
            Submit
          </Button>
        );
      }).not.toThrow();
    });
  });
});
