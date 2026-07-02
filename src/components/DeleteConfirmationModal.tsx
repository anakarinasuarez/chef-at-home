'use client';

import Button from './Button';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmationModal({
  isOpen,
  title,
  onConfirm,
  onCancel,
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm'
      onClick={e => {
        if (e.target === e.currentTarget) {
          onCancel();
        }
      }}
    >
      <div
        className='mx-lg flex w-full max-w-form flex-col gap-2xl rounded-lg bg-surface px-2xl py-3xl shadow-2xl'
        onClick={e => e.stopPropagation()}
      >
        <h3 className='text-xl font-semibold text-fg'>Delete Recipe</h3>
        <p className='text-muted'>
          Are you sure you want to delete &quot;{title}&quot;? This action cannot be
          undone.
        </p>
        <div className='flex gap-md'>
          <Button variant='tertiary' onClick={onCancel} className='flex-1'>
            Cancel
          </Button>
          <Button variant='danger' onClick={onConfirm} className='flex-1'>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
