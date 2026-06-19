import React, {ReactNode} from "react";
import {cn} from "../../utils/cn";
import {fieldVariants} from "@/shared/styles/field";

interface InputProps extends Omit<
  React.ComponentPropsWithRef<"input">,
  "size"
> {
  icon?: ReactNode;
  labelIcon?: ReactNode;
  label?: string;
  error?: string;
  description?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "danger";
}

export const Input = ({
  className,
  label,
  icon,
  labelIcon,
  name,
  error,
  size,
  description,
  variant,
  required,
  ref,
  ...props
}: InputProps) => {
  const styles = fieldVariants({
    variant: error ? "danger" : variant,
    size,
    isIcon: !!icon,
  });

  return (
    <div className={styles.wrapper()}>
      {label && (
        <label htmlFor={name} className={styles.label()}>
          {labelIcon && labelIcon}
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
        <input id={name} ref={ref} className={cn(styles.field(), className)} {...props} />
      </div>
      {error && <p className={styles.errorMessage()}>{error}</p>}
      {description && <p className={styles.description()}>{description}</p>}
    </div>
  );
};

Input.displayName = "Input";
