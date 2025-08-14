import React from 'react';

interface InputProps {
  label?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onIconClick?: () => void;
  className?: string;
  id?: string;
  name?: string;
  autoComplete?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  onBlur,
  onFocus,
  error,
  disabled = false,
  required = false,
  fullWidth = true,
  leftIcon,
  rightIcon,
  onIconClick,
  className = '',
  id,
  name,
  autoComplete,
}) => {
  const inputId = id || name || `input-${Math.random().toString(36).substr(2, 9)}`;

  const baseClasses = `
    w-full px-3 py-2 border rounded-lg transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-accent-rose focus:border-transparent
    disabled:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50
    ${error ? 'border-accent-rose focus:ring-accent-rose' : 'border-accent-mauve'}
    ${leftIcon ? 'pl-10' : ''}
    ${rightIcon ? 'pr-10' : ''}
  `;

  const containerClasses = `${fullWidth ? 'w-full' : ''} ${className}`;

  return (
    <div className={containerClasses}>
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-sm font-medium text-accent-dark mb-1"
        >
          {label}
          {required && <span className="text-accent-rose ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">{leftIcon}</span>
          </div>
        )}
        
        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onBlur={onBlur}
          onFocus={onFocus}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          className={baseClasses}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {onIconClick ? (
              <button
                type="button"
                onClick={onIconClick}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent-rose focus:ring-offset-1 rounded"
              >
                {rightIcon}
              </button>
            ) : (
              <span className="text-gray-400">{rightIcon}</span>
            )}
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-accent-rose">{error}</p>
      )}
    </div>
  );
};

export default Input;