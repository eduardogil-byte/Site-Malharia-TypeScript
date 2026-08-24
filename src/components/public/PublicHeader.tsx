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
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-white/95 backdrop-blur-xl">
      <div className="content-shell flex min-h-[4.75rem] items-center justify-between gap-4 sm:min-h-20 md:grid md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:gap-6">
        <Link
          to="/"
          onClick={closeMenu}
          aria-label={`${brandName} — página inicial`}
          className="flex min-w-0 items-center rounded-sm md:justify-self-start"
        >
          {settings?.logoUrl ? (
            <img
              src={settings.logoUrl}
              alt=""
              className="h-11 w-auto max-w-44 object-contain sm:h-12 sm:max-w-52 md:h-14 md:max-w-full lg:max-w-56"
            />
          ) : (
            <span className="truncate font-display text-2xl tracking-[-0.03em] text-stone-950 sm:text-[1.75rem]">
              {brandName}
            </span>
          )}
        </Link>

        <nav
          aria-label="Navegação principal"
          className="hidden items-center gap-5 md:flex lg:gap-8"
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
                    "relative px-1 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.13em] transition-colors after:absolute after:inset-x-1 after:bottom-0 after:h-px after:origin-center after:bg-stone-950 after:transition-transform after:duration-200",
                    isActive
                      ? "text-stone-950 after:scale-x-100"
                      : "text-stone-500 after:scale-x-0 hover:text-stone-900 hover:after:scale-x-100",
                  ].join(" ")
                }
              >
                {item.label}
              </NavLink>
            ),
          )}
        </nav>

        <div className="hidden justify-self-end md:block">
          {whatsappUrl ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="button-primary min-h-10 whitespace-nowrap px-4 py-2 text-xs shadow-none lg:px-5"
            >
              Falar pelo WhatsApp
            </a>
          ) : (
            <Link
              to="/contato"
              className="button-primary min-h-10 whitespace-nowrap px-4 py-2 text-xs shadow-none lg:px-5"
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
          className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-md border border-stone-300 px-3 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-stone-800 hover:border-stone-700 hover:bg-stone-50 md:hidden"
        >
          {isMenuOpen
            ? "Fechar"
            : "Menu"}
        </button>
      </div>

      {isMenuOpen && (
        <div
          id="public-mobile-menu"
          className="border-t border-stone-200 bg-white py-5 shadow-float md:hidden"
        >
          <nav
            aria-label="Navegação para dispositivos móveis"
            className="content-shell flex flex-col gap-1"
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
                      "rounded-md px-3 py-3 text-sm font-medium tracking-[0.02em] transition-colors",
                      isActive
                        ? "bg-stone-100 text-stone-950"
                        : "text-stone-600 hover:bg-stone-50 hover:text-stone-950",
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
                className="button-primary mt-4 w-full"
              >
                Falar pelo WhatsApp
              </a>
            ) : (
              <Link
                to="/contato"
                onClick={closeMenu}
                className="button-primary mt-4 w-full"
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
