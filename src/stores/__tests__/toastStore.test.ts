import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useToastStore } from '../toastStore';

describe('ToastStore', () => {
  beforeEach(() => {
    // Reset store state
    act(() => {
      useToastStore.setState({
        toasts: [],
        maxToasts: 5,
      });
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useToastStore());

      expect(result.current.toasts).toEqual([]);
      expect(result.current.maxToasts).toBe(5);
    });

    it('should have all required methods', () => {
      const { result } = renderHook(() => useToastStore());

      expect(typeof result.current.addToast).toBe('function');
      expect(typeof result.current.removeToast).toBe('function');
      expect(typeof result.current.clearToasts).toBe('function');
      expect(typeof result.current.updateToast).toBe('function');
      expect(typeof result.current.showSuccess).toBe('function');
      expect(typeof result.current.showError).toBe('function');
      expect(typeof result.current.showWarning).toBe('function');
      expect(typeof result.current.showInfo).toBe('function');
      expect(typeof result.current.getToastsByType).toBe('function');
      expect(typeof result.current.dismissToast).toBe('function');
    });
  });

  describe('Basic Actions', () => {
    it('should add toast correctly', () => {
      const { result } = renderHook(() => useToastStore());
      const toastData = {
        message: 'Test message',
        type: 'info' as const,
        duration: 5000,
      };

      act(() => {
        result.current.addToast(toastData);
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].message).toBe('Test message');
      expect(result.current.toasts[0].type).toBe('info');
      expect(result.current.toasts[0].duration).toBe(5000);
      expect(result.current.toasts[0].id).toBeDefined();
      expect(result.current.toasts[0].timestamp).toBeInstanceOf(Date);
    });

    it('should remove toast correctly', () => {
      const { result } = renderHook(() => useToastStore());
      const toastData = {
        message: 'Test message',
        type: 'info' as const,
      };

      act(() => {
        result.current.addToast(toastData);
      });

      expect(result.current.toasts).toHaveLength(1);
      const toastId = result.current.toasts[0].id;

      act(() => {
        result.current.removeToast(toastId);
      });

      expect(result.current.toasts).toHaveLength(0);
    });

    it('should clear all toasts', () => {
      const { result } = renderHook(() => useToastStore());

      act(() => {
        result.current.addToast({ message: 'Toast 1', type: 'info' });
        result.current.addToast({ message: 'Toast 2', type: 'success' });
        result.current.addToast({ message: 'Toast 3', type: 'error' });
      });

      expect(result.current.toasts).toHaveLength(3);

      act(() => {
        result.current.clearToasts();
      });

      expect(result.current.toasts).toHaveLength(0);
    });

    it('should update toast correctly', () => {
      const { result } = renderHook(() => useToastStore());
      const toastData = {
        message: 'Original message',
        type: 'info' as const,
      };

      act(() => {
        result.current.addToast(toastData);
      });

      const toastId = result.current.toasts[0].id;

      act(() => {
        result.current.updateToast(toastId, {
          message: 'Updated message',
          type: 'success',
        });
      });

      expect(result.current.toasts[0].message).toBe('Updated message');
      expect(result.current.toasts[0].type).toBe('success');
    });

    it('should not update non-existent toast', () => {
      const { result } = renderHook(() => useToastStore());

      act(() => {
        result.current.updateToast('non-existent-id', {
          message: 'Updated message',
        });
      });

      expect(result.current.toasts).toHaveLength(0);
    });
  });

  describe('Specific Toast Actions', () => {
    it('should show success toast', () => {
      const { result } = renderHook(() => useToastStore());

      act(() => {
        result.current.showSuccess('Success message');
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].message).toBe('Success message');
      expect(result.current.toasts[0].type).toBe('success');
    });

    it('should show error toast', () => {
      const { result } = renderHook(() => useToastStore());

      act(() => {
        result.current.showError('Error message');
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].message).toBe('Error message');
      expect(result.current.toasts[0].type).toBe('error');
    });

    it('should show warning toast', () => {
      const { result } = renderHook(() => useToastStore());

      act(() => {
        result.current.showWarning('Warning message');
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].message).toBe('Warning message');
      expect(result.current.toasts[0].type).toBe('warning');
    });

    it('should show info toast', () => {
      const { result } = renderHook(() => useToastStore());

      act(() => {
        result.current.showInfo('Info message');
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].message).toBe('Info message');
      expect(result.current.toasts[0].type).toBe('info');
    });

    it('should show toast with custom options', () => {
      const { result } = renderHook(() => useToastStore());
      const mockAction = vi.fn();

      act(() => {
        result.current.showSuccess('Success message', {
          duration: 10000,
          action: {
            label: 'Undo',
            onClick: mockAction,
          },
          dismissible: false,
        });
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].duration).toBe(10000);
      expect(result.current.toasts[0].action).toBeDefined();
      expect(result.current.toasts[0].action?.label).toBe('Undo');
      expect(result.current.toasts[0].dismissible).toBe(false);
    });
  });

  describe('Utility Functions', () => {
    it('should get toasts by type', () => {
      const { result } = renderHook(() => useToastStore());

      act(() => {
        result.current.showSuccess('Success 1');
        result.current.showError('Error 1');
        result.current.showSuccess('Success 2');
        result.current.showInfo('Info 1');
      });

      const successToasts = result.current.getToastsByType('success');
      const errorToasts = result.current.getToastsByType('error');
      const infoToasts = result.current.getToastsByType('info');

      expect(successToasts).toHaveLength(2);
      expect(errorToasts).toHaveLength(1);
      expect(infoToasts).toHaveLength(1);
      expect(successToasts.every(toast => toast.type === 'success')).toBe(true);
      expect(errorToasts.every(toast => toast.type === 'error')).toBe(true);
      expect(infoToasts.every(toast => toast.type === 'info')).toBe(true);
    });

    it('should dismiss toast', () => {
      const { result } = renderHook(() => useToastStore());
      const mockAction = vi.fn();

      act(() => {
        result.current.showSuccess('Success message', {
          action: {
            label: 'Undo',
            onClick: mockAction,
          },
        });
      });

      const toastId = result.current.toasts[0].id;

      act(() => {
        result.current.dismissToast(toastId);
      });

      expect(result.current.toasts).toHaveLength(0);
    });

    it('should not dismiss non-existent toast', () => {
      const { result } = renderHook(() => useToastStore());

      act(() => {
        result.current.showSuccess('Success message');
      });

      expect(result.current.toasts).toHaveLength(1);

      act(() => {
        result.current.dismissToast('non-existent-id');
      });

      expect(result.current.toasts).toHaveLength(1);
    });
  });

  describe('Max Toasts Limit', () => {
    it('should respect max toasts limit', () => {
      const { result } = renderHook(() => useToastStore());

      // Set max toasts to 3
      act(() => {
        useToastStore.setState({ maxToasts: 3 });
      });

      act(() => {
        result.current.showSuccess('Toast 1');
        result.current.showSuccess('Toast 2');
        result.current.showSuccess('Toast 3');
        result.current.showSuccess('Toast 4'); // Should remove oldest
        result.current.showSuccess('Toast 5'); // Should remove oldest
      });

      expect(result.current.toasts).toHaveLength(3);
      // Should keep the last 3 toasts
      expect(result.current.toasts[0].message).toBe('Toast 3');
      expect(result.current.toasts[1].message).toBe('Toast 4');
      expect(result.current.toasts[2].message).toBe('Toast 5');
    });
  });

  describe('Selectors', () => {
    it('should return toasts', () => {
      const { result } = renderHook(() => useToastStore());

      act(() => {
        useToastStore.getState().showSuccess('Test toast');
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].message).toBe('Test toast');
      expect(result.current.toasts[0].type).toBe('success');
    });
  });

  describe('Toast Properties', () => {
    it('should generate unique IDs for toasts', () => {
      const { result } = renderHook(() => useToastStore());

      act(() => {
        result.current.showSuccess('Toast 1');
        result.current.showSuccess('Toast 2');
        result.current.showSuccess('Toast 3');
      });

      const ids = result.current.toasts.map(toast => toast.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(3);
      expect(ids.length).toBe(3);
    });

    it('should set timestamp when creating toast', () => {
      const { result } = renderHook(() => useToastStore());
      const beforeTime = new Date();

      act(() => {
        result.current.showSuccess('Test toast');
      });

      const afterTime = new Date();
      const toastTimestamp = result.current.toasts[0].timestamp;

      expect(toastTimestamp.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
      expect(toastTimestamp.getTime()).toBeLessThanOrEqual(afterTime.getTime());
    });

    it('should set default duration for different toast types', () => {
      const { result } = renderHook(() => useToastStore());

      act(() => {
        result.current.showSuccess('Success toast');
        result.current.showError('Error toast');
        result.current.showWarning('Warning toast');
        result.current.showInfo('Info toast');
      });

      const successToast = result.current.toasts.find(t => t.type === 'success');
      const errorToast = result.current.toasts.find(t => t.type === 'error');
      const warningToast = result.current.toasts.find(t => t.type === 'warning');
      const infoToast = result.current.toasts.find(t => t.type === 'info');

      expect(successToast?.duration).toBe(5000);
      expect(errorToast?.duration).toBe(7000);
      expect(warningToast?.duration).toBe(6000);
      expect(infoToast?.duration).toBe(5000); // Info toast uses default duration
    });
  });
});
