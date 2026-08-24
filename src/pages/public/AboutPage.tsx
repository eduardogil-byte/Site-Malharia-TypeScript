import { Link } from "react-router";
import { usePublicSiteSettings } from "../../features/site-settings/context/PublicSiteSettingsContext";

const defaultAboutText = `Trabalhamos com malhas e produtos artesanais selecionados com cuidado.

Nosso objetivo é oferecer um atendimento próximo e ajudar cada cliente a encontrar produtos adequados para suas necessidades e projetos.`;

export function AboutPage() {
  const { settings, isLoading, loadError, reload } = usePublicSiteSettings();

  if (isLoading) {
    return (
      <main className="content-shell section-spacing text-center text-stone-600">
        Carregando informações...
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="content-shell section-spacing max-w-4xl text-center">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8">
          <p className="text-red-800">{loadError}</p>

          <button
            type="button"
            onClick={() => void reload()}
            className="mt-5 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-800"
          >
            Tentar novamente
          </button>
        </div>
      </main>
    );
  }

  const brandName = settings?.nomeMarca?.trim() || "Nossa marca";

  const aboutText = settings?.textoSobre?.trim() || defaultAboutText;

  return (
    <main>
      <section className="bg-stone-100/55">
        <div className="content-shell section-spacing grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <p className="eyebrow">
              Nossa história
            </p>

            <h1 className="page-title">
              Sobre a {brandName}
            </h1>

            {settings?.slogan && (
              <p className="lead-copy mt-5 max-w-lg">
                {settings.slogan}
              </p>
            )}
          </div>

          <div className="flex min-h-64 items-center justify-center overflow-hidden rounded-lg border border-stone-200 bg-white p-8 shadow-soft sm:min-h-80 sm:p-10">
            {settings?.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt={brandName}
                className="max-h-56 max-w-full object-contain"
              />
            ) : (
              <p className="font-display text-4xl tracking-[-0.03em] text-stone-950">
                {brandName}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="content-shell section-spacing max-w-4xl">
        <h2 className="section-title">Quem somos</h2>

        <div className="mt-6 whitespace-pre-line text-base leading-8 text-stone-600 sm:text-lg sm:leading-9">
          {aboutText}
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/catalogo"
            className="button-primary"
          >
            Conhecer os produtos
          </Link>

          <Link
            to="/contato"
            className="button-secondary"
          >
            Entrar em contato
          </Link>
        </div>
      </section>
    </main>
  );
}
