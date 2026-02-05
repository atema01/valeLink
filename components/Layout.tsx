import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  hideHeader?: boolean;
  variant?: 'mobile' | 'full';
}

const Layout: React.FC<LayoutProps> = ({ children, className = '', hideHeader = false, variant = 'mobile' }) => {
  // Mobile variant mimics an app interface with a fixed max-width and shadow
  // Full variant allows for traditional responsive web layouts (e.g. landing page)
  const wrapperClasses = variant === 'mobile' 
    ? "max-w-[480px] mx-auto shadow-2xl" 
    : "";

  return (
    <div className={`relative flex min-h-screen w-full flex-col overflow-x-hidden bg-white ${wrapperClasses} ${className}`}>
      {children}
    </div>
  );
};

export default Layout;