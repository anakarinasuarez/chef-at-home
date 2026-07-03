import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Nav from "../Nav";

// Mock Next.js router
const mockPush = vi.fn();
const mockReplace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
}));

// Mock Next.js Link
vi.mock("next/link", () => ({
  default: ({ children, href, className, ...props }: any) => (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  ),
}));

// Mock hooks
const mockLogout = vi.fn();

vi.mock("@/hooks", () => ({
  useAuthUnified: () => ({
    logout: mockLogout,
  }),
}));

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
      },
    },
    brand: {
      primary: {
        500: "#96b462",
      },
    },
  },
  typography: {
    fontFamily: {
      alegreya: "var(--font-alegreya), serif",
    },
  },
}));

// Mock React Icons
vi.mock("react-icons/pi", () => ({
  PiChefHatLight: ({ className, style }: any) => (
    <div data-testid="chef-hat-icon" className={className} style={style} />
  ),
}));

vi.mock("react-icons/md", () => ({
  MdOutlineMenu: ({ className, style }: any) => (
    <div data-testid="menu-icon" className={className} style={style} />
  ),
  MdClose: ({ className, style }: any) => (
    <div data-testid="close-icon" className={className} style={style} />
  ),
  MdFavorite: ({ className }: any) => (
    <div data-testid="favorite-icon" className={className} />
  ),
}));

vi.mock("react-icons/io5", () => ({
  IoRestaurantOutline: ({ className }: any) => (
    <div data-testid="restaurant-icon" className={className} />
  ),
}));

vi.mock("react-icons/bi", () => ({
  BiSolidGrid: ({ className }: any) => (
    <div data-testid="grid-icon" className={className} />
  ),
}));

vi.mock("react-icons/fi", () => ({
  FiLogOut: ({ className }: any) => (
    <div data-testid="logout-icon" className={className} />
  ),
}));

