import { Link } from "react-router";
import { PublicHomeSection } from "../../features/home/components/PublicHomeSection";
import { usePublicHome } from "../../features/home/hooks/usePublicHome";
import { usePublicSiteSettings } from "../../features/site-settings/context/PublicSiteSettingsContext";
import { createGeneralWhatsAppUrl } from "../../features/site-settings/utils/publicContactLinks";

export function HomePage() {
  const { sections, isLoading, loadError, reload } = usePublicHome();

  const { settings } = usePublicSiteSettings();

  const brandName = settings?.nomeMarca?.trim() || "Nossa marca";

  const whatsappUrl = createGeneralWhatsAppUrl(
    settings?.whatsapp ?? null,
    `Olá! Gostaria de conhecer os produtos da ${brandName}.`,
  );

  const heroTitle =
    settings?.slogan?.trim() ||
    "Produtos escolhidos com cuidado para tornar cada criação especial.";

  return (
    <main>
      <section
        className={[
          "relative overflow-hidden bg-stone-950 bg-cover bg-center text-white",
          settings?.bannerUrl ? "min-h-[620px]" : "",
        ].join(" ")}
        style={
          settings?.bannerUrl
            ? {
                backgroundImage: `url(${settings.bannerUrl})`,
              }
            : undefined
        }
      >
        <div aria-hidden="true" className="absolute inset-0 bg-stone-950/70" />

        {!settings?.bannerUrl && (
          <div aria-hidden="true" className="absolute inset-0 opacity-20">
            <div className="absolute -left-28 top-10 size-80 rounded-full bg-white blur-3xl" />

            <div className="absolute -right-32 bottom-0 size-96 rounded-full bg-stone-400 blur-3xl" />
          </div>
        )}

        <div className="relative mx-auto flex min-h-[620px] max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-stone-200">
              {brandName}
            </p>

            <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              {heroTitle}
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-200">
              Conheça nossa seleção de malhas, sabonetes, velas, aromatizadores
              e outros produtos artesanais.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/catalogo"
                className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-4 text-sm font-semibold text-stone-950 transition hover:bg-stone-200"
              >
                Ver catálogo
              </Link>

              {whatsappUrl ? (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-xl bg-green-600 px-6 py-4 text-sm font-semibold text-white transition hover:bg-green-700"
                >
                  Falar pelo WhatsApp
                </a>
              ) : (
                <Link
                  to="/contato"
                  className="inline-flex items-center justify-center rounded-xl border border-white/40 px-6 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Entrar em contato
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {isLoading && (
        <section
          aria-live="polite"
          className="mx-auto max-w-7xl px-4 py-20 text-center text-stone-600 sm:px-6 lg:px-8"
        >
          Carregando produtos em destaque...
        </section>
      )}

      {!isLoading && loadError && (
        <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8">
            <p className="text-sm text-red-800">{loadError}</p>

            <button
              type="button"
              onClick={() => void reload()}
              className="mt-5 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-800 hover:bg-red-100"
            >
              Tentar novamente
            </button>
          </div>
        </section>
      )}

      {!isLoading &&
        !loadError &&
        sections.map((section, index) => (
          <PublicHomeSection
            key={section.id}
            section={section}
            mutedBackground={index % 2 !== 0}
          />
        ))}

      {!isLoading && !loadError && sections.length === 0 && (
        <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold text-stone-950">
            Nosso catálogo está sendo preparado
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-stone-600">
            Em breve novos produtos estarão disponíveis nesta página.
          </p>

          <Link
            to="/catalogo"
            className="mt-7 inline-flex rounded-xl bg-stone-900 px-6 py-4 text-sm font-semibold text-white hover:bg-stone-700"
          >
            Acessar catálogo
          </Link>
        </section>
      )}

      <section className="bg-stone-900 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-300">
              Encontrou algo especial?
            </p>

            <h2 className="mt-3 text-3xl font-semibold">
              Consulte disponibilidade e detalhes dos produtos.
            </h2>

            <p className="mt-4 leading-7 text-stone-300">
              Entre em contato para tirar dúvidas sobre tecidos, medidas,
              aromas, materiais e opções disponíveis.
            </p>
          </div>

          {whatsappUrl ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex shrink-0 rounded-xl bg-green-600 px-6 py-4 text-sm font-semibold text-white hover:bg-green-700"
            >
              Falar pelo WhatsApp
            </a>
          ) : (
            <Link
              to="/contato"
              className="inline-flex shrink-0 rounded-xl bg-white px-6 py-4 text-sm font-semibold text-stone-950 hover:bg-stone-200"
            >
              Entrar em contato
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}
