import Image from "next/image";
import { colors, typography, spacingSystem } from "@/design-system";
import Button from "@/components/Button";

export default function HomePage() {
  return (
    <div
      className="min-h-screen text-white"
      style={{ backgroundColor: colors.interface.background.primary }}
    >
      {/* Header con Logo */}
      <header
        className="px-8 py-4"
        style={{ padding: `${spacingSystem.base[4]} ${spacingSystem.base[8]}` }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: colors.brand.primary[500],
              width: spacingSystem.base[8],
              height: spacingSystem.base[8],
            }}
          >
            <span
              className="text-black text-lg"
              style={{
                color: colors.interface.text.inverse,
                fontSize: typography.sizes.lg,
              }}
            >
              👨‍🍳
            </span>
          </div>
          <div
            className="text-xl font-bold"
            style={{
              fontSize: typography.styles["title-3"].fontSize,
              fontWeight: typography.styles["title-3"].fontWeight,
              fontFamily: typography.styles["title-3"].fontFamily.join(", "),
              color: colors.interface.text.primary,
            }}
          >
            <span>Chef</span>
            <span> at home</span>
          </div>
        </div>
      </header>

      {/* Contenido Principal - Layout de 2 columnas */}
      <main className="flex min-h-[calc(100vh-120px)] pt-8">
        {/* Columna Izquierda - Texto y Botones */}
        <div className="flex-1 flex flex-col justify-start px-8 lg:px-16 pt-8">
          {/* Headline Principal - Usando el estilo 'display' */}
          <h1
            className="mb-8 text-center lg:text-left leading-tight"
            style={{
              fontSize: typography.styles["display"].fontSize,
              fontWeight: typography.styles["display"].fontWeight,
              lineHeight: typography.styles["display"].lineHeight,
              letterSpacing: typography.styles["display"].letterSpacing,
              fontFamily: typography.styles["display"].fontFamily.join(", "),
              marginBottom: spacingSystem.base[8],
              color: colors.interface.text.primary,
            }}
          >
            Turn your everyday ingredients into gourmet masterpieces with AI
            driven recipes
          </h1>

          {/* Lista de Beneficios - Usando el estilo 'subtitle' */}
          <div
            className="space-y-4 mb-12"
            style={{
              marginBottom: spacingSystem.base[12],
              gap: spacingSystem.base[4],
            }}
          >
            <div className="flex items-center gap-3">
              <span
                className="text-xl"
                style={{
                  color: colors.brand.primary[500],
                  fontSize: typography.sizes.xl,
                }}
              >
                •
              </span>
              <span
                className="text-lg"
                style={{
                  fontSize: typography.styles["subtitle"].fontSize,
                  fontWeight: typography.styles["subtitle"].fontWeight,
                  lineHeight: typography.styles["subtitle"].lineHeight,
                  letterSpacing: typography.styles["subtitle"].letterSpacing,
                  fontFamily:
                    typography.styles["subtitle"].fontFamily.join(", "),
                  color: colors.interface.text.primary,
                }}
              >
                Reduce waste, save money, and cook like a pro
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span
                className="text-xl"
                style={{
                  color: colors.brand.primary[500],
                  fontSize: typography.sizes.xl,
                }}
              >
                •
              </span>
              <span
                className="text-lg"
                style={{
                  fontSize: typography.styles["subtitle"].fontSize,
                  fontWeight: typography.styles["subtitle"].fontWeight,
                  lineHeight: typography.styles["subtitle"].lineHeight,
                  letterSpacing: typography.styles["subtitle"].letterSpacing,
                  fontFamily:
                    typography.styles["subtitle"].fontFamily.join(", "),
                  color: colors.interface.text.primary,
                }}
              >
                Unleash your inner chef and create magic in the kitchen!
              </span>
            </div>
          </div>

          {/* Botones de Acción - Usando el componente Button reutilizable */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button href="/auth/signup" variant="primary">
              Sign up free
            </Button>
            <Button href="/auth/login" variant="secondary">
              Login
            </Button>
          </div>
        </div>

        {/* Columna Derecha - Imagen Gourmet */}
        <div className="flex-1 flex items-start justify-center p-4 sm:p-6 lg:p-8">
          <div
            className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] xl:w-[700px] xl:h-[700px]"
            style={{
              width: "480px",
              height: "480px",
            }}
          >
            <Image
              src="/images/plate.png"
              alt="Gourmet dish with steak and vegetables"
              fill
              className="object-cover rounded-2xl"
              style={{
                borderRadius: spacingSystem.components.card.borderRadius,
              }}
              priority
            />
          </div>
        </div>
      </main>
    </div>
  );
}
