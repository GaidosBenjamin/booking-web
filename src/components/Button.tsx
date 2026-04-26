import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  loading?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children: ReactNode;
}

export default function Button({
  variant = 'primary',
  loading = false,
  icon,
  iconPosition = 'right',
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center gap-2 font-headline font-bold text-base rounded-xl min-h-[48px] px-6 transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100';

  const variantClasses = {
    primary:
      'bg-primary text-on-primary shadow-[0_0_16px_rgba(0,58,99,0.25)] hover:bg-primary-container hover:text-on-primary-container',
    secondary:
      'bg-secondary-container/40 backdrop-blur-sm text-on-secondary-container hover:bg-secondary-container/60',
    ghost:
      'bg-transparent text-primary hover:bg-surface-container-low',
    danger:
      'bg-error text-on-error hover:bg-error/90',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <span className="material-symbols-outlined text-xl">{icon}</span>
          )}
          {children}
          {icon && iconPosition === 'right' && (
            <span className="material-symbols-outlined text-xl">{icon}</span>
          )}
        </>
      )}
    </button>
  );
}
