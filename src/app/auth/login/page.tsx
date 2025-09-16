"use client";

import AuthLayout from "@/components/auth/AuthLayout";
import { SuspenseWrapper } from "@/components/lazy/SuspenseWrapper";
import { LazyAuthForm } from "@/components/lazy/LazyComponents";

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back chef"
      subtitle="Sign in to continue creating amazing recipes"
    >
      <SuspenseWrapper minHeight="400px">
        <LazyAuthForm
          type="login"
          title="Welcome back chef"
          subtitle="Sign in to continue creating amazing recipes"
        />
      </SuspenseWrapper>
    </AuthLayout>
  );
}
