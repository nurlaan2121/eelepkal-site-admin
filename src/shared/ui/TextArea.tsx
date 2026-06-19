import React, {ReactNode} from "react";
import {cn} from "../utils/cn";
import {fieldVariants} from "../styles/field";

interface TextAreaProps extends Omit<
  React.ComponentPropsWithRef<"textarea">,
  "size"
> {
  icon?: ReactNode;
  label?: string;
  error?: string;
  description?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "danger";
}

export const TextArea = ({
  className,
  label,
  icon,
  error,
  size,
  name,
  description,
  variant,
  required,
  ref,
  ...props
}: TextAreaProps) => {
  const styles = fieldVariants({
    variant: error ? "danger" : variant,
    size,
  });

  return (
    <div className={styles.wrapper()}>
      {label && (
        <label className={styles.label()} htmlFor={name}>
          {icon && icon}
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <textarea
          ref={ref}
          id={name}
          className={cn(styles.field(), className)}
          {...props}
        />
      </div>
      {error && <p className={styles.errorMessage()}>{error}</p>}
      {description && <p className={styles.description()}>{description}</p>}
    </div>
  );
};
TextArea.displayName = "Input";