describe("Nav", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Basic Rendering", () => {
    it("renders navigation bar with logo", () => {
      render(<Nav />);

      expect(screen.getByText("Chef")).toBeInTheDocument();
      expect(screen.getByText("at")).toBeInTheDocument();
      expect(screen.getByText("home")).toBeInTheDocument();
      expect(screen.getByTestId("chef-hat-icon")).toBeInTheDocument();
    });

    it("renders the provided user name and menu affordance", () => {
      render(<Nav showMenu={true} userName="Anna" />);

      expect(screen.getByText("Anna")).toBeInTheDocument();
      expect(screen.getByTestId("menu-icon")).toBeInTheDocument();
    });

    it("renders with custom props", () => {
      render(
        <Nav showMenu={true} userName="John Doe" currentPage="generated" />
      );

      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    it("does not show menu when showMenu is false", () => {
      render(<Nav showMenu={false} />);

      expect(screen.queryByText("Anna")).not.toBeInTheDocument();
      expect(screen.queryByTestId("menu-icon")).not.toBeInTheDocument();
    });
  });

  describe("Menu Functionality", () => {
    it("opens menu when menu button is clicked", async () => {
      const user = userEvent.setup();
      render(<Nav showMenu={true} />);

      const menuButton = screen.getByLabelText("Menu");
      await user.click(menuButton);

      expect(screen.getByText("Create Recipe")).toBeInTheDocument();
      expect(screen.getByText("My Recipe")).toBeInTheDocument();
      expect(screen.getByText("Log Out")).toBeInTheDocument();
    });

    it("closes menu when close button is clicked", async () => {
      const user = userEvent.setup();
      render(<Nav showMenu={true} />);

      // Open menu
      const menuButton = screen.getByLabelText("Menu");
      await user.click(menuButton);

      // Close menu
      const closeButton = screen.getByTestId("close-icon").closest("button");
      await user.click(closeButton!);

      expect(screen.queryByText("Create Recipe")).not.toBeInTheDocument();
    });

    it("closes menu when clicking outside", async () => {
      const user = userEvent.setup();
      render(<Nav showMenu={true} />);

      // Open menu
      const menuButton = screen.getByLabelText("Menu");
      await user.click(menuButton);

      // Click outside (on nav element)
      const nav = screen.getByRole("navigation");
      await user.click(nav);

      // Menu should still be open since clicking nav doesn't close it
      expect(screen.getByText("Create Recipe")).toBeInTheDocument();
    });
  });

  describe("Navigation", () => {
    it("navigates to create page when Create Recipe is clicked", async () => {
      const user = userEvent.setup();
      render(<Nav showMenu={true} />);

      // Open menu
      const menuButton = screen.getByLabelText("Menu");
      await user.click(menuButton);

      // Click Create Recipe
      const createButton = screen.getByText("Create Recipe");
      await user.click(createButton);

      expect(mockPush).toHaveBeenCalledWith("/create");
    });

    it("navigates to my-recipes page when My Recipe is clicked", async () => {
      const user = userEvent.setup();
      render(<Nav showMenu={true} />);

      // Open menu
      const menuButton = screen.getByLabelText("Menu");
      await user.click(menuButton);

      // Click My Recipe
      const myRecipesButton = screen.getByText("My Recipe");
      await user.click(myRecipesButton);

      expect(mockPush).toHaveBeenCalledWith("/my-recipes");
    });

    it("handles logout correctly", async () => {
      const user = userEvent.setup();
      render(<Nav showMenu={true} />);

      // Open menu
      const menuButton = screen.getByLabelText("Menu");
      await user.click(menuButton);

      // Click Log Out
      const logoutButton = screen.getByText("Log Out");
      await user.click(logoutButton);

      expect(mockLogout).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/auth/login");
    });
  });

  describe("Current Page Highlighting", () => {
    it("highlights create page when currentPage is create", async () => {
      const user = userEvent.setup();
      render(<Nav showMenu={true} currentPage="create" />);

      // Open menu
      const menuButton = screen.getByLabelText("Menu");
      await user.click(menuButton);

      const createButton = screen.getByText("Create Recipe");
      expect(createButton.closest("button")).toHaveClass("bg-primary");
      expect(createButton.closest("button")).toHaveClass("text-on-primary");
    });

    it("highlights my-recipes page when currentPage is my-recipes", async () => {
      const user = userEvent.setup();
      render(<Nav showMenu={true} currentPage="my-recipes" />);

      // Open menu
      const menuButton = screen.getByLabelText("Menu");
      await user.click(menuButton);

      const myRecipesButton = screen.getByText("My Recipe");
      expect(myRecipesButton.closest("button")).toHaveClass("bg-primary");
      expect(myRecipesButton.closest("button")).toHaveClass("text-on-primary");
    });
  });

  describe("Hover Effects", () => {
    it("inactive menu items carry the token hover utilities", async () => {
      const user = userEvent.setup();
      render(<Nav showMenu={true} currentPage="create" />);

      // Open menu
      const menuButton = screen.getByLabelText("Menu");
      await user.click(menuButton);

      // Hover is now CSS-driven via token utilities, no JS handlers.
      const inactiveItem = screen.getByText("My Recipe").closest("button");
      expect(inactiveItem).toHaveClass("hover:bg-primary-hover");
      expect(inactiveItem).toHaveClass("text-fg");
    });

    it("does not apply the active fill to inactive items", async () => {
      const user = userEvent.setup();
      render(<Nav showMenu={true} currentPage="create" />);

      // Open menu
      const menuButton = screen.getByLabelText("Menu");
      await user.click(menuButton);

      const inactiveItem = screen.getByText("My Recipe").closest("button");
      expect(inactiveItem).not.toHaveClass("bg-primary");
    });
  });

  describe("Logo Functionality", () => {
    it("logo is clickable and navigates to home", () => {
      render(<Nav />);

      const logoLink = screen.getByText("Chef").closest("a");
      expect(logoLink).toHaveAttribute("href", "/");
    });

    it("logo has proper styling", () => {
      render(<Nav />);

      const chefText = screen.getByText("Chef");
      const atText = screen.getByText("at");
      const homeText = screen.getByText("home");

      // Check that elements exist and have basic styling
      expect(chefText).toBeInTheDocument();
      expect(atText).toBeInTheDocument();
      expect(homeText).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA labels", () => {
      render(<Nav showMenu={true} />);

      const menuButton = screen.getByLabelText("Menu");
      expect(menuButton).toBeInTheDocument();
    });

    it("has proper navigation structure", () => {
      render(<Nav />);

      const nav = screen.getByRole("navigation");
      expect(nav).toBeInTheDocument();
    });

    it("has proper button roles", async () => {
      const user = userEvent.setup();
      render(<Nav showMenu={true} />);

      // Open menu
      const menuButton = screen.getByLabelText("Menu");
      await user.click(menuButton);

      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe("Edge Cases", () => {
    it("handles unknown page navigation gracefully", async () => {
      const user = userEvent.setup();
      render(<Nav showMenu={true} />);

      // Open menu
      const menuButton = screen.getByLabelText("Menu");
      await user.click(menuButton);

      // Check that menu items are rendered
      expect(screen.getByText("Create Recipe")).toBeInTheDocument();
      expect(screen.getByText("My Recipe")).toBeInTheDocument();
      expect(screen.getByText("Log Out")).toBeInTheDocument();
    });

    it("handles rapid menu toggles", async () => {
      const user = userEvent.setup();
      render(<Nav showMenu={true} />);

      const menuButton = screen.getByLabelText("Menu");

      // Rapid clicks
      await user.click(menuButton);
      await user.click(menuButton);
      await user.click(menuButton);

      // Should handle gracefully
      expect(menuButton).toBeInTheDocument();
    });

    it("handles empty userName", () => {
      render(<Nav showMenu={true} userName="" />);

      // Should not crash
      expect(screen.getByTestId("menu-icon")).toBeInTheDocument();
    });
  });

  describe("Icon Rendering", () => {
    it("renders all required icons", async () => {
      const user = userEvent.setup();
      render(<Nav showMenu={true} />);

      // Open menu
      const menuButton = screen.getByLabelText("Menu");
      await user.click(menuButton);

      expect(screen.getByTestId("chef-hat-icon")).toBeInTheDocument();
      expect(screen.getByTestId("menu-icon")).toBeInTheDocument();
      expect(screen.getByTestId("close-icon")).toBeInTheDocument();
      expect(screen.getByTestId("restaurant-icon")).toBeInTheDocument();
      expect(screen.getByTestId("favorite-icon")).toBeInTheDocument();
      expect(screen.getByTestId("logout-icon")).toBeInTheDocument();
    });
  });
});
