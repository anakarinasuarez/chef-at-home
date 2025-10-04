import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PageErrorBoundary from '../PageErrorBoundary';

// Mock react-icons
vi.mock('react-icons/fi', () => ({
  FiHome: () => <div data-testid='home-icon'>Home</div>,
  FiRefreshCw: () => <div data-testid='refresh-icon'>Refresh</div>,
  FiMail: () => <div data-testid='mail-icon'>Mail</div>,
}));

// Mock Button component
vi.mock('../Button', () => ({
  default: ({ children, onClick, variant, className }: any) => (
    <button onClick={onClick} data-variant={variant} className={className} data-testid='button'>
      {children}
    </button>
  ),
}));

// Mock ErrorBoundaryAdvanced
vi.mock('../ErrorBoundaryAdvanced', () => ({
  ErrorBoundaryAdvanced: ({ children, fallback, onError }: any) => {
    // Only render fallback if children contains ThrowError
    const hasError = children && children.type && children.type.name === 'ThrowError';

    React.useEffect(() => {
      if (hasError && onError) {
        onError(new Error('Test error'), { componentStack: 'Test stack' });
      }
    }, [hasError, onError]);

    return hasError ? fallback : children;
  },
}));

// Mock window methods
const mockWindowLocation = {
  href: '',
  reload: vi.fn(),
};

const mockWindowOpen = vi.fn();

Object.defineProperty(window, 'location', {
  value: mockWindowLocation,
  writable: true,
});

Object.defineProperty(window, 'open', {
  value: mockWindowOpen,
  writable: true,
});

// Component that throws error for testing
const ThrowError = () => {
  throw new Error('Test error');
};

describe('PageErrorBoundary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockWindowLocation.href = '';
    mockWindowLocation.reload.mockClear();
    mockWindowOpen.mockClear();
  });

  it('should render children when no error occurs', () => {
    render(
      <PageErrorBoundary pageName='Test Page'>
        <div>Test content</div>
      </PageErrorBoundary>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should render error fallback when error occurs', () => {
    render(
      <PageErrorBoundary pageName='Test Page'>
        <ThrowError />
      </PageErrorBoundary>
    );

    expect(screen.getByText('Oops! The kitchen caught fire')).toBeInTheDocument();
    expect(
      screen.getByText(
        "Something went wrong while loading the Test Page page. Don't worry, our chefs are working on it!"
      )
    ).toBeInTheDocument();
    expect(screen.getByText('🍳💥')).toBeInTheDocument();
  });

  it('should use default page name when not provided', () => {
    render(
      <PageErrorBoundary>
        <ThrowError />
      </PageErrorBoundary>
    );

    expect(
      screen.getByText(
        "Something went wrong while loading the Page page. Don't worry, our chefs are working on it!"
      )
    ).toBeInTheDocument();
  });

  it('should render all action buttons', () => {
    render(
      <PageErrorBoundary pageName='Test Page'>
        <ThrowError />
      </PageErrorBoundary>
    );

    expect(screen.getByText('Go Home')).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
    expect(screen.getByText('Contact Support')).toBeInTheDocument();

    expect(screen.getByTestId('home-icon')).toBeInTheDocument();
    expect(screen.getByTestId('refresh-icon')).toBeInTheDocument();
    expect(screen.getByTestId('mail-icon')).toBeInTheDocument();
  });

  it('should handle go home button click', () => {
    render(
      <PageErrorBoundary pageName='Test Page'>
        <ThrowError />
      </PageErrorBoundary>
    );

    const goHomeButton = screen.getByText('Go Home');
    fireEvent.click(goHomeButton);

    expect(mockWindowLocation.href).toBe('/');
  });

  it('should handle reload button click', () => {
    render(
      <PageErrorBoundary pageName='Test Page'>
        <ThrowError />
      </PageErrorBoundary>
    );

    const reloadButton = screen.getByText('Try Again');
    fireEvent.click(reloadButton);

    expect(mockWindowLocation.reload).toHaveBeenCalledTimes(1);
  });

  it('should handle contact support button click', () => {
    render(
      <PageErrorBoundary pageName='Test Page'>
        <ThrowError />
      </PageErrorBoundary>
    );

    const contactButton = screen.getByText('Contact Support');
    fireEvent.click(contactButton);

    expect(mockWindowOpen).toHaveBeenCalledTimes(1);

    // Check that the call was made with the correct pattern instead of exact match
    const callArgs = mockWindowOpen.mock.calls[0][0];
    expect(callArgs).toMatch(
      /^mailto:support@chefathome\.com\?subject=Error%20on%20Test%20Page%20-%20.*&body=Hi%2C%0A%0AI%20encountered%20an%20error%20on%20the%20Test%20Page%20page\.%0A%0APlease%20help%20me%20resolve%20this%20issue\.%0A%0AThank%20you!$/
    );
  });

  it('should render error information section', () => {
    render(
      <PageErrorBoundary pageName='Test Page'>
        <ThrowError />
      </PageErrorBoundary>
    );

    expect(screen.getByText('What happened?')).toBeInTheDocument();
    expect(
      screen.getByText('The Test Page page encountered an unexpected error. This could be due to:')
    ).toBeInTheDocument();

    expect(screen.getByText('Network connectivity issues')).toBeInTheDocument();
    expect(screen.getByText('Browser compatibility problems')).toBeInTheDocument();
    expect(screen.getByText('Temporary server issues')).toBeInTheDocument();
    expect(screen.getByText('Data loading errors')).toBeInTheDocument();
  });

  it('should call onError callback when error occurs', () => {
    const mockOnError = vi.fn();

    render(
      <PageErrorBoundary pageName='Test Page' onError={mockOnError}>
        <ThrowError />
      </PageErrorBoundary>
    );

    expect(mockOnError).toHaveBeenCalledTimes(1);
    expect(mockOnError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: 'Test stack',
      })
    );
  });

  it('should have correct CSS classes', () => {
    const { container } = render(
      <PageErrorBoundary pageName='Test Page'>
        <ThrowError />
      </PageErrorBoundary>
    );

    const errorBoundaryElement = container.firstChild as HTMLElement;
    expect(errorBoundaryElement).toHaveClass(
      'min-h-screen',
      'flex',
      'items-center',
      'justify-center',
      'p-4'
    );
  });

  it('should render buttons with correct variants', () => {
    render(
      <PageErrorBoundary pageName='Test Page'>
        <ThrowError />
      </PageErrorBoundary>
    );

    const buttons = screen.getAllByTestId('button');
    expect(buttons[0]).toHaveAttribute('data-variant', 'primary'); // Go Home
    expect(buttons[1]).toHaveAttribute('data-variant', 'secondary'); // Try Again
    expect(buttons[2]).toHaveAttribute('data-variant', 'secondary'); // Contact Support
  });

  it('should render buttons with correct classes', () => {
    render(
      <PageErrorBoundary pageName='Test Page'>
        <ThrowError />
      </PageErrorBoundary>
    );

    const buttons = screen.getAllByTestId('button');
    buttons.forEach(button => {
      expect(button).toHaveClass('flex', 'items-center', 'gap-2', 'px-6', 'py-3');
    });
  });
});
