"use client";

import { useToastStore } from "@/stores";

export default function TestToastPage() {
  const showSuccess = useToastStore((state) => state.showSuccess);
  const showError = useToastStore((state) => state.showError);
  const showInfo = useToastStore((state) => state.showInfo);
  const dismissToast = useToastStore((state) => state.dismissToast);

  const testSuccess = () => {
    showSuccess("Operation completed successfully!");
  };

  const testError = () => {
    showError("An unexpected error occurred");
  };

  const testLoading = () => {
    showInfo("Processing your request...");
    setTimeout(() => {
      showSuccess("Operation completed!");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Toast Notification Test
        </h1>

        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">
              Test Different Toast Types
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={testSuccess}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
              >
                Success Toast
              </button>

              <button
                onClick={testError}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
              >
                Error Toast
              </button>

              <button
                onClick={testLoading}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
              >
                Loading Toast
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Toast Colors</h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span>Success - Green (#10b981)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span>Error - Red (#ef4444)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span>Loading - Blue (#3b82f6)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
