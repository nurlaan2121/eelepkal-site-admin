import { useEffect, useState } from "react";

export const useOptimizedPortal = () => {
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalEl(document.getElementById("portal-root"));
  }, []);

  return portalEl;
};
