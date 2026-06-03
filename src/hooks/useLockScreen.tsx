import {useEffect} from "react";

export const useLockScreen = (open: boolean) => {
  useEffect(() => {
    if (!open) return;
    const original = {
      overflow: document.body.style.overflow,
    };

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = original.overflow;
    };
  }, [open]);
};
