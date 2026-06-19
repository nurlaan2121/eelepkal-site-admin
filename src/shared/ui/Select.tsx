import React from "react";
import {cn} from "../utils/cn";
import {fieldVariants} from "@/shared/styles/field";

interface SelectProps extends Omit<
  React.ComponentPropsWithRef<"select">,
  "size"
> {
  label?: string;
  error?: string;
  description?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "danger";
}

export const Select = ({
  className,
  label,
  children,
  error,
  size,
  description,
  variant,
  required,
  ref,
  ...props
}: SelectProps) => {
  const styles = fieldVariants({
    variant: error ? "danger" : variant,
    size,
  });

  return (
    <div className={styles.wrapper()}>
      {label && (
        <label className={styles.label()}>
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <select className={cn(styles.field(),'py-2', className)} {...props}>
          {children}
        </select>
      </div>
      {error && <p className={styles.errorMessage()}>{error}</p>}
      {description && <p className={styles.description()}>{description}</p>}
    </div>
  );
};

Select.displayName = "Input";
