import { useState, type FormEvent } from "react";
import { PublicProductCard } from "../../features/catalog/components/PublicProductCard";
import { usePublicCatalog } from "../../features/catalog/hooks/usePublicCatalog";
import type { PublicCatalogFilters } from "../../features/catalog/types/publicCatalog";

const initialFilters: PublicCatalogFilters = {
  search: "",
  categoryId: "",
};

export function CatalogPage() {
  const [draftFilters, setDraftFilters] =
    useState<PublicCatalogFilters>(initialFilters);

  const [appliedFilters, setAppliedFilters] =
    useState<PublicCatalogFilters>(initialFilters);

  const { products, categories, isLoading, loadError, reload } =
    usePublicCatalog(appliedFilters);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setAppliedFilters({
      search: draftFilters.search.trim(),
      categoryId: draftFilters.categoryId,
    });
  }

  function clearFilters() {
    setDraftFilters(initialFilters);
    setAppliedFilters(initialFilters);
  }

  return (
    <section className="content-shell section-spacing">
      <header className="max-w-3xl">
        <p className="eyebrow">
          Nossos produtos
        </p>

        <h1 className="page-title">
          Catálogo
        </h1>

        <p className="lead-copy mt-5 max-w-2xl">
          Conheça nossas malhas e produtos artesanais. Consulte os detalhes e a
          disponibilidade pelo WhatsApp.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="mt-10 border-y border-stone-200 bg-stone-50/70 py-6 sm:mt-12"
      >
        <div className="grid gap-5 md:grid-cols-[1fr_240px_auto]">
          <div>
            <label
              htmlFor="catalog-search"
              className="mb-2 block text-sm font-medium text-stone-700"
            >
              Pesquisar
            </label>

            <input
              id="catalog-search"
              type="search"
              value={draftFilters.search}
              onChange={(event) =>
                setDraftFilters((currentFilters) => ({
                  ...currentFilters,
                  search: event.target.value,
                }))
              }
              placeholder="Nome do produto"
              className="form-control"
            />
          </div>

          <div>
            <label
              htmlFor="catalog-category"
              className="mb-2 block text-sm font-medium text-stone-700"
            >
              Categoria
            </label>

            <select
              id="catalog-category"
              value={draftFilters.categoryId}
              onChange={(event) =>
                setDraftFilters((currentFilters) => ({
                  ...currentFilters,
                  categoryId: event.target.value,
                }))
              }
              className="form-control"
            >
              <option value="">Todas as categorias</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="button-primary flex-1 px-5 md:flex-none"
            >
              Filtrar
            </button>

            <button
              type="button"
              onClick={clearFilters}
              className="button-secondary flex-1 px-5 md:flex-none"
            >
              Limpar
            </button>
          </div>
        </div>
      </form>

      <div className="mt-10 sm:mt-12">
        {isLoading && (
          <div
            className="rounded-2xl border border-stone-200 bg-white p-12 text-center text-stone-600"
            aria-live="polite"
          >
            Carregando produtos...
          </div>
        )}

        {!isLoading && loadError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <p className="text-sm text-red-800">{loadError}</p>

            <button
              type="button"
              onClick={() => void reload()}
              className="mt-4 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-800 hover:bg-red-100"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {!isLoading && !loadError && products.length === 0 && (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-12 text-center">
            <h2 className="font-semibold text-stone-900">
              Nenhum produto encontrado
            </h2>

            <p className="mt-2 text-sm text-stone-600">
              Tente alterar os filtros ou volte novamente em outro momento.
            </p>
          </div>
        )}

        {!isLoading && !loadError && products.length > 0 && (
          <>
            <p className="mb-5 text-sm text-stone-600">
              {products.length}{" "}
              {products.length === 1
                ? "produto encontrado"
                : "produtos encontrados"}
            </p>

            <div className="grid grid-cols-1 gap-x-5 gap-y-10 min-[480px]:grid-cols-2 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-7">
              {products.map((product) => (
                <PublicProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
