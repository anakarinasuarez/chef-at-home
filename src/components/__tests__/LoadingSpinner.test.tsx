import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import LoadingSpinner from '../ui/LoadingSpinner';

describe('LoadingSpinner', () => {
  it('should render with default props', () => {
    const { container } = render(<LoadingSpinner />);

    const spinnerContainer = container.firstChild as HTMLElement;
    expect(spinnerContainer).toHaveClass('flex', 'justify-center', 'items-center');

    const spinner = spinnerContainer.firstChild as HTMLElement;
    expect(spinner).toHaveClass(
      'w-8',
      'h-8',
      'border-2',
      'border-gray-200',
      'border-t-transparent',
      'rounded-full',
      'animate-spin'
    );
  });

  it('should render with small size', () => {
    const { container } = render(<LoadingSpinner size='sm' />);

    const spinnerContainer = container.firstChild as HTMLElement;
    const spinner = spinnerContainer.firstChild as HTMLElement;
    expect(spinner).toHaveClass('w-4', 'h-4');
  });

  it('should render with medium size', () => {
    const { container } = render(<LoadingSpinner size='md' />);

    const spinnerContainer = container.firstChild as HTMLElement;
    const spinner = spinnerContainer.firstChild as HTMLElement;
    expect(spinner).toHaveClass('w-8', 'h-8');
  });

  it('should render with large size', () => {
    const { container } = render(<LoadingSpinner size='lg' />);

    const spinnerContainer = container.firstChild as HTMLElement;
    const spinner = spinnerContainer.firstChild as HTMLElement;
    expect(spinner).toHaveClass('w-12', 'h-12');
  });

  it('should apply custom color', () => {
    const customColor = '#FF0000';
    const { container } = render(<LoadingSpinner color={customColor} />);

    const spinnerContainer = container.firstChild as HTMLElement;
    const spinner = spinnerContainer.firstChild as HTMLElement;
    expect(spinner).toHaveStyle('border-top-color: #FF0000');
  });

  it('should apply custom className', () => {
    const customClassName = 'custom-class';
    const { container } = render(<LoadingSpinner className={customClassName} />);

    const spinnerContainer = container.firstChild as HTMLElement;
    expect(spinnerContainer).toHaveClass('custom-class');
  });

  it('should apply multiple custom classes', () => {
    const customClassName = 'custom-class another-class';
    const { container } = render(<LoadingSpinner className={customClassName} />);

    const spinnerContainer = container.firstChild as HTMLElement;
    expect(spinnerContainer).toHaveClass('custom-class', 'another-class');
  });

  it('should combine default and custom classes', () => {
    const customClassName = 'custom-class';
    const { container } = render(<LoadingSpinner className={customClassName} />);

    const spinnerContainer = container.firstChild as HTMLElement;
    expect(spinnerContainer).toHaveClass('flex', 'justify-center', 'items-center', 'custom-class');
  });

  it('should render with all props combined', () => {
    const customColor = '#00FF00';
    const customClassName = 'test-class';
    const { container } = render(
      <LoadingSpinner size='lg' color={customColor} className={customClassName} />
    );

    const spinnerContainer = container.firstChild as HTMLElement;
    expect(spinnerContainer).toHaveClass('flex', 'justify-center', 'items-center', 'test-class');

    const spinner = spinnerContainer.firstChild as HTMLElement;
    expect(spinner).toHaveClass(
      'w-12',
      'h-12',
      'border-2',
      'border-gray-200',
      'border-t-transparent',
      'rounded-full',
      'animate-spin'
    );
    expect(spinner).toHaveStyle('border-top-color: #00FF00');
  });

  it('should have correct structure', () => {
    const { container } = render(<LoadingSpinner />);

    const spinnerContainer = container.firstChild as HTMLElement;
    expect(spinnerContainer.tagName).toBe('DIV');
    expect(spinnerContainer.children).toHaveLength(1);

    const spinner = spinnerContainer.firstChild as HTMLElement;
    expect(spinner.tagName).toBe('DIV');
    expect(spinner.children).toHaveLength(0);
  });

  it('should be accessible', () => {
    const { container } = render(<LoadingSpinner />);

    const spinnerContainer = container.firstChild as HTMLElement;
    const spinner = spinnerContainer.firstChild as HTMLElement;

    // Check that the spinner has the animate-spin class for accessibility
    expect(spinner).toHaveClass('animate-spin');
  });
});
