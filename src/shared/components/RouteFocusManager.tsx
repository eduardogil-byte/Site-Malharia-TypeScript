import { useEffect } from "react";
import { useLocation } from "react-router";

export function RouteFocusManager() {
  const location = useLocation();

  useEffect(() => {
    const mainElement =
      document.getElementById(
        "main-content",
      );

    if (!mainElement) {
      return;
    }

    mainElement.focus({
      preventScroll: true,
    });

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [location.pathname]);

  return null;
}