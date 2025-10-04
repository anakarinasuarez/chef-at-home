import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ErrorMessage from '../ui/ErrorMessage';

// Mock Button component
vi.mock('../Button', () => ({
  default: ({ children, onClick, variant, className }: any) => (
    <button onClick={onClick} data-variant={variant} className={className} data-testid='button'>
      {children}
    </button>
  ),
}));

describe('ErrorMessage', () => {
  it('should render with string error message', () => {
    render(<ErrorMessage error='Test error message' />);

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();
    expect(screen.getByText('😵')).toBeInTheDocument();
  });

  it('should render with Error object', () => {
    const error = new Error('Error object message');
    render(<ErrorMessage error={error} />);

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Error object message')).toBeInTheDocument();
    expect(screen.getByText('😵')).toBeInTheDocument();
  });

  it('should render retry button when onRetry is provided', () => {
    const mockOnRetry = vi.fn();
    render(<ErrorMessage error='Test error' onRetry={mockOnRetry} />);

    const retryButton = screen.getByText('Try Again');
    expect(retryButton).toBeInTheDocument();
    expect(retryButton).toHaveAttribute('data-variant', 'primary');
  });

  it('should render dismiss button when onDismiss is provided', () => {
    const mockOnDismiss = vi.fn();
    render(<ErrorMessage error='Test error' onDismiss={mockOnDismiss} />);

    const dismissButton = screen.getByText('Dismiss');
    expect(dismissButton).toBeInTheDocument();
    expect(dismissButton).toHaveAttribute('data-variant', 'secondary');
  });

  it('should render both buttons when both callbacks are provided', () => {
    const mockOnRetry = vi.fn();
    const mockOnDismiss = vi.fn();
    render(<ErrorMessage error='Test error' onRetry={mockOnRetry} onDismiss={mockOnDismiss} />);

    expect(screen.getByText('Try Again')).toBeInTheDocument();
    expect(screen.getByText('Dismiss')).toBeInTheDocument();
  });

  it('should call onRetry when retry button is clicked', () => {
    const mockOnRetry = vi.fn();
    render(<ErrorMessage error='Test error' onRetry={mockOnRetry} />);

    const retryButton = screen.getByText('Try Again');
    fireEvent.click(retryButton);

    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });

  it('should call onDismiss when dismiss button is clicked', () => {
    const mockOnDismiss = vi.fn();
    render(<ErrorMessage error='Test error' onDismiss={mockOnDismiss} />);

    const dismissButton = screen.getByText('Dismiss');
    fireEvent.click(dismissButton);

    expect(mockOnDismiss).toHaveBeenCalledTimes(1);
  });

  it('should not render buttons when callbacks are not provided', () => {
    render(<ErrorMessage error='Test error' />);

    expect(screen.queryByText('Try Again')).not.toBeInTheDocument();
    expect(screen.queryByText('Dismiss')).not.toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(<ErrorMessage error='Test error' className='custom-class' />);

    const errorContainer = container.firstChild as HTMLElement;
    expect(errorContainer).toHaveClass('custom-class');
  });

  it('should combine default and custom classes', () => {
    const { container } = render(<ErrorMessage error='Test error' className='custom-class' />);

    const errorContainer = container.firstChild as HTMLElement;
    expect(errorContainer).toHaveClass('text-center', 'py-8', 'custom-class');
  });

  it('should have correct structure', () => {
    const { container } = render(<ErrorMessage error='Test error' />);

    const errorContainer = container.firstChild as HTMLElement;
    expect(errorContainer.tagName).toBe('DIV');
    expect(errorContainer).toHaveClass('text-center', 'py-8');

    // Check for emoji
    const emoji = errorContainer.querySelector('.text-6xl');
    expect(emoji).toBeInTheDocument();
    expect(emoji?.textContent).toBe('😵');

    // Check for heading
    const heading = errorContainer.querySelector('h2');
    expect(heading).toBeInTheDocument();
    expect(heading?.textContent).toBe('Something went wrong');

    // Check for error message
    const errorText = errorContainer.querySelector('p');
    expect(errorText).toBeInTheDocument();
    expect(errorText?.textContent).toBe('Test error');
  });

  it('should handle empty string error', () => {
    render(<ErrorMessage error='' />);

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    // Check that the error message paragraph exists but is empty
    const errorParagraph = screen.getByText('Something went wrong').nextElementSibling;
    expect(errorParagraph).toBeInTheDocument();
    expect(errorParagraph?.textContent).toBe('');
  });

  it('should handle long error messages', () => {
    const longError =
      'This is a very long error message that should be displayed properly without breaking the layout or causing any issues with the component rendering';
    render(<ErrorMessage error={longError} />);

    expect(screen.getByText(longError)).toBeInTheDocument();
  });

  it('should handle special characters in error message', () => {
    const specialError = 'Error with special chars: !@#$%^&*()_+-=[]{}|;:,.<>?';
    render(<ErrorMessage error={specialError} />);

    expect(screen.getByText(specialError)).toBeInTheDocument();
  });

  it('should render buttons with correct classes', () => {
    const mockOnRetry = vi.fn();
    const mockOnDismiss = vi.fn();
    render(<ErrorMessage error='Test error' onRetry={mockOnRetry} onDismiss={mockOnDismiss} />);

    const buttons = screen.getAllByTestId('button');
    buttons.forEach(button => {
      expect(button).toHaveClass('px-6', 'py-3');
    });
  });
});
