import { Link } from "react-router";
import { usePublicSiteSettings } from "../../features/site-settings/context/PublicSiteSettingsContext";

const defaultAboutText = `Trabalhamos com malhas e produtos artesanais selecionados com cuidado.

Nosso objetivo é oferecer um atendimento próximo e ajudar cada cliente a encontrar produtos adequados para suas necessidades e projetos.`;

export function AboutPage() {
  const { settings, isLoading, loadError, reload } = usePublicSiteSettings();

  if (isLoading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-20 text-center text-stone-600 sm:px-6 lg:px-8">
        Carregando informações...
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
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
      <section className="bg-stone-100">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
              Nossa história
            </p>

            <h1 className="mt-3 text-4xl font-semibold text-stone-950 sm:text-5xl">
              Sobre a {brandName}
            </h1>

            {settings?.slogan && (
              <p className="mt-5 text-xl leading-8 text-stone-600">
                {settings.slogan}
              </p>
            )}
          </div>

          <div className="flex min-h-72 items-center justify-center overflow-hidden rounded-3xl bg-white p-8 shadow-sm">
            {settings?.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt={brandName}
                className="max-h-56 max-w-full object-contain"
              />
            ) : (
              <p className="text-3xl font-semibold text-stone-950">
                {brandName}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <h2 className="text-3xl font-semibold text-stone-950">Quem somos</h2>

        <div className="mt-7 whitespace-pre-line text-lg leading-9 text-stone-600">
          {aboutText}
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/catalogo"
            className="inline-flex justify-center rounded-xl bg-stone-900 px-6 py-4 text-sm font-semibold text-white hover:bg-stone-700"
          >
            Conhecer os produtos
          </Link>

          <Link
            to="/contato"
            className="inline-flex justify-center rounded-xl border border-stone-300 px-6 py-4 text-sm font-semibold text-stone-800 hover:bg-stone-100"
          >
            Entrar em contato
          </Link>
        </div>
      </section>
    </main>
  );
}
