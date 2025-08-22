// src/components/ui/Button.jsx
import React from 'react';

const VARIANTS = {
  primary: "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl focus:ring-blue-500",
  secondary: "bg-white border-2 border-slate-300 hover:border-slate-400 text-slate-700 hover:bg-slate-50 shadow-sm hover:shadow-md focus:ring-slate-500",
  danger: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl focus:ring-red-500",
  success: "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl focus:ring-green-500",
  basic: "bg-slate-800 hover:bg-slate-900 text-white shadow-md focus:ring-slate-800"
};

const SIZES = {
  sm: "px-3 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg"
};

const SPINNER_COLORS = {
  primary: "text-white",
  secondary: "text-slate-700",
  danger: "text-white",
  success: "text-white",
  basic: "text-white"
};

const Button = ({
  children,
  text, // can still use `text` for convenience
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  onClick,
  className = '',
  disabled = false,
  loading = false,
  type = "button",
  fullWidth = false,
  "aria-label": ariaLabel,
  ...props
}) => {
  const classes = `
    font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.04] active:scale-95
    focus:outline-none focus:ring-4 focus:ring-opacity-50 flex items-center justify-center gap-2
    ${VARIANTS[variant] || VARIANTS.primary}
    ${SIZES[size] || SIZES.md}
    ${disabled || loading ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={classes}
      onClick={onClick}
      aria-busy={loading ? true : undefined}
      aria-disabled={disabled || loading ? true : undefined}
      aria-label={ariaLabel}
      {...props}
    >
      {loading && (
        <svg className={`animate-spin h-5 w-5 mr-2 ${SPINNER_COLORS[variant]}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-30" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      )}
      {icon && <span className="text-lg">{icon}</span>}
      {children || text} 
      {iconRight && <span className="text-lg">{iconRight}</span>}
    </button>
  );
};

export default Button;
