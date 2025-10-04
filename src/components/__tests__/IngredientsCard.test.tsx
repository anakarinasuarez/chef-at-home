import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import IngredientsCard from '../IngredientsCard';

describe('IngredientsCard', () => {
  const mockIngredients = [
    { name: 'Chicken breast', quantity: 500, unit: 'g' },
    { name: 'Rice', quantity: 200, unit: 'g' },
    { name: 'Onion', quantity: 1, unit: 'piece' },
    { name: 'Garlic', quantity: 2, unit: 'cloves' },
  ];

  it('should render ingredients list correctly', () => {
    render(<IngredientsCard ingredients={mockIngredients} servings={4} />);

    expect(screen.getByText('Ingredients')).toBeInTheDocument();
    expect(screen.getByText('Serving amount')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();

    // Check if all ingredients are rendered
    expect(screen.getByText('Chicken breast')).toBeInTheDocument();
    expect(screen.getByText('Rice')).toBeInTheDocument();
    expect(screen.getByText('Onion')).toBeInTheDocument();
    expect(screen.getByText('Garlic')).toBeInTheDocument();

    // Check if quantities are rendered
    expect(screen.getByText('500g')).toBeInTheDocument();
    expect(screen.getByText('200g')).toBeInTheDocument();
    expect(screen.getByText('1piece')).toBeInTheDocument();
    expect(screen.getByText('2cloves')).toBeInTheDocument();
  });

  it('should display correct servings', () => {
    render(<IngredientsCard ingredients={mockIngredients} servings={6} />);

    expect(screen.getByText('6')).toBeInTheDocument();
  });

  it('should handle empty ingredients list', () => {
    render(<IngredientsCard ingredients={[]} servings={4} />);

    expect(screen.getByText('No ingredients available')).toBeInTheDocument();
    expect(screen.queryByText('Chicken breast')).not.toBeInTheDocument();
  });

  it('should handle undefined ingredients', () => {
    render(<IngredientsCard ingredients={undefined as any} servings={4} />);

    expect(screen.getByText('No ingredients available')).toBeInTheDocument();
  });

  it('should apply custom image height', () => {
    const { container } = render(
      <IngredientsCard ingredients={mockIngredients} servings={4} imageHeight={600} />
    );

    const cardElement = container.firstChild as HTMLElement;
    expect(cardElement).toHaveStyle('min-height: 600px');
  });

  it('should use default image height when not provided', () => {
    const { container } = render(<IngredientsCard ingredients={mockIngredients} servings={4} />);

    const cardElement = container.firstChild as HTMLElement;
    expect(cardElement).toHaveStyle('min-height: 500px');
  });

  it('should render ingredient dots', () => {
    render(<IngredientsCard ingredients={mockIngredients} servings={4} />);

    // Check if dots are rendered (they should be present for each ingredient)
    const dots = document.querySelectorAll('.w-2.h-2.rounded-full');
    expect(dots).toHaveLength(4);
  });

  it('should handle ingredients with long names', () => {
    const longNameIngredients = [
      { name: 'Very long ingredient name that should be truncated', quantity: 1, unit: 'piece' },
    ];

    render(<IngredientsCard ingredients={longNameIngredients} servings={4} />);

    const ingredientElement = screen.getByText(
      'Very long ingredient name that should be truncated'
    );
    expect(ingredientElement).toHaveClass('truncate');
    expect(ingredientElement).toHaveAttribute(
      'title',
      'Very long ingredient name that should be truncated'
    );
  });

  it('should handle ingredients with zero quantity', () => {
    const zeroQuantityIngredients = [
      { name: 'Salt', quantity: 0, unit: 'g' },
      { name: 'Pepper', quantity: 0, unit: 'g' },
    ];

    render(<IngredientsCard ingredients={zeroQuantityIngredients} servings={4} />);

    expect(screen.getByText('Salt')).toBeInTheDocument();
    expect(screen.getByText('Pepper')).toBeInTheDocument();
    // Check that both ingredients have 0g quantity
    const quantityElements = screen.getAllByText('0g');
    expect(quantityElements).toHaveLength(2);
  });

  it('should handle ingredients with string quantities', () => {
    const stringQuantityIngredients = [{ name: 'Water', quantity: '1 cup' as any, unit: '' }];

    render(<IngredientsCard ingredients={stringQuantityIngredients} servings={4} />);

    expect(screen.getByText('Water')).toBeInTheDocument();
    expect(screen.getByText('1 cup')).toBeInTheDocument();
  });
});
