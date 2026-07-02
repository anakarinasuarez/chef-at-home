import plateImage from '@/assets/images/plate.png';
import MainLayout from '@/components/layouts/MainLayout';
import Image from 'next/image';

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
      {/* Headline — centered on mobile, left-aligned in the desktop split */}
      <h1 className='mb-md text-center text-[28px] font-bold leading-tight text-fg lg:mb-4 lg:text-left lg:text-4xl'>
        {title}
      </h1>
      {subtitle && (
        <p className='mb-xl text-center text-lg text-muted lg:text-left'>
          {subtitle}
        </p>
      )}

      {/* Mobile illustration banner (desktop shows it in the side column) */}
      <div className='mb-xl flex justify-center lg:hidden'>
        <Image
          src={plateImage}
          alt='Gourmet dish'
          className='h-auto w-56'
          priority
        />
      </div>

      {/* Form */}
      {children}
    </MainLayout>
  );
}
