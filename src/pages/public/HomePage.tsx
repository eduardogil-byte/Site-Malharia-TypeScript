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
          "relative isolate overflow-hidden bg-stone-950 bg-cover bg-center text-white",
          settings?.bannerUrl ? "min-h-[min(760px,calc(100svh-5.5rem))]" : "",
        ].join(" ")}
        style={
          settings?.bannerUrl
            ? {
                backgroundImage: `url(${settings.bannerUrl})`,
              }
            : undefined
        }
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-stone-950/85 via-stone-950/52 to-stone-950/10"
        />

        {!settings?.bannerUrl && (
          <div aria-hidden="true" className="absolute inset-0 opacity-15">
            <div className="absolute -left-28 top-10 size-80 rounded-full bg-white blur-3xl" />

            <div className="absolute -right-32 bottom-0 size-96 rounded-full bg-stone-400 blur-3xl" />
          </div>
        )}

        <div className="relative mx-auto flex min-h-[min(680px,calc(100svh-5.5rem))] max-w-7xl items-center px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-200">
              {brandName}
            </p>

            <h1 className="mt-5 text-5xl leading-[0.98] sm:text-6xl lg:text-7xl xl:text-[5rem]">
              {heroTitle}
            </h1>

            <p className="mt-7 max-w-xl text-base leading-7 text-stone-200 sm:text-lg sm:leading-8">
              Conheça nossa seleção de malhas, sabonetes, velas, aromatizadores
              e outros produtos artesanais.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/catalogo"
                className="inline-flex min-h-12 items-center justify-center rounded-md bg-white px-7 py-3 text-sm font-semibold tracking-[0.02em] text-stone-950 hover:bg-stone-100"
              >
                Ver catálogo
              </Link>

              {whatsappUrl ? (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-12 items-center justify-center rounded-md border border-white/60 px-7 py-3 text-sm font-semibold tracking-[0.02em] text-white hover:border-white hover:bg-white/10"
                >
                  Falar pelo WhatsApp
                </a>
              ) : (
                <Link
                  to="/contato"
                  className="inline-flex min-h-12 items-center justify-center rounded-md border border-white/60 px-7 py-3 text-sm font-semibold tracking-[0.02em] text-white hover:border-white hover:bg-white/10"
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
          className="mx-auto max-w-7xl px-4 py-24 text-center text-stone-600 sm:px-6 lg:px-8"
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
          <h2 className="text-4xl text-stone-950">
            Nosso catálogo está sendo preparado
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-stone-600">
            Em breve novos produtos estarão disponíveis nesta página.
          </p>

          <Link to="/catalogo" className="button-primary mt-8">
            Acessar catálogo
          </Link>
        </section>
      )}

      <section className="bg-stone-950 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-10 px-4 py-20 sm:px-6 lg:flex-row lg:items-center lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">
              Encontrou algo especial?
            </p>

            <h2 className="mt-4 text-4xl leading-tight sm:text-5xl">
              Consulte disponibilidade e detalhes dos produtos.
            </h2>

            <p className="mt-5 max-w-xl leading-7 text-stone-400">
              Entre em contato para tirar dúvidas sobre tecidos, medidas,
              aromas, materiais e opções disponíveis.
            </p>
          </div>

          {whatsappUrl ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-md bg-white px-7 py-3 text-sm font-semibold text-stone-950 hover:bg-stone-100"
            >
              Falar pelo WhatsApp
            </a>
          ) : (
            <Link
              to="/contato"
              className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-md bg-white px-7 py-3 text-sm font-semibold text-stone-950 hover:bg-stone-100"
            >
              Entrar em contato
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}
