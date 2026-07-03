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
        className='mx-lg flex w-full max-w-form flex-col gap-xl rounded-lg bg-elevated p-xl shadow-2xl'
        onClick={e => e.stopPropagation()}
      >
        <h3
          className='text-xl font-semibold leading-snug tracking-[-0.4px] text-fg'
          title={title}
        >
          Are you sure you want to delete the recipe?
        </h3>
        <div className='flex justify-end gap-md'>
          <Button variant='secondary' onClick={onCancel}>
            Cancel
          </Button>
          <Button variant='danger-solid' onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
