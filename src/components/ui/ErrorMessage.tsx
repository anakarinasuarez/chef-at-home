import React from "react";
import { colors } from "@/design-system";
import Button from "../Button";

interface ErrorMessageProps {
  error: Error | string;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  error,
  onRetry,
  onDismiss,
  className = "",
}) => {
  const errorMessage = error instanceof Error ? error.message : error;

  return (
    <div className={`text-center py-8 ${className}`}>
      <div className="text-6xl mb-4">😵</div>
      <h2
        className="text-2xl font-bold mb-2"
        style={{ color: colors.interface.text.primary }}
      >
        Something went wrong
      </h2>
      <p
        className="mb-6"
        style={{ color: colors.interface.text.secondary }}
      >
        {errorMessage}
      </p>
      <div className="flex gap-4 justify-center">
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="primary"
            className="px-6 py-3"
          >
            Try Again
          </Button>
        )}
        {onDismiss && (
          <Button
            onClick={onDismiss}
            variant="secondary"
            className="px-6 py-3"
          >
            Dismiss
          </Button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
