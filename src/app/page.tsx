import Image from "next/image";
import Link from "next/link";
import { colors, typography, spacingSystem } from "@/design-system";

export default function HomePage() {
  return (
    <div 
      className="min-h-screen text-white"
      style={{ backgroundColor: colors.interface.background.primary }}
    >
      {/* Header con Logo */}
      <header 
        className="px-8 py-6"
        style={{ padding: `${spacingSystem.base[8]} ${spacingSystem.base[8]}` }}
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ 
              backgroundColor: colors.brand.primary[500],
              width: spacingSystem.base[8],
              height: spacingSystem.base[8]
            }}
          >
            <span 
              className="text-black text-lg"
              style={{ 
                color: colors.interface.text.inverse,
                fontSize: typography.sizes.lg
              }}
            >
              👨‍🍳
            </span>
          </div>
          <div 
            className="text-xl font-bold"
            style={{ 
              fontSize: typography.sizes.xl,
              fontWeight: typography.weights.bold
            }}
          >
            <span style={{ color: colors.interface.text.primary }}>Chef</span>
            <span style={{ color: colors.interface.text.primary }}> at home</span>
          </div>
        </div>
      </header>

      {/* Contenido Principal - Layout de 2 columnas */}
      <main className="flex min-h-[calc(100vh-120px)]">
        {/* Columna Izquierda - Texto y Botones */}
        <div className="flex-1 flex flex-col justify-center px-8 lg:px-16">
          {/* Headline Principal */}
          <h1 
            className="mb-8 text-center lg:text-left leading-tight"
            style={{
              fontSize: typography.styles['display-2'].fontSize,
              fontWeight: typography.styles['display-2'].fontWeight,
              lineHeight: typography.styles['display-2'].lineHeight,
              letterSpacing: typography.styles['display-2'].letterSpacing,
              fontFamily: typography.styles['display-2'].fontFamily.join(', '),
              marginBottom: spacingSystem.base[8],
              color: colors.interface.text.primary
            }}
          >
            Turn your everyday ingredients into gourmet masterpieces with AI
            driven recipes
          </h1>

          {/* Lista de Beneficios */}
          <div 
            className="space-y-4 mb-12"
            style={{ 
              marginBottom: spacingSystem.base[12],
              gap: spacingSystem.base[4]
            }}
          >
            <div className="flex items-center gap-3">
              <span 
                className="text-xl"
                style={{ 
                  color: colors.brand.primary[500],
                  fontSize: typography.sizes.xl
                }}
              >
                •
              </span>
              <span 
                className="text-lg"
                style={{
                  fontSize: typography.styles['body-large'].fontSize,
                  color: colors.interface.text.primary
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
                  fontSize: typography.sizes.xl
                }}
              >
                •
              </span>
              <span 
                className="text-lg"
                style={{
                  fontSize: typography.styles['body-large'].fontSize,
                  color: colors.interface.text.primary
                }}
              >
                Unleash your inner chef and create magic in the kitchen!
              </span>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link 
              href="/auth/signup"
              className="rounded-lg font-semibold text-lg transition-colors text-center hover:opacity-90"
              style={{
                backgroundColor: colors.app.button.primary.background,
                color: colors.app.button.primary.text,
                padding: spacingSystem.components.button.padding.large,
                borderRadius: spacingSystem.components.button.borderRadius,
                fontWeight: typography.weights.semibold,
                fontSize: typography.styles['button-large'].fontSize,
                fontFamily: typography.styles['button-large'].fontFamily.join(', '),
                letterSpacing: typography.styles['button-large'].letterSpacing,
                lineHeight: typography.styles['button-large'].lineHeight
              }}
            >
              Sign up free
            </Link>
            <Link 
              href="/auth/login"
              className="rounded-lg font-semibold text-lg transition-colors text-center hover:bg-green-400 hover:text-black"
              style={{
                backgroundColor: colors.app.button.secondary.background,
                color: colors.app.button.secondary.text,
                border: `1px solid ${colors.app.button.secondary.border}`,
                padding: spacingSystem.components.button.padding.large,
                borderRadius: spacingSystem.components.button.borderRadius,
                fontWeight: typography.weights.semibold,
                fontSize: typography.styles['button-large'].fontSize,
                fontFamily: typography.styles['button-large'].fontFamily.join(', '),
                letterSpacing: typography.styles['button-large'].letterSpacing,
                lineHeight: typography.styles['button-large'].lineHeight
              }}
            >
              Login
            </Link>
          </div>
        </div>

        {/* Columna Derecha - Imagen Gourmet */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div 
            className="relative w-full max-w-lg h-96 lg:h-[500px]"
            style={{
              maxWidth: spacingSystem.components.page.maxWidth,
              height: spacingSystem.base[96]
            }}
          >
            <Image
              src="/images/gourmet-dish.jpg"
              alt="Gourmet dish with steak and vegetables"
              fill
              className="object-cover rounded-2xl"
              style={{
                borderRadius: spacingSystem.components.card.borderRadius
              }}
              priority
            />
          </div>
        </div>
      </main>
    </div>
  );
}
