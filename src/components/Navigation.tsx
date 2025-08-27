"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChefHat, Plus, Utensils, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { colors } from "@/lib/colors";
import Logo from "@/components/Logo";

export default function Navigation() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav
      className="absolute top-0 left-0 right-0 z-50 px-8 py-4"
      style={{
        backgroundColor: colors.nav.background,
        borderTop: `2px solid ${colors.nav.border}`,
      }}
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center space-x-2"
          onClick={closeMenu}
        >
          <Logo size="sm" />
        </Link>

        {/* User Section - Only Avatar and Menu */}
        <div className="flex items-center space-x-3">
          {user ? (
            <div className="flex items-center space-x-2">
              {/* User Avatar */}
              <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user.name
                    ? user.name.charAt(0).toUpperCase()
                    : user.email.charAt(0).toUpperCase()}
                </span>
              </div>

              {/* User Name (hidden on small screens) */}
              <span
                className="text-xs font-medium hidden sm:block"
                style={{ color: colors.text.primary }}
              >
                {user.name || user.email}
              </span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                href="/auth/login"
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                style={{
                  backgroundColor: colors.primary.main,
                  color: colors.text.primary,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.primary.hover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.primary.main;
                }}
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="border px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                style={{
                  borderColor: colors.text.primary,
                  color: colors.text.primary,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.text.primary;
                  e.currentTarget.style.color = colors.background;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = colors.text.primary;
                }}
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Menu Button - Hidden when menu is open */}
          {!isMenuOpen && (
            <button
              onClick={toggleMenu}
              className="p-1.5 rounded-lg transition-colors hover:bg-gray-700"
              style={{
                color: colors.text.primary,
              }}
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Menu Overlay - Top Right Corner */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50">
          {/* Menu dropdown positioned from the top */}
          <div className="absolute top-0 right-0 w-64 h-auto rounded-bl-lg shadow-2xl overflow-hidden">
            {/* Menu background */}
            <div
              className="p-4 space-y-3"
              style={{ backgroundColor: colors.nav.background }}
            >
              {/* Close button X inside the menu at the top */}
              <div className="flex justify-end mb-2">
                <button
                  onClick={closeMenu}
                  className="p-2 rounded-lg transition-colors hover:bg-gray-700"
                  style={{
                    color: colors.text.primary,
                  }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {/* Create Recipe */}
              <Link
                href="/create-recipe"
                onClick={closeMenu}
                className="flex items-center space-x-3 p-3 rounded-lg transition-all hover:bg-gray-700"
                style={{
                  color: colors.text.primary,
                }}
              >
                <div className="flex items-center space-x-2">
                  <ChefHat className="w-5 h-5" />
                  <Utensils className="w-4 h-4" />
                </div>
                <span className="font-medium">Create Recipe</span>
              </Link>

              {/* My Recipe - Highlighted */}
              <Link
                href="/my-recipes"
                onClick={closeMenu}
                className="flex items-center space-x-3 p-3 rounded-lg transition-all"
                style={{
                  backgroundColor: colors.primary.main,
                  color: colors.text.primary,
                }}
              >
                <div className="flex items-center space-x-2">
                  <ChefHat className="w-5 h-5" />
                  <Utensils className="w-4 h-4" />
                </div>
                <span className="font-medium">My Recipe</span>
              </Link>

              {/* Log Out */}
              {user && (
                <button
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg transition-all hover:bg-gray-700"
                  style={{
                    color: colors.text.primary,
                  }}
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Log Out</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
