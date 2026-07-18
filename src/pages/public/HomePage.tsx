import { Link } from "react-router";

export function HomePage() {
  return (
    <>
      <section className="bg-stone-100">
        <div className="mx-auto grid min-h-[520px] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-stone-600">
              Feito com cuidado
            </p>

            <h1 className="max-w-xl text-4xl font-semibold leading-tight text-stone-950 sm:text-5xl">
              Malhas e produtos artesanais para momentos especiais
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-stone-600">
              Conheça nossas malhas, sabonetes, velas e aromatizadores. Consulte
              modelos e disponibilidade diretamente pelo WhatsApp.
            </p>

            <Link
              to="/catalogo"
              className="mt-8 inline-flex rounded-full bg-stone-900 px-6 py-3 font-medium text-white transition hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:ring-offset-2"
            >
              Conhecer o catálogo
            </Link>
          </div>

          <div className="flex min-h-80 items-center justify-center rounded-3xl bg-stone-200 p-8 text-center text-stone-500">
            Imagem principal da marca
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
            Seleção especial
          </p>

          <h2 className="mt-2 text-3xl font-semibold text-stone-950">
            Malhas em destaque
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <article
              key={index}
              className="overflow-hidden rounded-2xl border border-stone-200 bg-white"
            >
              <div className="aspect-square bg-stone-200" />

              <div className="p-5">
                <h3 className="font-semibold text-stone-900">
                  Malha {index + 1}
                </h3>

                <p className="mt-2 text-sm text-stone-600">
                  Produto temporário para construção do layout.
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
