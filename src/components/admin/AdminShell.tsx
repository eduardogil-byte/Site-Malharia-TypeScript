import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLocation } from "react-router";
import { RouteFocusManager } from "../../shared/components/RouteFocusManager";
import { SkipLink } from "../../shared/components/SkipLink";
import { AdminNavigation } from "./AdminNavigation";

type AdminShellProps = {
  children: ReactNode;
  onLogout?: () => void | Promise<void>;
};

export function AdminShell({ children, onLogout }: AdminShellProps) {
  const location = useLocation();

  const menuButtonRef = useRef<HTMLButtonElement | null>(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  async function handleLogout() {
    if (!onLogout || isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      await onLogout();
    } finally {
      setIsLoggingOut(false);
    }
  }

  /*
   * Fecha o menu após navegar para outra página.
   */
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  /*
   * Fecha pelo Escape e devolve o foco
   * para o botão que abriu a navegação.
   */
  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") {
        return;
      }

      setIsMenuOpen(false);

      window.requestAnimationFrame(() => {
        menuButtonRef.current?.focus();
      });
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  return (
    <div className="admin-surface min-h-screen bg-stone-50 text-stone-950">
      <SkipLink
        targetId="admin-main-content"
        label="Pular para o conteúdo administrativo"
      />

      <RouteFocusManager targetId="admin-main-content" />

      <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/95 backdrop-blur-xl lg:hidden">
        <div className="flex min-h-[4.75rem] items-center justify-between gap-4 px-4 sm:px-6">
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
              Administração
            </p>

            <p className="truncate text-lg font-semibold text-stone-950">
              Painel da loja
            </p>
          </div>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setIsMenuOpen((currentValue) => !currentValue)}
            aria-expanded={isMenuOpen}
            aria-controls="admin-mobile-navigation"
            aria-label={
              isMenuOpen
                ? "Fechar navegação administrativa"
                : "Abrir navegação administrativa"
            }
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-stone-300 px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-stone-800 hover:border-stone-900 hover:bg-stone-50"
          >
            {isMenuOpen ? "Fechar" : "Menu"}
          </button>
        </div>

        {isMenuOpen && (
          <div
            id="admin-mobile-navigation"
            className="max-h-[calc(100dvh-4.75rem)] overflow-y-auto border-t border-stone-200 bg-white px-4 py-5 shadow-float sm:px-6"
          >
            <AdminNavigation
              onNavigate={closeMenu}
              onLogout={handleLogout}
              isLoggingOut={isLoggingOut}
            />
          </div>
        )}
      </header>

      <div className="mx-auto min-h-screen max-w-[1600px] lg:flex">
        <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r border-stone-200 bg-white p-7 lg:flex">
          <div className="mb-10 border-b border-stone-200 pb-7">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
              Administração
            </p>

            <p className="mt-2 text-2xl font-semibold tracking-[-0.025em] text-stone-950">
              Painel da loja
            </p>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <AdminNavigation
              onLogout={handleLogout}
              isLoggingOut={isLoggingOut}
            />
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <main
            id="admin-main-content"
            tabIndex={-1}
            className="min-w-0 px-4 py-7 outline-none sm:px-6 sm:py-9 lg:px-10 lg:py-10 xl:px-12"
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
