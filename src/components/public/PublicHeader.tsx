import {
  useEffect,
  useState,
} from "react";
import {
  Link,
  NavLink,
  useLocation,
} from "react-router";
import { usePublicSiteSettings } from "../../features/site-settings/context/PublicSiteSettingsContext";
import { createGeneralWhatsAppUrl } from "../../features/site-settings/utils/publicContactLinks";

const navigationItems = [
  {
    label: "Início",
    to: "/",
    end: true,
  },
  {
    label: "Catálogo",
    to: "/catalogo",
    end: false,
  },
  {
    label: "Sobre",
    to: "/sobre",
    end: false,
  },
  {
    label: "Contato",
    to: "/contato",
    end: false,
  },
];

export function PublicHeader() {
  const { settings } =
    usePublicSiteSettings();

  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] =
    useState(false);

  const brandName =
    settings?.nomeMarca?.trim() ||
    "Minha Marca";

  const whatsappUrl =
    createGeneralWhatsAppUrl(
      settings?.whatsapp ?? null,
      `Olá! Gostaria de conhecer os produtos da ${brandName}.`,
    );

  function closeMenu() {
    setIsMenuOpen(false);
  }

  /*
   * Fecha o menu automaticamente quando o usuário
   * navega para outra página.
   */
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  /*
   * Permite fechar o menu usando a tecla Escape.
   */
  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          onClick={closeMenu}
          aria-label={`${brandName} — página inicial`}
          className="flex min-w-0 items-center gap-3 rounded-lg"
        >
          {settings?.logoUrl ? (
            <img
              src={settings.logoUrl}
              alt=""
              className="h-11 w-auto max-w-40 object-contain sm:h-12 sm:max-w-48"
            />
          ) : (
            <span className="truncate text-lg font-semibold text-stone-950 sm:text-xl">
              {brandName}
            </span>
          )}
        </Link>

        <nav
          aria-label="Navegação principal"
          className="hidden items-center gap-6 md:flex lg:gap-8"
        >
          {navigationItems.map(
            (item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({
                  isActive,
                }) =>
                  [
                    "rounded-md px-1 py-2 text-sm font-medium transition",
                    isActive
                      ? "text-stone-950 underline decoration-2 underline-offset-8"
                      : "text-stone-600 hover:text-stone-950",
                  ].join(" ")
                }
              >
                {item.label}
              </NavLink>
            ),
          )}
        </nav>

        <div className="hidden md:block">
          {whatsappUrl ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700 lg:px-5"
            >
              Falar pelo WhatsApp
            </a>
          ) : (
            <Link
              to="/contato"
              className="inline-flex rounded-xl bg-stone-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-stone-700 lg:px-5"
            >
              Entrar em contato
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={() =>
            setIsMenuOpen(
              (currentValue) =>
                !currentValue,
            )
          }
          aria-expanded={isMenuOpen}
          aria-controls="public-mobile-menu"
          aria-label={
            isMenuOpen
              ? "Fechar menu principal"
              : "Abrir menu principal"
          }
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-stone-300 px-3 py-2 text-sm font-medium text-stone-800 transition hover:bg-stone-100 md:hidden"
        >
          {isMenuOpen
            ? "Fechar"
            : "Menu"}
        </button>
      </div>

      {isMenuOpen && (
        <div
          id="public-mobile-menu"
          className="border-t border-stone-200 bg-white px-4 py-5 shadow-lg md:hidden"
        >
          <nav
            aria-label="Navegação para dispositivos móveis"
            className="mx-auto flex max-w-7xl flex-col gap-2"
          >
            {navigationItems.map(
              (item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={closeMenu}
                  className={({
                    isActive,
                  }) =>
                    [
                      "rounded-lg px-4 py-3 text-base font-medium transition",
                      isActive
                        ? "bg-stone-100 text-stone-950"
                        : "text-stone-700 hover:bg-stone-50",
                    ].join(" ")
                  }
                >
                  {item.label}
                </NavLink>
              ),
            )}

            {whatsappUrl ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                onClick={closeMenu}
                className="mt-3 rounded-lg bg-green-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-green-700"
              >
                Falar pelo WhatsApp
              </a>
            ) : (
              <Link
                to="/contato"
                onClick={closeMenu}
                className="mt-3 rounded-lg bg-stone-900 px-4 py-3 text-center text-sm font-semibold text-white"
              >
                Entrar em contato
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}