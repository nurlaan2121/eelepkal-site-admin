import {tv} from "tailwind-variants";

export const fieldVariants = tv({
  slots: {
    wrapper: "w-full space-y-1.5",
    label:
      "text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-2 mb-2",
    field:
      "flex w-full rounded-xl px-3 py-4 text-sm placeholder:font-medium disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
    errorMessage: "text-xs font-medium text-red-500",
    description: "text-xs text-slate-400 mt-1",
  },
  variants: {
    size: {
      sm: {
        field: "h-11",
      },
      md: {
        field: "h-12",
      },
      lg: {
        field: "h-14",
      },
    },
    variant: {
      default: {
        field:
          "border bg-white border-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/20 focus-visible:border-brand-300",
      },
      outline: {
        field:
          "border-2 border-slate-50 bg-slate-50 focus-visible:outline-none focus-visible:border-slate-300",
      },
      danger: {
        field: "border border-red-500 focus-visible:ring-red-500",
      },
    },
    isIcon: {
      true: {
        field: "pl-10",
      },
      false: {
        field: "",
      },
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
    isIcon: false,
  },
});
