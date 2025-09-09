"use client";

import AuthLayout from "@/components/auth/AuthLayout";
import AuthForm from "@/components/auth/AuthForm";

export default function SignupPage() {
  return (
    <AuthLayout
      title="Join our community"
      subtitle="Create your account and start cooking amazing recipes"
    >
      <AuthForm
        type="signup"
        title="Join our community"
        subtitle="Create your account and start cooking amazing recipes"
      />
    </AuthLayout>
  );
}
