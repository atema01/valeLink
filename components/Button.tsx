import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  icon,
  className = '',
  ...props 
}) => {
  const baseStyles = "flex items-center justify-center gap-2 rounded-full font-bold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-primary text-white shadow-xl shadow-primary/40 hover:bg-primary-dark",
    secondary: "bg-white text-primary border-2 border-primary hover:bg-primary/5",
    outline: "bg-transparent border-2 border-primary/20 text-primary hover:border-primary hover:bg-primary/5",
    ghost: "bg-transparent text-primary hover:bg-primary/5"
  };

  const sizes = "h-14 px-6 text-base";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {icon}
      <span className="truncate">{children}</span>
    </button>
  );
};

export default Button;