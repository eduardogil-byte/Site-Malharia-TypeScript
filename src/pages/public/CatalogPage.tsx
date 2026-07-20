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
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
          Nossos produtos
        </p>

        <h1 className="mt-2 text-4xl font-semibold text-stone-950">Catálogo</h1>

        <p className="mt-4 text-lg leading-8 text-stone-600">
          Conheça nossas malhas e produtos artesanais. Consulte os detalhes e a
          disponibilidade pelo WhatsApp.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="mt-10 rounded-2xl border border-stone-200 bg-white p-5"
      >
        <div className="grid gap-4 md:grid-cols-[1fr_240px_auto]">
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
              className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10"
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
              className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 outline-none transition focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10"
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
              className="rounded-lg bg-stone-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-700"
            >
              Filtrar
            </button>

            <button
              type="button"
              onClick={clearFilters}
              className="rounded-lg border border-stone-300 px-5 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
            >
              Limpar
            </button>
          </div>
        </div>
      </form>

      <div className="mt-10">
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

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
