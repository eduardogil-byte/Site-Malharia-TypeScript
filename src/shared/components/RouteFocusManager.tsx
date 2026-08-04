import { useEffect } from "react";
import { useLocation } from "react-router";

type RouteFocusManagerProps = {
  targetId?: string;
};

export function RouteFocusManager({
  targetId = "main-content",
}: RouteFocusManagerProps) {
  const location = useLocation();

  useEffect(() => {
    const animationFrameId = window.requestAnimationFrame(() => {
      const targetElement = document.getElementById(targetId);

      if (!targetElement) {
        return;
      }

      targetElement.focus({
        preventScroll: true,
      });

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      });
    });

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [location.pathname, targetId]);

  return null;
}
