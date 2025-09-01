"use client";

import { useEffect } from "react";
import { colors, typography } from "@/design-system";
import { MdClose, MdCheckCircle, MdError, MdInfo } from "react-icons/md";

interface NotificationProps {
  message: string;
  type: "success" | "error" | "info";
  show: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Notification({
  message,
  type,
  show,
  onClose,
  duration = 3000,
}: NotificationProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <MdCheckCircle className="text-lg" />;
      case "error":
        return <MdError className="text-lg" />;
      case "info":
        return <MdInfo className="text-lg" />;
      default:
        return null;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "#10B981"; // green-500
      case "error":
        return "#EF4444"; // red-500
      case "info":
        return "#3B82F6"; // blue-500
      default:
        return colors.brand.primary[500];
    }
  };

  return (
    <div
      className="fixed top-20 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 flex items-center gap-3"
      style={{
        backgroundColor: getBackgroundColor(),
        color: colors.interface.background.primary,
      }}
    >
      {getIcon()}
      <span
        className="text-sm font-medium"
        style={{
          fontSize: typography.styles["body"].fontSize,
        }}
      >
        {message}
      </span>
      <button
        onClick={onClose}
        className="ml-2 text-white hover:text-gray-200 transition-colors"
      >
        <MdClose className="text-lg" />
      </button>
    </div>
  );
}
