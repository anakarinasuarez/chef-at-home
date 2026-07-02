import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Button from '../Button';

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ href, children, className }: any) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

describe('Button', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders as button when no href provided', () => {
      render(<Button variant='primary'>Click me</Button>);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Click me');
      expect(button).toHaveAttribute('type', 'button');
    });

    it('renders as Link when href provided', () => {
      render(
        <Button variant='primary' href='/test'>
          Go to test
        </Button>
      );

      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveTextContent('Go to test');
      expect(link).toHaveAttribute('href', '/test');
    });

    it('renders submit button when type is submit', () => {
      render(
        <Button variant='primary' type='submit'>
          Submit
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('renders a real button (not a link) when disabled even with href', () => {
      render(
        <Button variant='primary' href='/test' disabled>
          Disabled link
        </Button>
      );

      expect(screen.queryByRole('link')).not.toBeInTheDocument();
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('applies custom className alongside variant hooks', () => {
      render(
        <Button variant='primary' className='custom-class'>
          Button
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
      expect(button).toHaveClass('button');
      expect(button).toHaveClass('button-primary');
    });
  });

  describe('Variants', () => {
    it('applies primary variant token classes', () => {
      render(<Button variant='primary'>Primary Button</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('button-primary');
      expect(button).toHaveClass('bg-primary');
      expect(button).toHaveClass('text-on-primary');
    });

    it('applies secondary variant token classes', () => {
      render(<Button variant='secondary'>Secondary Button</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('button-secondary');
      expect(button).toHaveClass('text-primary');
    });

    it('applies danger variant token classes', () => {
      render(<Button variant='danger'>Delete</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('button-danger');
      expect(button).toHaveClass('text-danger');
    });

    it('renders icon variant with square padding (no size padding)', () => {
      render(
        <Button variant='icon' aria-label='menu'>
          <span>×</span>
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveClass('button-icon');
      expect(button).toHaveClass('p-md');
      expect(button).toHaveAttribute('aria-label', 'menu');
    });
  });

  describe('Sizes', () => {
    it('applies size hook classes', () => {
      render(
        <Button variant='primary' size='lg'>
          Large
        </Button>
      );
      expect(screen.getByRole('button')).toHaveClass('button-lg');
    });

    it('applies full width', () => {
      render(
        <Button variant='primary' fullWidth>
          Wide
        </Button>
      );
      expect(screen.getByRole('button')).toHaveClass('w-full');
    });
  });

  describe('Disabled State', () => {
    it('disables button when disabled prop is true', () => {
      render(
        <Button variant='primary' disabled>
          Disabled Button
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('disabled:cursor-not-allowed');
    });

    it('does not disable button when disabled prop is false', () => {
      render(
        <Button variant='primary' disabled={false}>
          Enabled Button
        </Button>
      );

      expect(screen.getByRole('button')).not.toBeDisabled();
    });
  });

  describe('Click Events', () => {
    it('calls onClick when button is clicked', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <Button variant='primary' onClick={handleClick}>
          Click me
        </Button>
      );

      await user.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when button is disabled', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <Button variant='primary' disabled onClick={handleClick}>
          Disabled
        </Button>
      );

      await user.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('handles undefined onClick without throwing', () => {
      render(
        <Button variant='primary' onClick={undefined}>
          No onClick
        </Button>
      );

      const button = screen.getByRole('button');
      expect(() => fireEvent.click(button)).not.toThrow();
    });
  });

  describe('Children', () => {
    it('renders complex children', () => {
      render(
        <Button variant='primary'>
          <span>Icon</span> Text Content
        </Button>
      );

      expect(screen.getByText('Icon')).toBeInTheDocument();
      expect(screen.getByText('Text Content')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper button role', () => {
      render(<Button variant='primary'>Accessible Button</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('has proper link role when href provided', () => {
      render(
        <Button variant='primary' href='/test'>
          Accessible Link
        </Button>
      );
      expect(screen.getByRole('link')).toBeInTheDocument();
    });

    it('maintains focus', () => {
      render(<Button variant='primary'>Focusable Button</Button>);
      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveFocus();
    });
  });
});
