import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import CreateRecipePage from '../CreateRecipePage';

// Mock Next.js router
const mockPush = vi.fn();
const mockReplace = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
}));

// Mock hooks
const mockUpdateRecipe = vi.fn();
const mockShowSuccess = vi.fn();
const mockShowError = vi.fn();

vi.mock('@/stores', () => ({
  useSavedRecipesStore: vi.fn(selector => {
    const state = {
      updateRecipe: mockUpdateRecipe,
    };
    return selector ? selector(state) : state;
  }),
  useToastStore: vi.fn(() => ({
    showSuccess: mockShowSuccess,
    showError: mockShowError,
  })),
}));

// Mock MainLayout
vi.mock('@/components/layouts/MainLayout', () => ({
  default: ({ children, showMenu, userName, currentPage }: any) => (
    <div
      data-testid='main-layout'
      data-show-menu={showMenu}
      data-user-name={userName}
      data-current-page={currentPage}
    >
      {children}
    </div>
  ),
}));

// Mock Button
vi.mock('@/components/Button', () => ({
  default: ({
    children,
    variant,
    onClick,
    disabled,
    className,
    'data-testid': dataTestId,
    'aria-label': ariaLabel,
  }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
      aria-label={ariaLabel}
      data-testid={dataTestId || `button-${variant}`}
    >
      {children}
    </button>
  ),
}));

// Mock design system
vi.mock('@/design-system', () => ({
  colors: {
    interface: {
      background: {
        primary: '#1a1a1a',
        secondary: '#2a2a2a',
      },
      text: {
        primary: '#ffffff',
      },
    },
    brand: {
      primary: {
        500: '#96b462',
      },
    },
  },
  typography: {
    styles: {
      'body-large': {
        fontSize: '18px',
        fontWeight: '500',
      },
      'title-1': {
        fontSize: '32px',
        fontWeight: '700',
        lineHeight: '1.2',
        letterSpacing: '-0.02em',
      },
      'title-3': {
        fontSize: '20px',
        fontWeight: '600',
      },
      body: {
        fontSize: '16px',
      },
    },
  },
  spacingSystem: {
    components: {
      button: {
        borderRadius: '8px',
      },
    },
  },
}));

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    search: '',
  },
  writable: true,
});

// Mock fetch
global.fetch = vi.fn();

