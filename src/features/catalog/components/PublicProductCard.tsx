import { Link } from "react-router";
import type { PublicProduct } from "../types/publicCatalog";

type PublicProductCardProps = {
  product: PublicProduct;
};

export function PublicProductCard({ product }: PublicProductCardProps) {
  const coverImage = product.imagens[0];

  return (
    <article className="group h-full bg-transparent transition-transform duration-300 hover:-translate-y-0.5">
      <Link
        to={`/produto/${product.slug}`}
        aria-label={`Ver detalhes do produto ${product.nome}`}
        className="flex h-full flex-col rounded-sm"
      >
        <div className="aspect-[4/5] overflow-hidden rounded-sm border border-stone-200 bg-stone-100">
          {coverImage ? (
            <img
              src={coverImage.publicUrl}
              alt={coverImage.altText ?? product.nome}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.025]"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-stone-50 to-stone-200/70 p-6 text-center">
              <span aria-hidden="true" className="mb-4 h-px w-10 bg-stone-300" />

              <span className="text-[0.68rem] font-medium uppercase tracking-[0.18em] text-stone-500">
                Imagem em breve
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col px-1 pb-1 pt-4">
          {product.categoria && (
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-stone-500">
              {product.categoria.nome}
            </p>
          )}

          <h2 className="mt-2 font-sans text-base font-semibold leading-snug tracking-normal text-stone-950 sm:text-lg">
            {product.nome}
          </h2>

          {product.descricaoCurta && (
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-stone-600">
              {product.descricaoCurta}
            </p>
          )}

          {!product.disponivel && (
            <span className="mt-4 inline-flex self-start rounded-sm bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">
              Temporariamente indisponível
            </span>
          )}

          <span className="mt-auto inline-flex min-h-11 items-center gap-2 self-start pt-4 text-sm font-semibold text-stone-700 transition-colors group-hover:text-stone-950">
            <span className="border-b border-stone-300 pb-0.5 group-hover:border-stone-700">
              Ver detalhes
            </span>

            <span
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            >
              →
            </span>
          </span>
        </div>
      </Link>
    </article>
  );
}
