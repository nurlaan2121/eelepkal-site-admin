import {createPortal} from "react-dom";
import { useOptimizedPortal } from "./useOptimizedPortal";

type PortalProps = {
  children: React.ReactNode;
};

export const Portal = ({children}: PortalProps) => {
  const portalEl = useOptimizedPortal();

  if (!portalEl) return null;

  return createPortal(children, portalEl);
};
