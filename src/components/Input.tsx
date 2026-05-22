import { forwardRef, useState, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: string;
  showPasswordToggle?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, showPasswordToggle, type, className = '', id, required, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
    const isPassword = type === 'password';
    const effectiveType = isPassword && showPassword ? 'text' : type;

    return (
      <div className="space-y-2">
        <label
          htmlFor={inputId}
          className="block font-label text-sm font-semibold text-on-surface-variant ml-1"
        >
          {label}{required && <span className="text-error ml-1">*</span>}
        </label>
        <div className="relative group">
          {icon && (
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline/60 text-xl">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            type={effectiveType}
            className={`
              w-full h-14 bg-surface-container-highest border-0 rounded-xl
              focus:ring-2 focus:ring-primary/20 transition-all
              placeholder:text-outline-variant text-on-surface font-body
              ${icon ? 'pl-12 pr-5' : 'px-5'}
              ${isPassword && showPasswordToggle ? 'pr-12' : ''}
              ${error ? 'ring-2 ring-error/30' : ''}
              ${className}
            `}
            required={required}
            {...props}
          />
          {isPassword && showPasswordToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-outline hover:text-on-surface-variant transition-colors"
              aria-label="Toggle password visibility"
            >
              <span className="material-symbols-outlined text-xl">
                {showPassword ? 'visibility' : 'visibility_off'}
              </span>
            </button>
          )}
        </div>
        {error && (
          <p className="text-error text-xs font-medium ml-1">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
