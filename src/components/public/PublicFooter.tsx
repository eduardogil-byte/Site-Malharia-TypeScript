import { Link } from "react-router";
import { usePublicSiteSettings } from "../../features/site-settings/context/PublicSiteSettingsContext";
import {
  createGeneralWhatsAppUrl,
  createInstagramUrl,
  getInstagramLabel,
} from "../../features/site-settings/utils/publicContactLinks";

export function PublicFooter() {
  const { settings } = usePublicSiteSettings();

  const brandName = settings?.nomeMarca?.trim() || "Minha Marca";

  const whatsappUrl = createGeneralWhatsAppUrl(settings?.whatsapp ?? null);

  const instagramUrl = createInstagramUrl(settings?.instagram ?? null);

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-stone-950 text-stone-300">
      <div className="content-shell grid gap-x-10 gap-y-8 py-12 sm:py-14 md:grid-cols-3 lg:grid-cols-[1.35fr_0.8fr_1fr_1fr] lg:py-16">
        <div className="md:col-span-3 lg:col-span-1">
          {settings?.logoUrl ? (
            <img
              src={settings.logoUrl}
              alt={brandName}
              className="h-16 w-auto max-w-60 object-contain object-left invert mix-blend-screen"
            />
          ) : (
            <p className="font-display text-3xl tracking-[-0.03em] text-white">
              {brandName}
            </p>
          )}

          {settings?.slogan && (
            <p className="mt-4 max-w-sm text-sm leading-6 text-stone-400">
              {settings.slogan}
            </p>
          )}
        </div>

        <div className="border-t border-stone-800 pt-6 md:border-0 md:pt-0">
          <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white">
            Navegação
          </h2>

          <ul className="mt-4 space-y-1 text-sm">
            <li>
              <Link to="/" className="inline-flex min-h-9 items-center text-stone-400 hover:text-white">
                Início
              </Link>
            </li>

            <li>
              <Link to="/catalogo" className="inline-flex min-h-9 items-center text-stone-400 hover:text-white">
                Catálogo
              </Link>
            </li>

            <li>
              <Link to="/sobre" className="inline-flex min-h-9 items-center text-stone-400 hover:text-white">
                Sobre
              </Link>
            </li>

            <li>
              <Link to="/contato" className="inline-flex min-h-9 items-center text-stone-400 hover:text-white">
                Contato
              </Link>
            </li>
          </ul>
        </div>

        <div className="border-t border-stone-800 pt-6 md:border-0 md:pt-0">
          <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white">
            Contato
          </h2>

          <ul className="mt-4 space-y-1 text-sm">
            {whatsappUrl && (
              <li>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-9 items-center text-stone-400 hover:text-white"
                >
                  WhatsApp
                </a>
              </li>
            )}

            {instagramUrl && (
              <li>
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-9 items-center text-stone-400 hover:text-white"
                >
                  {getInstagramLabel(settings?.instagram ?? null)}
                </a>
              </li>
            )}

            {settings?.email && (
              <li>
                <a
                  href={`mailto:${settings.email}`}
                  className="inline-flex min-h-9 max-w-full items-center break-all text-stone-400 hover:text-white"
                >
                  {settings.email}
                </a>
              </li>
            )}
          </ul>
        </div>

        <div className="border-t border-stone-800 pt-6 md:border-0 md:pt-0">
          <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white">
            Localização
          </h2>

          {settings?.endereco ? (
            <p className="mt-4 whitespace-pre-line text-sm leading-6 text-stone-400">
              {settings.endereco}
            </p>
          ) : (
            <p className="mt-4 text-sm leading-6 text-stone-400">
              Consulte nossa localização pelos canais de contato.
            </p>
          )}
        </div>
      </div>

      <div className="border-t border-stone-800">
        <div className="content-shell flex flex-col gap-1.5 py-5 text-[0.7rem] uppercase tracking-[0.08em] text-stone-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {currentYear} {brandName}. Todos os direitos reservados.
          </p>

          <p>Catálogo de produtos.</p>
        </div>
      </div>
    </footer>
  );
}
