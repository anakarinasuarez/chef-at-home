"use client";

import AuthLayout from "@/components/auth/AuthLayout";
import AuthForm from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back chef"
      subtitle="Sign in to continue creating amazing recipes"
    >
      <AuthForm
        type="login"
        title="Welcome back chef"
        subtitle="Sign in to continue creating amazing recipes"
      />
    </AuthLayout>
  );
}
