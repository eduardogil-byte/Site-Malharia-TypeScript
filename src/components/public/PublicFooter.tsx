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
      <div className="mx-auto grid max-w-7xl gap-x-12 gap-y-12 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_1fr_1fr] lg:px-8 lg:py-20">
        <div className="md:col-span-2 lg:col-span-1">
          {settings?.logoUrl ? (
            <img
              src={settings.logoUrl}
              alt={brandName}
              className="h-14 w-auto max-w-52 object-contain brightness-0 invert"
            />
          ) : (
            <p className="font-display text-3xl tracking-[-0.03em] text-white">
              {brandName}
            </p>
          )}

          {settings?.slogan && (
            <p className="mt-5 max-w-sm text-sm leading-7 text-stone-400">
              {settings.slogan}
            </p>
          )}
        </div>

        <div>
          <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white">
            Navegação
          </h2>

          <ul className="mt-6 space-y-3 text-sm">
            <li>
              <Link to="/" className="hover:text-white">
                Início
              </Link>
            </li>

            <li>
              <Link to="/catalogo" className="hover:text-white">
                Catálogo
              </Link>
            </li>

            <li>
              <Link to="/sobre" className="hover:text-white">
                Sobre
              </Link>
            </li>

            <li>
              <Link to="/contato" className="hover:text-white">
                Contato
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white">
            Contato
          </h2>

          <ul className="mt-6 space-y-3 text-sm">
            {whatsappUrl && (
              <li>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white"
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
                  className="hover:text-white"
                >
                  {getInstagramLabel(settings?.instagram ?? null)}
                </a>
              </li>
            )}

            {settings?.email && (
              <li>
                <a
                  href={`mailto:${settings.email}`}
                  className="break-all hover:text-white"
                >
                  {settings.email}
                </a>
              </li>
            )}
          </ul>
        </div>

        <div>
          <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white">
            Localização
          </h2>

          {settings?.endereco ? (
            <p className="mt-6 whitespace-pre-line text-sm leading-7 text-stone-400">
              {settings.endereco}
            </p>
          ) : (
            <p className="mt-6 text-sm leading-7 text-stone-400">
              Consulte nossa localização pelos canais de contato.
            </p>
          )}
        </div>
      </div>

      <div className="border-t border-stone-800">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-7 text-[0.7rem] uppercase tracking-[0.08em] text-stone-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>
            © {currentYear} {brandName}. Todos os direitos reservados.
          </p>

          <p>Catálogo de produtos.</p>
        </div>
      </div>
    </footer>
  );
}
