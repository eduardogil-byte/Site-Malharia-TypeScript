import { Link } from "react-router";
import type { PublicProduct } from "../types/publicCatalog";

type PublicProductCardProps = {
  product: PublicProduct;
};

export function PublicProductCard({ product }: PublicProductCardProps) {
  const coverImage = product.imagens[0];

  return (
    <article className="group overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <Link to={`/produto/${product.slug}`} className="block">
        <div className="aspect-square overflow-hidden bg-stone-100">
          {coverImage ? (
            <img
              src={coverImage.publicUrl}
              alt={coverImage.altText ?? product.nome}
              loading="lazy"
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center p-6 text-center text-sm text-stone-500">
              Produto sem imagem
            </div>
          )}
        </div>

        <div className="p-5">
          {product.categoria && (
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-500">
              {product.categoria.nome}
            </p>
          )}

          <h2 className="mt-2 text-lg font-semibold text-stone-950">
            {product.nome}
          </h2>

          {product.descricaoCurta && (
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-stone-600">
              {product.descricaoCurta}
            </p>
          )}

          {!product.disponivel && (
            <span className="mt-4 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
              Temporariamente indisponível
            </span>
          )}

          <span className="mt-5 block text-sm font-semibold text-stone-900">
            Ver detalhes
          </span>
        </div>
      </Link>
    </article>
  );
}
