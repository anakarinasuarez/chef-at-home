import MainLayout from "@/components/layouts/MainLayout";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export default function AuthLayout({
  children,
  title,
  subtitle,
}: AuthLayoutProps) {
  return (
    <MainLayout>
      {/* Headline Principal */}
      <h1 className="text-4xl font-bold text-white leading-tight mb-4">
        {title}
      </h1>
      {subtitle && <p className="text-gray-300 text-lg mb-6">{subtitle}</p>}

      {/* Contenido del formulario */}
      {children}
    </MainLayout>
  );
}
