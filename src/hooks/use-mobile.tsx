import * as React from "react";

import { APP_CONFIG } from "@/config/app.config";

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const breakpoint = APP_CONFIG.ui.mobileBreakpointPx;
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const onChange = (): void => {
      setIsMobile(window.innerWidth < breakpoint);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < breakpoint);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
