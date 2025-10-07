'use client';

import { colors } from '@/design-system';
import { useAuthUnified } from '@/hooks';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { BiSolidGrid } from 'react-icons/bi';
import { FiLogOut } from 'react-icons/fi';
import { IoRestaurantOutline } from 'react-icons/io5';
import { MdClose, MdFavorite, MdOutlineMenu } from 'react-icons/md';
import { PiChefHatLight } from 'react-icons/pi';

interface NavProps {
  showMenu?: boolean;
  userName?: string;
  currentPage?: 'create' | 'generated' | 'my-recipes';
}

export default function Nav({
  showMenu = false,
  userName = 'Anna',
  currentPage = 'create',
}: NavProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout } = useAuthUnified();
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
    router.push('/auth/login'); // Redirigir al login después del logout
  };

  const handleNavigation = (page: string) => {
    closeMenu();
    switch (page) {
      case 'create':
        router.push('/create');
        break;
      case 'generated':
        router.push('/recipes');
        break;
      case 'my-recipes':
        router.push('/my-recipes');
        break;
      default:
        break;
    }
  };

  return (
    <nav
      className='w-full px-8 py-4 flex items-center justify-between fixed top-0 left-0 z-50'
      style={{ backgroundColor: colors.interface.background.secondary }}
    >
      {/* Logo - Ahora es clickeable y navega a inicio */}
      <Link href='/' className='flex items-end hover:opacity-80 transition-opacity'>
        {/* Chef Hat Icon - Usando PiChefHatLight */}
        <div className='w-10 h-10 flex items-center justify-center'>
          <PiChefHatLight
            className='text-2xl'
            style={{
              color: colors.brand.primary[500],
              fontSize: '28px',
            }}
          />
        </div>

        {/* Logo Text */}
        <div className='flex items-end space-x-0.5'>
          <span
            className='font-alegreya text-white'
            style={{
              fontSize: '20px',
              fontWeight: 600,
              fontFamily: 'var(--font-alegreya), serif',
            }}
          >
            Chef
          </span>
          <span
            className='font-alegreya'
            style={{
              fontSize: '20px',
              fontWeight: 600,
              color: colors.brand.primary[500],
              fontFamily: 'var(--font-alegreya), serif',
            }}
          >
            at
          </span>
          <span
            className='font-alegreya text-white'
            style={{
              fontSize: '20px',
              fontWeight: 600,
              fontFamily: 'var(--font-alegreya), serif',
            }}
          >
            home
          </span>
        </div>
      </Link>

      {/* Lado derecho: Nombre del usuario y menú */}
      {showMenu && (
        <div className='flex items-center space-x-4'>
          {/* Nombre del usuario */}
          <span
            className='text-white font-medium'
            style={{
              fontSize: '16px',
              color: colors.interface.text.primary,
            }}
          >
            {userName}
          </span>

          {/* Botón del menú */}
          <button
            onClick={toggleMenu}
            className='flex items-center justify-center p-1 hover:bg-gray-700 rounded-lg transition-colors w-9 h-9'
            aria-label='Menu'
            data-testid='user-menu'
          >
            <MdOutlineMenu
              className='text-2xl'
              style={{
                color: colors.interface.text.primary,
                fontSize: '24px',
              }}
            />
          </button>
        </div>
      )}

      {/* Menú desplegable */}
      {isMenuOpen && (
        <div
          className='absolute top-0 right-0 w-64 rounded-b-lg shadow-lg z-50'
          style={{ backgroundColor: colors.interface.background.secondary }}
        >
          {/* Header del menú con botón de cerrar */}
          <div className='flex items-center justify-between px-8 py-4'>
            <div></div>
            <button
              onClick={closeMenu}
              className='p-2 hover:bg-gray-700 rounded transition-colors flex items-center justify-center'
            >
              <MdClose className='text-xl' style={{ color: colors.interface.text.primary }} />
            </button>
          </div>

          {/* Opciones del menú */}
          <div className='py-0'>
            {/* Create Recipe */}
            <button
              onClick={() => handleNavigation('create')}
              className='w-full px-8 py-3 text-left transition-colors flex items-center gap-3'
              style={{
                backgroundColor:
                  currentPage === 'create'
                    ? colors.brand.primary[500]
                    : colors.interface.background.secondary,
                color:
                  currentPage === 'create'
                    ? colors.interface.background.primary
                    : colors.interface.text.primary,
              }}
              onMouseEnter={e => {
                if (currentPage !== 'create') {
                  e.currentTarget.style.backgroundColor = colors.brand.primary[500];
                  e.currentTarget.style.color = colors.interface.background.primary;
                }
              }}
              onMouseLeave={e => {
                if (currentPage !== 'create') {
                  e.currentTarget.style.backgroundColor = colors.interface.background.secondary;
                  e.currentTarget.style.color = colors.interface.text.primary;
                }
              }}
              data-testid='create-recipe-link'
            >
              <IoRestaurantOutline className='text-xl' />
              <span>Create Recipe</span>
            </button>

            {/* Generated Recipes */}
            <button
              onClick={() => handleNavigation('generated')}
              className='w-full px-8 py-3 text-left transition-colors flex items-center gap-3'
              style={{
                backgroundColor:
                  currentPage === 'generated'
                    ? colors.brand.primary[500]
                    : colors.interface.background.secondary,
                color:
                  currentPage === 'generated'
                    ? colors.interface.background.primary
                    : colors.interface.text.primary,
              }}
              onMouseEnter={e => {
                if (currentPage !== 'generated') {
                  e.currentTarget.style.backgroundColor = colors.brand.primary[500];
                  e.currentTarget.style.color = colors.interface.background.primary;
                }
              }}
              onMouseLeave={e => {
                if (currentPage !== 'generated') {
                  e.currentTarget.style.backgroundColor = colors.interface.background.secondary;
                  e.currentTarget.style.color = colors.interface.text.primary;
                }
              }}
            >
              <BiSolidGrid className='text-xl' />
              <span>Generated Recipes</span>
            </button>

            {/* My Recipes */}
            <button
              onClick={() => handleNavigation('my-recipes')}
              className='w-full px-8 py-3 text-left transition-colors flex items-center gap-3'
              style={{
                backgroundColor:
                  currentPage === 'my-recipes'
                    ? colors.brand.primary[500]
                    : colors.interface.background.secondary,
                color:
                  currentPage === 'my-recipes'
                    ? colors.interface.background.primary
                    : colors.interface.text.primary,
              }}
              onMouseEnter={e => {
                if (currentPage !== 'my-recipes') {
                  e.currentTarget.style.backgroundColor = colors.brand.primary[500];
                  e.currentTarget.style.color = colors.interface.background.primary;
                }
              }}
              onMouseLeave={e => {
                if (currentPage !== 'my-recipes') {
                  e.currentTarget.style.backgroundColor = colors.interface.background.secondary;
                  e.currentTarget.style.color = colors.interface.text.primary;
                }
              }}
              data-testid='my-recipes-link'
            >
              <MdFavorite className='text-xl' />
              <span>My Recipes</span>
            </button>

            {/* Log Out */}
            <button
              onClick={handleLogout}
              className='w-full px-8 py-3 text-left transition-colors flex items-center gap-3'
              style={{
                color: colors.interface.text.primary,
                backgroundColor: colors.interface.background.secondary,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = colors.brand.primary[500];
                e.currentTarget.style.color = colors.interface.background.primary;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = colors.interface.background.secondary;
                e.currentTarget.style.color = colors.interface.text.primary;
              }}
              data-testid='logout-button'
            >
              <FiLogOut className='text-xl' />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
