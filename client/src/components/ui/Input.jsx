// src/components/ui/Input.jsx
import React, { forwardRef } from "react";

const Input = forwardRef(
  (
    {
      label,
      id,
      icon: Icon,
      error,
      className = "",
      type = "text",
      ...props
    }, ref
  ) => {
    const inputId = id || props.name || undefined;
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <Icon className="w-5 h-5" />
            </span>
          )}
          <input
            id={inputId}
            type={type}
            ref={ref}
            autoComplete="off"
            spellCheck="false"
            className={`
              w-full rounded-lg border 
              ${error ? "border-red-400" : "border-slate-300"}
              bg-white/60 text-slate-900 px-4 py-3
              ${Icon ? "pl-11" : ""}
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
              transition placeholder-slate-500 dark:bg-zinc-800 dark:text-white dark:border-zinc-600 ${className}
            `}
            aria-invalid={error ? "true" : undefined}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