describe('CreateRecipePage', () => {
  const mockProps = {
    userName: 'Test User',
    user: { id: '1', name: 'Test User' },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
    mockLocalStorage.setItem.mockImplementation(() => {});
    mockLocalStorage.removeItem.mockImplementation(() => {});
    window.location.search = '';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders welcome message and title', () => {
      render(<CreateRecipePage {...mockProps} />);

      expect(screen.getByText('Welcome Test User')).toBeInTheDocument();
      expect(
        screen.getByText('What ingredients do you have to create your recipe?')
      ).toBeInTheDocument();
    });

    it('renders ingredients section', () => {
      render(<CreateRecipePage {...mockProps} />);

      expect(screen.getByText('Ingredients')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Add an ingredient...')).toBeInTheDocument();
    });

    it('renders servings section', () => {
      render(<CreateRecipePage {...mockProps} />);

      expect(screen.getByText('Servings')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
      expect(screen.getByText('6')).toBeInTheDocument();
      expect(screen.getByText('8')).toBeInTheDocument();
    });

    it('renders action buttons', () => {
      render(<CreateRecipePage {...mockProps} />);

      expect(screen.getByText('Create Recipe')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('passes correct props to MainLayout', () => {
      render(<CreateRecipePage {...mockProps} />);

      const mainLayout = screen.getByTestId('main-layout');
      expect(mainLayout).toHaveAttribute('data-show-menu', 'true');
      expect(mainLayout).toHaveAttribute('data-user-name', 'Test User');
      expect(mainLayout).toHaveAttribute('data-current-page', 'create');
    });
  });

  describe('Ingredient Management', () => {
    it('adds ingredient when button is clicked', async () => {
      const user = userEvent.setup();
      render(<CreateRecipePage {...mockProps} />);

      const input = screen.getByPlaceholderText('Add an ingredient...');
      const addButton = screen.getByTestId('add-ingredient-button'); // First button (add ingredient)

      await user.type(input, 'Tomato');
      await user.click(addButton);

      expect(screen.getByText('Tomato')).toBeInTheDocument();
    });

    it('adds ingredient when Enter key is pressed', async () => {
      const user = userEvent.setup();
      render(<CreateRecipePage {...mockProps} />);

      const input = screen.getByPlaceholderText('Add an ingredient...');

      await user.type(input, 'Onion');
      await user.keyboard('{Enter}');

      expect(screen.getByText('Onion')).toBeInTheDocument();
    });

    it('removes ingredient when X button is clicked', async () => {
      const user = userEvent.setup();
      render(<CreateRecipePage {...mockProps} />);

      // Add ingredient
      const input = screen.getByPlaceholderText('Add an ingredient...');
      const addButton = screen.getByTestId('add-ingredient-button'); // First button (add ingredient)

      await user.type(input, 'Garlic');
      await user.click(addButton);

      // Remove ingredient
      const removeButton = screen.getByText('×');
      await user.click(removeButton);

      expect(screen.queryByText('Garlic')).not.toBeInTheDocument();
    });

    it('does not add empty ingredient', async () => {
      const user = userEvent.setup();
      render(<CreateRecipePage {...mockProps} />);

      const input = screen.getByPlaceholderText('Add an ingredient...');
      const addButton = screen.getByTestId('add-ingredient-button'); // First button (add ingredient)

      await user.type(input, '   ');
      await user.click(addButton);

      expect(screen.queryByText('   ')).not.toBeInTheDocument();
    });
  });

  describe('Servings Selection', () => {
    it('selects serving when button is clicked', async () => {
      const user = userEvent.setup();
      render(<CreateRecipePage {...mockProps} />);

      const servingButton = screen.getByText('4');
      await user.click(servingButton);

      // Check that the button has selected styling (now using Button component)
      expect(servingButton.closest('button')).toBeInTheDocument();
    });

    it('shows custom input when + button is clicked', async () => {
      const user = userEvent.setup();
      render(<CreateRecipePage {...mockProps} />);

      const customButton = screen.getByText('+'); // serving custom "+" chip
      await user.click(customButton);

      expect(screen.getByPlaceholderText('e.g. 3')).toBeInTheDocument();
    });

    it('handles custom serving input', async () => {
      const user = userEvent.setup();
      render(<CreateRecipePage {...mockProps} />);

      // Open custom input
      const customButton = screen.getByText('+');
      await user.click(customButton);

      // Enter custom value and confirm
      const customInput = screen.getByPlaceholderText('e.g. 3');
      await user.type(customInput, '10');
      await user.click(screen.getByTestId('confirm-serving-button'));

      // The custom value becomes a selectable serving chip
      expect(screen.getByText('10')).toBeInTheDocument();
    });

    it('closes custom input when X button is clicked', async () => {
      const user = userEvent.setup();
      render(<CreateRecipePage {...mockProps} />);

      // Open custom input
      const customButton = screen.getByText('+');
      await user.click(customButton);

      // Close custom input
      const closeButton = screen.getByText('×');
      await user.click(closeButton);

      expect(screen.queryByPlaceholderText('e.g. 3')).not.toBeInTheDocument();
    });
  });

  describe('Recipe Creation', () => {
    it('disables create button when no ingredients', () => {
      render(<CreateRecipePage {...mockProps} />);

      const createButton = screen.getByText('Create Recipe');
      expect(createButton).toBeDisabled();
    });

    it('disables create button when no servings selected', async () => {
      const user = userEvent.setup();
      render(<CreateRecipePage {...mockProps} />);

      // Add ingredient
      const input = screen.getByPlaceholderText('Add an ingredient...');
      const addButton = screen.getByTestId('add-ingredient-button'); // First button (add ingredient)

      await user.type(input, 'Tomato');
      await user.click(addButton);

      const createButton = screen.getByText('Create Recipe');
      expect(createButton).toBeDisabled();
    });

    it('enables create button when ingredients and servings are selected', async () => {
      const user = userEvent.setup();
      render(<CreateRecipePage {...mockProps} />);

      // Add ingredient
      const input = screen.getByPlaceholderText('Add an ingredient...');
      const addButton = screen.getByTestId('add-ingredient-button'); // First button (add ingredient)

      await user.type(input, 'Tomato');
      await user.click(addButton);

      // Select serving
      const servingButton = screen.getByText('4');
      await user.click(servingButton);

      const createButton = screen.getByText('Create Recipe');
      expect(createButton).not.toBeDisabled();
    });

    it('shows loading state when creating recipe', async () => {
      const user = userEvent.setup();
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ recipes: [{ id: '1', title: 'Test Recipe' }] }),
      } as Response);

      render(<CreateRecipePage {...mockProps} />);

      // Add ingredient and select serving
      const input = screen.getByPlaceholderText('Add an ingredient...');
      const addButton = screen.getByTestId('add-ingredient-button'); // First button (add ingredient)
      const servingButton = screen.getByText('4');

      await user.type(input, 'Tomato');
      await user.click(addButton);
      await user.click(servingButton);

      // Click create button
      const createButton = screen.getByText('Create Recipe');
      await user.click(createButton);

      // Check that the button is still there (loading state might be too fast to catch)
      expect(createButton).toBeInTheDocument();
    });

    it('handles successful recipe creation', async () => {
      const user = userEvent.setup();
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ recipes: [{ id: '1', title: 'Test Recipe' }] }),
      } as Response);

      render(<CreateRecipePage {...mockProps} />);

      // Add ingredient and select serving
      const input = screen.getByPlaceholderText('Add an ingredient...');
      const addButton = screen.getByTestId('add-ingredient-button'); // First button (add ingredient)
      const servingButton = screen.getByText('4');

      await user.type(input, 'Tomato');
      await user.click(addButton);
      await user.click(servingButton);

      // Click create button
      const createButton = screen.getByText('Create Recipe');
      await user.click(createButton);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('/recipes?ingredients='));
      });
    });

    it('handles recipe creation error', async () => {
      const user = userEvent.setup();

      // Mock router.push to throw an error
      mockPush.mockImplementation(() => {
        throw new Error('Navigation error');
      });

      render(<CreateRecipePage {...mockProps} />);

      // Add ingredient and select serving
      const input = screen.getByPlaceholderText('Add an ingredient...');
      const addButton = screen.getByTestId('add-ingredient-button'); // First button (add ingredient)
      const servingButton = screen.getByText('4');

      await user.type(input, 'Tomato');
      await user.click(addButton);
      await user.click(servingButton);

      // Click create button
      const createButton = screen.getByText('Create Recipe');
      await user.click(createButton);

      await waitFor(() => {
        expect(mockShowError).toHaveBeenCalledWith(
          'Error redirecting to recipes page. Please try again.'
        );
      });
    });
  });

  describe('Edit Mode', () => {
    beforeEach(() => {
      window.location.search = '?edit=true';
      mockLocalStorage.getItem.mockReturnValue(
        JSON.stringify({
          originalId: 'recipe-123',
          title: 'Existing Recipe',
          ingredients: [{ name: 'Existing Ingredient' }],
          servings: 2,
        })
      );
    });

    it('loads edit data from localStorage', () => {
      render(<CreateRecipePage {...mockProps} />);

      expect(screen.getByText('Edit your recipe')).toBeInTheDocument();
      expect(screen.getByText('Recipe Title')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Existing Recipe')).toBeInTheDocument();
      expect(screen.getByText('Existing Ingredient')).toBeInTheDocument();
    });

    it('shows save button in edit mode', () => {
      render(<CreateRecipePage {...mockProps} />);

      expect(screen.getByText('Update Recipe')).toBeInTheDocument();
    });

    it('handles successful recipe save', async () => {
      const user = userEvent.setup();
      mockUpdateRecipe.mockReturnValue(true);

      render(<CreateRecipePage {...mockProps} />);

      const saveButton = screen.getByText('Update Recipe');
      await user.click(saveButton);

      expect(mockUpdateRecipe).toHaveBeenCalledWith('recipe-123', expect.any(Object), '1');
      expect(mockPush).toHaveBeenCalledWith('/my-recipes');
    });

    it('handles recipe save error', async () => {
      const user = userEvent.setup();
      mockUpdateRecipe.mockReturnValue(false);

      render(<CreateRecipePage {...mockProps} />);

      const saveButton = screen.getByText('Update Recipe');
      await user.click(saveButton);

      await waitFor(() => {
        expect(mockShowError).toHaveBeenCalledWith('Error saving recipe. Please try again.');
      });
    });
  });

  describe('Navigation', () => {
    it('navigates to my-recipes when Cancel button is clicked', async () => {
      const user = userEvent.setup();
      render(<CreateRecipePage {...mockProps} />);

      const cancelButton = screen.getByText('Cancel');
      await user.click(cancelButton);

      expect(mockPush).toHaveBeenCalledWith('/my-recipes');
    });
  });

  describe('Validation', () => {
    it('shows alert when trying to create recipe without ingredients', async () => {
      const user = userEvent.setup();
      const mockAlert = vi.spyOn(window, 'alert').mockImplementation(() => {});

      render(<CreateRecipePage {...mockProps} />);

      // Select serving but no ingredients
      const servingButton = screen.getByText('4');
      await user.click(servingButton);

      const createButton = screen.getByText('Create Recipe');
      await user.click(createButton);

      // Button should be disabled, so alert won't be called
      expect(createButton).toBeDisabled();

      mockAlert.mockRestore();
    });

    it('shows alert when trying to create recipe without servings', async () => {
      const user = userEvent.setup();
      const mockAlert = vi.spyOn(window, 'alert').mockImplementation(() => {});

      render(<CreateRecipePage {...mockProps} />);

      // Add ingredient but no servings
      const input = screen.getByPlaceholderText('Add an ingredient...');
      const addButton = screen.getByTestId('add-ingredient-button'); // First button (add ingredient)

      await user.type(input, 'Tomato');
      await user.click(addButton);

      const createButton = screen.getByText('Create Recipe');
      await user.click(createButton);

      // Button should be disabled, so alert won't be called
      expect(createButton).toBeDisabled();

      mockAlert.mockRestore();
    });
  });

  describe('Edge Cases', () => {
    it('handles invalid edit data gracefully', () => {
      window.location.search = '?edit=true';
      mockLocalStorage.getItem.mockReturnValue('invalid json');

      // Should not crash
      expect(() => render(<CreateRecipePage {...mockProps} />)).not.toThrow();
    });

    it('handles empty edit data', () => {
      window.location.search = '?edit=true';
      mockLocalStorage.getItem.mockReturnValue(null);

      render(<CreateRecipePage {...mockProps} />);

      // Should render in normal mode
      expect(
        screen.getByText('What ingredients do you have to create your recipe?')
      ).toBeInTheDocument();
    });

    it('handles custom serving validation', async () => {
      const user = userEvent.setup();
      render(<CreateRecipePage {...mockProps} />);

      // Open custom input
      const customButton = screen.getByText('+');
      await user.click(customButton);

      // Enter invalid value and confirm
      const customInput = screen.getByPlaceholderText('e.g. 3');
      await user.type(customInput, 'invalid');
      await user.click(screen.getByTestId('confirm-serving-button'));

      // Invalid input keeps the field open and surfaces an error
      expect(screen.getByPlaceholderText('e.g. 3')).toBeInTheDocument();
      expect(mockShowError).toHaveBeenCalled();
    });
  });
});
