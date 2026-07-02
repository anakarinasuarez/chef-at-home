"use client";

import React, { ReactNode } from "react";
import { ErrorBoundaryAdvanced } from "./ErrorBoundaryAdvanced";
import { colors } from "@/design-system";
import { FiHome, FiRefreshCw, FiMail } from "react-icons/fi";
import Button from "./Button";

interface PageErrorBoundaryProps {
  children: ReactNode;
  pageName?: string;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export const PageErrorBoundary: React.FC<PageErrorBoundaryProps> = ({
  children,
  pageName = "Page",
  onError,
}) => {
  const handleGoHome = () => {
    window.location.href = "/";
  };

  const handleReload = () => {
    window.location.reload();
  };

  const handleContactSupport = () => {
    const subject = encodeURIComponent(
      `Error on ${pageName} - ${new Date().toISOString()}`
    );
    const body = encodeURIComponent(
      `Hi,\n\nI encountered an error on the ${pageName} page.\n\nPlease help me resolve this issue.\n\nThank you!`
    );
    const mailtoLink = `mailto:support@chefathome.com?subject=${subject}&body=${body}`;
    window.open(mailtoLink);
  };

  const customFallback = (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: colors.interface.background.primary }}
    >
      <div className="text-center max-w-form">
        <div className="text-8xl mb-6">🍳💥</div>

        <h1
          className="text-3xl font-bold mb-4"
          style={{ color: colors.interface.text.primary }}
        >
          Oops! The kitchen caught fire
        </h1>

        <p
          className="mb-8 text-lg"
          style={{ color: colors.interface.text.secondary }}
        >
          Something went wrong while loading the {pageName} page. Don&apos;t
          worry, our chefs are working on it!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button
            onClick={handleGoHome}
            variant="primary"
            className="flex items-center gap-2 px-6 py-3"
          >
            <FiHome className="text-lg" />
            Go Home
          </Button>

          <Button
            onClick={handleReload}
            variant="secondary"
            className="flex items-center gap-2 px-6 py-3"
          >
            <FiRefreshCw className="text-lg" />
            Try Again
          </Button>

          <Button
            onClick={handleContactSupport}
            variant="secondary"
            className="flex items-center gap-2 px-6 py-3"
          >
            <FiMail className="text-lg" />
            Contact Support
          </Button>
        </div>

        <div
          className="text-sm p-4 rounded-lg"
          style={{
            backgroundColor: colors.interface.background.secondary,
            color: colors.interface.text.tertiary,
          }}
        >
          <p className="mb-2">
            <strong>What happened?</strong>
          </p>
          <p className="mb-2">
            The {pageName} page encountered an unexpected error. This could be
            due to:
          </p>
          <ul className="text-left list-disc list-inside space-y-1">
            <li>Network connectivity issues</li>
            <li>Browser compatibility problems</li>
            <li>Temporary server issues</li>
            <li>Data loading errors</li>
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <ErrorBoundaryAdvanced
      level="page"
      errorBoundaryName={`PageErrorBoundary-${pageName}`}
      fallback={customFallback}
      onError={onError}
      allowRetry={true}
      showDetails={process.env.NODE_ENV === "development"}
    >
      {children}
    </ErrorBoundaryAdvanced>
  );
};

export default PageErrorBoundary;
