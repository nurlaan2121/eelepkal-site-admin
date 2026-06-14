import {ReactNode} from "react";
import {cn} from "../utils/cn";

export const PageLayout = ({
  className,
  title,
  description,
  actions,
  children,
}: {
  className?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) => {
  return (
    <div className={cn("space-y-6 md:space-y-8 pb-10", className)}>
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-3 px-1 md:px-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="text-gray-500 text-sm md:text-base font-medium">
              {description}
            </p>
          )}
        </div>
        {actions && actions}
      </div>
      {children}
    </div>
  );
};
