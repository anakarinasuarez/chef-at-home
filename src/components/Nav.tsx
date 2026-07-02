'use client';

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

const cn = (...parts: Array<string | false | undefined>) =>
  parts.filter(Boolean).join(' ');

// Menu row: active gets the solid brand fill, others reveal it on hover.
const itemClass = (active: boolean) =>
  cn(
    'w-full px-8 py-3 text-left transition-colors flex items-center gap-3',
    active
      ? 'bg-primary text-on-primary'
      : 'text-fg hover:bg-primary-hover hover:text-on-primary',
  );

export default function Nav({
  showMenu = false,
  userName = '',
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
    <nav className='w-full px-8 py-4 flex items-center justify-between fixed top-0 left-0 z-50 bg-surface border-b border-border backdrop-blur'>
      {/* Logo - Ahora es clickeable y navega a inicio */}
      <Link href='/' className='flex items-end hover:opacity-80 transition-opacity'>
        {/* Chef Hat Icon - Usando PiChefHatLight */}
        <div className='w-10 h-10 flex items-center justify-center'>
          <PiChefHatLight className='text-primary text-[28px]' />
        </div>

        {/* Logo Text */}
        <div className='flex items-end space-x-0.5 font-logo font-semibold text-[20px]'>
          <span className='text-fg'>Chef</span>
          <span className='text-primary'>at</span>
          <span className='text-fg'>home</span>
        </div>
      </Link>

      {/* Lado derecho: Nombre del usuario y menú */}
      {showMenu && (
        <div className='flex items-center space-x-4'>
          {/* Nombre del usuario */}
          <span className='text-fg font-medium text-base'>{userName}</span>

          {/* Botón del menú */}
          <button
            onClick={toggleMenu}
            className='flex items-center justify-center p-1 rounded-sm transition-colors w-9 h-9 text-fg hover:bg-elevated'
            aria-label='Menu'
            data-testid='user-menu'
          >
            <MdOutlineMenu className='text-2xl' />
          </button>
        </div>
      )}

      {/* Menú desplegable */}
      {isMenuOpen && (
        <div className='fixed inset-x-0 bottom-0 z-50 w-full rounded-t-lg border border-border bg-surface shadow-lg lg:absolute lg:inset-x-auto lg:bottom-auto lg:top-0 lg:right-0 lg:w-64 lg:rounded-t-none lg:rounded-b-lg'>
          {/* Header del menú con botón de cerrar */}
          <div className='flex items-center justify-between px-8 py-4'>
            <div></div>
            <button
              onClick={closeMenu}
              className='p-2 rounded-sm transition-colors flex items-center justify-center text-fg hover:bg-elevated'
              aria-label='Close menu'
            >
              <MdClose className='text-xl' />
            </button>
          </div>

          {/* Opciones del menú */}
          <div className='py-0'>
            {/* Create Recipe */}
            <button
              onClick={() => handleNavigation('create')}
              className={itemClass(currentPage === 'create')}
              data-testid='create-recipe-link'
            >
              <IoRestaurantOutline className='text-xl' />
              <span>Create Recipe</span>
            </button>

            {/* Generated Recipes */}
            <button
              onClick={() => handleNavigation('generated')}
              className={itemClass(currentPage === 'generated')}
            >
              <BiSolidGrid className='text-xl' />
              <span>Generated Recipes</span>
            </button>

            {/* My Recipes */}
            <button
              onClick={() => handleNavigation('my-recipes')}
              className={itemClass(currentPage === 'my-recipes')}
              data-testid='my-recipes-link'
            >
              <MdFavorite className='text-xl' />
              <span>My Recipes</span>
            </button>

            {/* Log Out */}
            <button
              onClick={handleLogout}
              className={itemClass(false)}
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
