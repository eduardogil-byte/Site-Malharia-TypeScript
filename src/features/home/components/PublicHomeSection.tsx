import { Link } from "react-router";
import { PublicProductCard } from "../../catalog/components/PublicProductCard";
import type { PublicHomeSection as PublicHomeSectionType } from "../types/publicHome";

type PublicHomeSectionProps = {
  section: PublicHomeSectionType;
  mutedBackground?: boolean;
};

export function PublicHomeSection({
  section,
  mutedBackground = false,
}: PublicHomeSectionProps) {
  return (
    <section
      id={section.slug}
      className={mutedBackground ? "bg-stone-50" : "bg-white"}
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
              Seleção especial
            </p>

            <h2 className="mt-2 text-3xl font-semibold text-stone-950 sm:text-4xl">
              {section.titulo}
            </h2>

            {section.subtitulo && (
              <p className="mt-4 text-base leading-7 text-stone-600 sm:text-lg">
                {section.subtitulo}
              </p>
            )}
          </div>

          <Link
            to="/catalogo"
            className="inline-flex shrink-0 items-center text-sm font-semibold text-stone-900 hover:text-stone-600"
          >
            Ver catálogo completo
            <span aria-hidden="true" className="ml-2">
              →
            </span>
          </Link>
        </header>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {section.produtos.map((product) => (
            <PublicProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
