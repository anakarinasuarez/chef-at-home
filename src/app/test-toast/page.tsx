"use client";

import { useToast } from "@/hooks";

export default function TestToastPage() {
  const { showSuccess, showError, showLoading, dismiss } = useToast();

  const testSuccess = () => {
    showSuccess("Success message!");
  };

  const testError = () => {
    showError("Error message!");
  };

  const testLoading = () => {
    const toastId = showLoading("Loading...");
    setTimeout(() => {
      dismiss(toastId);
      showSuccess("Done!");
    }, 2000);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Toast Test</h1>
      <div className="space-x-4">
        <button
          onClick={testSuccess}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Success
        </button>
        <button
          onClick={testError}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Error
        </button>
        <button
          onClick={testLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Loading
        </button>
      </div>
    </div>
  );
}
