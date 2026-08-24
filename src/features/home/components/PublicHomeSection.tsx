import { Link } from "react-router";
import type { PublicHomeSection as PublicHomeSectionType } from "../types/publicHome";
import { PublicProductCarousel } from "./PublicProductCarousel";

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
      <div className="mx-auto max-w-[84.5rem] px-4 py-20 sm:px-6 lg:px-8 lg:py-12">
        <header className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="eyebrow">Seleção especial</p>

            <h2 className="mt-3 text-4xl leading-tight text-stone-950 sm:text-5xl">
              {section.titulo}
            </h2>

            {section.subtitulo && (
              <p className="mt-5 text-base leading-7 text-stone-600 sm:text-lg">
                {section.subtitulo}
              </p>
            )}
          </div>

          <Link
            to="/catalogo"
            className="inline-flex shrink-0 items-center border-b border-stone-400 pb-1 text-sm font-semibold text-stone-900 hover:border-stone-950"
          >
            Ver catálogo completo
            <span aria-hidden="true" className="ml-2">
              →
            </span>
          </Link>
        </header>

        <PublicProductCarousel
          label={section.titulo}
          products={section.produtos}
        />
      </div>
    </section>
  );
}
