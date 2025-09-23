"use client";

import { useAuthUnified } from "@/hooks";
import { useToastTransition } from "@/hooks";
import Button from "@/components/Button";
import MainLayout from "@/components/layouts/MainLayout";

export default function TestUnifiedAuthPage() {
  const { user, isLoading, error, login, register, logout } = useAuthUnified();
  const { showSuccess, showError } = useToastTransition();

  const handleTestLogin = async () => {
    const success = await login("test@example.com", "password123");
    if (success) {
      showSuccess("Login successful!");
    } else {
      showError("Login failed");
    }
  };

  const handleTestRegister = async () => {
    const success = await register(
      "Test User",
      "test@example.com",
      "password123"
    );
    if (success) {
      showSuccess("Registration successful!");
    } else {
      showError("Registration failed");
    }
  };

  const handleTestLogout = () => {
    logout();
    showSuccess("Logged out successfully!");
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4 text-white">Auth State</h2>
          <div className="space-y-2 text-sm">
            <p>
              <strong>User:</strong>{" "}
              {user ? JSON.stringify(user, null, 2) : "null"}
            </p>
            <p>
              <strong>Loading:</strong> {isLoading ? "true" : "false"}
            </p>
            <p>
              <strong>Error:</strong> {error || "null"}
            </p>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4 text-white">Test Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Button onClick={handleTestLogin} variant="primary">
              Test Login
            </Button>
            <Button onClick={handleTestRegister} variant="primary">
              Test Register
            </Button>
            <Button onClick={handleTestLogout} variant="secondary">
              Test Logout
            </Button>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4 text-white">Instructions</h2>
          <div className="text-sm text-gray-300 space-y-2">
            <p>
              1. This page tests the unified Zustand store with
              AuthContext-compatible interface
            </p>
            <p>2. Check that user state persists across page refreshes</p>
            <p>3. Verify that login/logout works correctly</p>
            <p>4. Compare behavior with existing AuthContext implementation</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
