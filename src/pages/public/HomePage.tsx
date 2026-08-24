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
      <section className="relative isolate overflow-hidden bg-stone-950 text-white">
        {!settings?.bannerUrl && (
          <div aria-hidden="true" className="absolute inset-0 opacity-10">
            <div className="absolute -left-32 top-0 size-80 rounded-full bg-white blur-3xl" />

            <div className="absolute -right-32 bottom-0 size-96 rounded-full bg-stone-400 blur-3xl" />
          </div>
        )}

        <div
          className={[
            "content-shell relative grid items-center",
            settings?.bannerUrl
              ? "gap-10 py-12 sm:py-16 lg:grid-cols-[minmax(0,1.04fr)_minmax(22rem,0.96fr)] lg:gap-14 lg:py-10 xl:gap-20"
              : "min-h-[28rem] py-16 sm:min-h-[30rem] sm:py-20 lg:min-h-[32rem] lg:py-24",
          ].join(" ")}
        >
          <div className="max-w-[43rem]">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-200">
              {brandName}
            </p>

            <h1 className="mt-4 text-balance text-4xl leading-[1.04] sm:text-5xl lg:text-[3.75rem] xl:text-[4.25rem]">
              {heroTitle}
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-stone-300 sm:text-lg sm:leading-8">
              Conheça nossa seleção de malhas, sabonetes, velas, aromatizadores
              e outros produtos artesanais.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                to="/catalogo"
                className="button-primary min-h-11 border-white bg-white px-6 py-2.5 text-stone-950 shadow-none hover:border-stone-100 hover:bg-stone-100"
              >
                Ver catálogo
              </Link>

              {whatsappUrl ? (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="button-secondary min-h-11 border-white/40 px-6 py-2.5 text-white hover:border-white/70 hover:bg-white/10"
                >
                  Falar pelo WhatsApp
                </a>
              ) : (
                <Link
                  to="/contato"
                  className="button-secondary min-h-11 border-white/40 px-6 py-2.5 text-white hover:border-white/70 hover:bg-white/10"
                >
                  Entrar em contato
                </Link>
              )}
            </div>
          </div>

          {settings?.bannerUrl && (
            <div className="relative min-h-64 overflow-hidden rounded-sm border border-white/10 bg-stone-900 shadow-float sm:min-h-80 lg:min-h-[28rem] xl:min-h-[31rem]">
              <img
                src={settings.bannerUrl}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />

              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-stone-950/20 via-transparent to-white/5"
              />
            </div>
          )}
        </div>
      </section>

      {isLoading && (
        <section
          aria-live="polite"
          className="content-shell section-spacing text-center text-stone-600"
        >
          Carregando produtos em destaque...
        </section>
      )}

      {!isLoading && loadError && (
        <section className="content-shell section-spacing text-center">
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
        <section className="content-shell section-spacing text-center">
          <h2 className="section-title">
            Nosso catálogo está sendo preparado
          </h2>

          <p className="lead-copy mx-auto mt-4 max-w-2xl">
            Em breve novos produtos estarão disponíveis nesta página.
          </p>

          <Link to="/catalogo" className="button-primary mt-8">
            Acessar catálogo
          </Link>
        </section>
      )}

      <section className="border-b border-stone-800 bg-stone-900 text-white">
        <div className="content-shell grid gap-7 py-12 sm:py-14 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-10 lg:py-16">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">
              Encontrou algo especial?
            </p>

            <h2 className="mt-3 text-3xl leading-tight sm:text-4xl">
              Consulte disponibilidade e detalhes dos produtos.
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-stone-400">
              Entre em contato para tirar dúvidas sobre tecidos, medidas,
              aromas, materiais e opções disponíveis.
            </p>
          </div>

          {whatsappUrl ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 w-full items-center justify-center rounded-md border border-white bg-white px-6 py-2.5 text-sm font-semibold text-stone-950 hover:border-stone-100 hover:bg-stone-100 sm:w-auto sm:justify-self-start lg:justify-self-end"
            >
              Falar pelo WhatsApp
            </a>
          ) : (
            <Link
              to="/contato"
              className="inline-flex min-h-11 w-full items-center justify-center rounded-md border border-white bg-white px-6 py-2.5 text-sm font-semibold text-stone-950 hover:border-stone-100 hover:bg-stone-100 sm:w-auto sm:justify-self-start lg:justify-self-end"
            >
              Entrar em contato
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}
