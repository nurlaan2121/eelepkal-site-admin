import React from "react";
import {tv} from "tailwind-variants";
import {cn} from "../../utils/cn";

const buttonVariants = tv({
  base: "inline-flex items-center justify-center rounded-xl font-bold  active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
  variants: {
    variant: {
      primary: "bg-brand-primary text-white shadow-lg shadow-brand-100 hover:bg-brand-800",
      secondary: 'bg-orange-100 text-orange-600 hover:bg-orange-200',
      gradient: 'bg-gradient-to-r from-brand-700 to-brand-900 hover:from-brand-600 hover:to-brand-800 text-white font-black shadow-xl shadow-brand-900/30 border-2 border-brand-600',
      outline:
        "border border-slate-200 bg-transparent hover:bg-slate-50 text-slate-700",
      ghost: "bg-transparent hover:bg-slate-100 text-slate-600 border border-slate-200",
      danger: "bg-red-500 text-white hover:bg-red-600",
    },
    size: {
      sm: "h-10 px-3 text-xs",
      md: "h-12 px-4",
      lg: "h-14 px-6",
    },
    fullWidth: {
      true: "w-full",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "danger" | "gradient" | "secondary";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {className, variant, size, isLoading, fullWidth, children, ...props},
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({variant, size, fullWidth}), className)}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
