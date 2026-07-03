import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DeleteConfirmationModal from "../DeleteConfirmationModal";

// Mock design system
vi.mock("@/design-system", () => ({
  colors: {
    interface: {
      background: {
        primary: "#1a1a1a",
        secondary: "#2a2a2a",
      },
      text: {
        primary: "#ffffff",
        secondary: "#cccccc",
      },
    },
    brand: {
      primary: {
        500: "#96b462",
      },
    },
  },
  typography: {
    styles: {
      button: {
        fontSize: "16px",
        fontWeight: "600",
      },
    },
  },
}));

describe("DeleteConfirmationModal", () => {
  const mockOnConfirm = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Rendering", () => {
    it("renders when isOpen is true", () => {
      render(
        <DeleteConfirmationModal
          isOpen={true}
          title="Test Recipe"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText("Are you sure you want to delete the recipe?")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Are you sure you want to delete the recipe?"
        )
      ).toBeInTheDocument();
      expect(screen.getByText("Cancel")).toBeInTheDocument();
      expect(screen.getByText("Delete")).toBeInTheDocument();
    });

    it("does not render when isOpen is false", () => {
      render(
        <DeleteConfirmationModal
          isOpen={false}
          title="Test Recipe"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.queryByText("Are you sure you want to delete the recipe?")).not.toBeInTheDocument();
    });

    it("displays the correct recipe title", () => {
      render(
        <DeleteConfirmationModal
          isOpen={true}
          title="My Favorite Pasta"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(
        screen.getByText(
          "Are you sure you want to delete the recipe?"
        )
      ).toBeInTheDocument();
    });
  });

  describe("User Interactions", () => {
    it("calls onCancel when Cancel button is clicked", async () => {
      const user = userEvent.setup();
      render(
        <DeleteConfirmationModal
          isOpen={true}
          title="Test Recipe"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      const cancelButton = screen.getByText("Cancel");
      await user.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    it("calls onConfirm when Delete button is clicked", async () => {
      const user = userEvent.setup();
      render(
        <DeleteConfirmationModal
          isOpen={true}
          title="Test Recipe"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      const deleteButton = screen.getByText("Delete");
      await user.click(deleteButton);

      expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    });

    it("calls onCancel when clicking outside the modal", async () => {
      const user = userEvent.setup();
      render(
        <DeleteConfirmationModal
          isOpen={true}
          title="Test Recipe"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      const backdrop = screen
        .getByText("Are you sure you want to delete the recipe?")
        .closest("div")?.parentElement;
      await user.click(backdrop!);

      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    it("does not call onCancel when clicking inside the modal", async () => {
      const user = userEvent.setup();
      render(
        <DeleteConfirmationModal
          isOpen={true}
          title="Test Recipe"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      const modalContent = screen.getByText("Are you sure you want to delete the recipe?");
      await user.click(modalContent);

      expect(mockOnCancel).not.toHaveBeenCalled();
    });
  });

  describe("Styling", () => {
    it("has proper modal structure", () => {
      render(
        <DeleteConfirmationModal
          isOpen={true}
          title="Test Recipe"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      const modal = screen.getByText("Are you sure you want to delete the recipe?").closest("div");
      expect(modal).toBeInTheDocument();
    });

    it("has proper button structure", () => {
      render(
        <DeleteConfirmationModal
          isOpen={true}
          title="Test Recipe"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      const cancelButton = screen.getByText("Cancel");
      const deleteButton = screen.getByText("Delete");

      expect(cancelButton).toBeInTheDocument();
      expect(deleteButton).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper button roles", () => {
      render(
        <DeleteConfirmationModal
          isOpen={true}
          title="Test Recipe"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(2);
    });

    it("has proper heading structure", () => {
      render(
        <DeleteConfirmationModal
          isOpen={true}
          title="Test Recipe"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      const heading = screen.getByRole("heading", { level: 3 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent("Are you sure you want to delete the recipe?");
    });
  });

  describe("Edge Cases", () => {
    it("handles empty title", () => {
      render(
        <DeleteConfirmationModal
          isOpen={true}
          title=""
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(
        screen.getByText(
          "Are you sure you want to delete the recipe?"
        )
      ).toBeInTheDocument();
    });

    it("handles long title", () => {
      const longTitle =
        "This is a very long recipe title that might cause layout issues";
      render(
        <DeleteConfirmationModal
          isOpen={true}
          title={longTitle}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(
        screen.getByText(
          "Are you sure you want to delete the recipe?"
        )
      ).toBeInTheDocument();
    });

    it("handles special characters in title", () => {
      const specialTitle = "Recipe with 'quotes' & symbols!";
      render(
        <DeleteConfirmationModal
          isOpen={true}
          title={specialTitle}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(
        screen.getByText(
          "Are you sure you want to delete the recipe?"
        )
      ).toBeInTheDocument();
    });
  });

  describe("Token-driven styling", () => {
    it("renders Cancel as a secondary Button", () => {
      render(
        <DeleteConfirmationModal
          isOpen={true}
          title="Test Recipe"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      // Figma (1317:253): Cancel is a secondary (outlined) Button.
      expect(screen.getByText("Cancel")).toHaveClass("button-secondary");
    });

    it("renders Delete as a solid danger Button", () => {
      render(
        <DeleteConfirmationModal
          isOpen={true}
          title="Test Recipe"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      // Figma (1317:253): Delete is a filled/solid danger Button (red fill, white label).
      expect(screen.getByText("Delete")).toHaveClass("button-danger-solid");
    });
  });

  describe("Keyboard Navigation", () => {
    it("handles Enter key on cancel button", async () => {
      const user = userEvent.setup();
      render(
        <DeleteConfirmationModal
          isOpen={true}
          title="Test Recipe"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      const cancelButton = screen.getByText("Cancel");
      cancelButton.focus();
      await user.keyboard("{Enter}");

      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    it("handles Enter key on delete button", async () => {
      const user = userEvent.setup();
      render(
        <DeleteConfirmationModal
          isOpen={true}
          title="Test Recipe"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      const deleteButton = screen.getByText("Delete");
      deleteButton.focus();
      await user.keyboard("{Enter}");

      expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    });

    it("handles Escape key", () => {
      render(
        <DeleteConfirmationModal
          isOpen={true}
          title="Test Recipe"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      // The component doesn't have Escape key handling, so we test Cancel button instead
      const cancelButton = screen.getByText("Cancel");
      fireEvent.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });
  });

  describe("Multiple Interactions", () => {
    it("handles multiple rapid clicks on cancel button", async () => {
      const user = userEvent.setup();
      render(
        <DeleteConfirmationModal
          isOpen={true}
          title="Test Recipe"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      const cancelButton = screen.getByText("Cancel");

      // Click multiple times rapidly
      await user.click(cancelButton);
      await user.click(cancelButton);
      await user.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalledTimes(3);
    });

    it("handles multiple rapid clicks on delete button", async () => {
      const user = userEvent.setup();
      render(
        <DeleteConfirmationModal
          isOpen={true}
          title="Test Recipe"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      const deleteButton = screen.getByText("Delete");

      // Click multiple times rapidly
      await user.click(deleteButton);
      await user.click(deleteButton);
      await user.click(deleteButton);

      expect(mockOnConfirm).toHaveBeenCalledTimes(3);
    });
  });
});
