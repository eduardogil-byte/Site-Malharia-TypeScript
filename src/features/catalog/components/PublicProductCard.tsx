import { Link } from "react-router";
import type { PublicProduct } from "../types/publicCatalog";

type PublicProductCardProps = {
  product: PublicProduct;
};

export function PublicProductCard({ product }: PublicProductCardProps) {
  const coverImage = product.imagens[0];

  return (
    <article className="group h-full bg-transparent">
      <Link
        to={`/produto/${product.slug}`}
        aria-label={`Ver detalhes do produto ${product.nome}`}
        className="block h-full rounded-sm"
      >
        <div className="aspect-[4/5] overflow-hidden bg-stone-100">
          {coverImage ? (
            <img
              src={coverImage.publicUrl}
              alt={coverImage.altText ?? product.nome}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.025]"
            />
          ) : (
            <div className="flex h-full items-center justify-center p-6 text-center text-sm text-stone-500">
              Produto sem imagem
            </div>
          )}
        </div>

        <div className="flex min-h-44 flex-col pb-1 pt-4 sm:min-h-48">
          {product.categoria && (
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-stone-500">
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

          <span className="mt-auto block pt-5 text-xs font-semibold uppercase tracking-[0.12em] text-stone-700 group-hover:text-stone-950">
            Ver detalhes <span aria-hidden="true">→</span>
          </span>
        </div>
      </Link>
    </article>
  );
}
