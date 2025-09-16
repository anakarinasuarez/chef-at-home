"use client";

import AuthLayout from "@/components/auth/AuthLayout";
import { SuspenseWrapper } from "@/components/lazy/SuspenseWrapper";
import { LazyAuthForm } from "@/components/lazy/LazyComponents";

export default function SignupPage() {
  return (
    <AuthLayout
      title="Join our community"
      subtitle="Create your account and start cooking amazing recipes"
    >
      <SuspenseWrapper minHeight="400px">
        <LazyAuthForm
          type="signup"
          title="Join our community"
          subtitle="Create your account and start cooking amazing recipes"
        />
      </SuspenseWrapper>
    </AuthLayout>
  );
}
