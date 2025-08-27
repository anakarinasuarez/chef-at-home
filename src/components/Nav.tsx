"use client";

import { colors } from "@/design-system";
import { PiChefHatLight } from "react-icons/pi";
import { MdOutlineMenu } from "react-icons/md";

interface NavProps {
  showMenu?: boolean;
}

export default function Nav({ showMenu = false }: NavProps) {
  return (
    <nav
      className="w-full px-8 py-4 flex items-center justify-between"
      style={{ backgroundColor: colors.interface.background.secondary }}
    >
      {/* Logo */}
      <div className="flex items-end">
        {/* Chef Hat Icon - Usando PiChefHatLight */}
        <div className="w-10 h-10 flex items-center justify-center">
          <PiChefHatLight
            className="text-2xl"
            style={{
              color: colors.brand.primary[500],
              fontSize: "28px",
            }}
          />
        </div>

        {/* Logo Text */}
        <div className="flex items-end space-x-0.5">
          <span
            className="font-alegreya text-white"
            style={{
              fontSize: "20px",
              fontWeight: 600,
              fontFamily: "var(--font-alegreya), serif",
            }}
          >
            Chef
          </span>
          <span
            className="font-alegreya"
            style={{
              fontSize: "20px",
              fontWeight: 600,
              color: colors.brand.primary[500],
              fontFamily: "var(--font-alegreya), serif",
            }}
          >
            at
          </span>
          <span
            className="font-alegreya text-white"
            style={{
              fontSize: "20px",
              fontWeight: 600,
              fontFamily: "var(--font-alegreya), serif",
            }}
          >
            home
          </span>
        </div>
      </div>

      {/* Menu Hamburger - Solo se muestra si showMenu es true */}
      {showMenu && (
        <div className="flex items-center">
          <button
            className="flex items-center p-2 hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Menu"
          >
            <MdOutlineMenu
              className="text-2xl"
              style={{
                color: colors.interface.text.primary,
                fontSize: "24px",
              }}
            />
          </button>
        </div>
      )}
    </nav>
  );
}
