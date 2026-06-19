import {useEffect} from "react";

export const useLockScreen = (
  open: boolean,
  scrollContainerRef?: React.RefObject<HTMLElement>,
) => {
  useEffect(() => {
    if (!open) return;

    const target = scrollContainerRef?.current ?? document.body;
    const original = target.style.overflow;
    target.style.overflow = "hidden";

    return () => {
      target.style.overflow = original;
    };
  }, [open]);
};
