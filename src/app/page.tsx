import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header con Logo */}
      <header className="px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
            <span className="text-black text-lg">👨‍🍳</span>
          </div>
          <div className="text-xl font-bold">
            <span className="text-white">Chef</span>
            <span className="text-white font-normal"> at home</span>
          </div>
        </div>
      </header>

      {/* Contenido Principal - Layout de 2 columnas */}
      <main className="flex min-h-[calc(100vh-120px)]">
        {/* Columna Izquierda - Texto y Botones */}
        <div className="flex-1 flex flex-col justify-center px-8 lg:px-16">
          {/* Headline Principal */}
          <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-8 text-center lg:text-left">
            Turn your everyday ingredients into gourmet masterpieces with AI driven recipes
          </h1>

          {/* Lista de Beneficios */}
          <div className="space-y-4 mb-12">
            <div className="flex items-center gap-3">
              <span className="text-green-400 text-xl">•</span>
              <span className="text-lg">Reduce waste, save money, and cook like a pro</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-green-400 text-xl">•</span>
              <span className="text-lg">Unleash your inner chef and create magic in the kitchen!</span>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link 
              href="/auth/signup"
              className="bg-green-400 text-black px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-300 transition-colors text-center"
            >
              Sign up free
            </Link>
            <Link 
              href="/auth/login"
              className="border border-green-400 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-400 hover:text-black transition-colors text-center"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Columna Derecha - Imagen Gourmet */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="relative w-full max-w-lg h-96 lg:h-[500px]">
            <Image
              src="/images/gourmet-dish.jpg"
              alt="Gourmet dish with steak and vegetables"
              fill
              className="object-cover rounded-2xl"
              priority
            />
          </div>
        </div>
      </main>
    </div>
  );
}
