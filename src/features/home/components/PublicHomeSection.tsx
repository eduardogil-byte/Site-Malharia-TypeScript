import { Link } from "react-router";
import { PublicProductCard } from "../../catalog/components/PublicProductCard";
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
  const productCount = section.produtos.length;

  return (
    <section
      id={section.slug}
      className={mutedBackground ? "bg-stone-100/55" : "bg-white"}
    >
      <div className="content-shell section-spacing">
        <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="eyebrow">Seleção especial</p>

            <h2 className="section-title mt-3">
              {section.titulo}
            </h2>

            {section.subtitulo && (
              <p className="lead-copy mt-4">
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

        {productCount > 1 ? (
          <PublicProductCarousel
            label={section.titulo}
            products={section.produtos}
            useDesktopGrid={productCount <= 4}
          />
        ) : (
          <ul
            aria-label={`Produtos de ${section.titulo}`}
            className="mt-8 grid max-w-[19rem] grid-cols-1 sm:mt-10"
          >
            {section.produtos.map((product) => (
              <li key={product.id} className="min-w-0">
                <PublicProductCard product={product} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
