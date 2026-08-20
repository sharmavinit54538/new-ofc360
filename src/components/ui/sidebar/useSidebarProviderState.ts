import * as React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export function useSidebarProviderState(defaultOpen: boolean, openProp?: boolean, setOpenProp?: (open: boolean) => void) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);
  const [_open, _setOpen] = React.useState(defaultOpen);
  const open = openProp ?? _open;
  const setOpen = React.useCallback((value: boolean | ((v: boolean) => boolean)) => {
    const openState = typeof value === "function" ? value(open) : value;
    if (setOpenProp) setOpenProp(openState); else _setOpen(openState);
  }, [setOpenProp, open]);
  const toggleSidebar = React.useCallback(() => isMobile ? setOpenMobile((o) => !o) : setOpen((o) => !o), [isMobile, setOpen, setOpenMobile]);
  return { state: (open ? "expanded" : "collapsed") as "expanded" | "collapsed", open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar };
}
