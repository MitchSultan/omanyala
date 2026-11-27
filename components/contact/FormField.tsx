import type { ReactNode } from "react";

export function FormField({
  id,
  label,
  required = false,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="flex min-h-6 items-center gap-2 text-sm font-medium text-[#F5F5F0]"
      >
        {label}
        {required && (
          <span aria-hidden="true" className="text-[#D4FF3F]">
            *
          </span>
        )}
      </label>
      <div className="relative after:pointer-events-none after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-[#D4FF3F] after:transition-[width] after:duration-300 focus-within:after:w-full">
        {children}
      </div>
      {hint && (
        <p id={`${id}-hint`} className="text-xs leading-5 text-white/40">
          {hint}
        </p>
      )}
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-sm leading-5 text-[#FF8B8B]"
        >
          {error}
        </p>
      )}
    </div>
  );
}
