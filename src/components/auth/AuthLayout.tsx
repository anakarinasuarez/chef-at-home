import AppLayout from "@/components/layouts/AppLayout";
import Image from "next/image";
import plateImage from "@/assets/images/plate.png";

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
    <AppLayout className="flex pt-16">
      {/* Formulario a la izquierda */}
      <div className="w-full max-w-md mr-auto flex flex-col justify-center px-8 py-12">
        {/* Headline Principal */}
        <div className="mb-6 text-left">
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            {title}
          </h1>
          {subtitle && <p className="text-gray-300 text-lg">{subtitle}</p>}
        </div>

        {/* Contenido del formulario */}
        {children}
      </div>

      {/* Columna Derecha - Imagen */}
      <div className="flex-1 flex items-center justify-center px-8 lg:px-16 py-12">
        <div className="relative w-full max-w-lg">
          <Image
            src={plateImage}
            alt="Gourmet dish"
            className="w-full h-auto rounded-lg shadow-2xl"
            priority
          />
        </div>
      </div>
    </AppLayout>
  );
}
