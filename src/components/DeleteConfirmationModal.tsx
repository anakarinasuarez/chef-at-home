"use client";

import { colors, typography } from "@/design-system";

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
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      style={{ backdropFilter: "blur(2px)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onCancel();
        }
      }}
    >
      <div
        className="rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl"
        style={{
          backgroundColor: colors.interface.background.primary,
          color: colors.interface.text.primary,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: colors.interface.text.primary }}
        >
          Delete Recipe
        </h3>
        <p className="mb-6" style={{ color: colors.interface.text.secondary }}>
          Are you sure you want to delete "{title}"? This action cannot be
          undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2 px-4 rounded-lg transition-colors border"
            style={{
              backgroundColor: "transparent",
              color: colors.brand.primary[500],
              borderColor: colors.brand.primary[500],
              fontSize: typography.styles["button"].fontSize,
              fontWeight: typography.styles["button"].fontWeight,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.brand.primary[500];
              e.currentTarget.style.color = colors.interface.background.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = colors.brand.primary[500];
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 px-4 rounded-lg transition-colors"
            style={{
              backgroundColor: "#EF4444",
              color: colors.interface.background.primary,
              fontSize: typography.styles["button"].fontSize,
              fontWeight: typography.styles["button"].fontWeight,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#DC2626";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#EF4444";
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
