import { useState, type FormEvent } from "react";
import { useAdminProducts } from "../../features/products/hooks/useAdminProducts";
import type {
  ProductListFilters,
  ProductStatus,
} from "../../features/products/types/product";

const initialFilters: ProductListFilters = {
  search: "",
  categoryId: "",
  status: "",
};

const statusLabels: Record<ProductStatus, string> = {
  rascunho: "Rascunho",
  publicado: "Publicado",
  arquivado: "Arquivado",
};

function getStatusLabel(status: string): string {
  if (
    status === "rascunho" ||
    status === "publicado" ||
    status === "arquivado"
  ) {
    return statusLabels[status];
  }

  return status;
}

function getStatusClasses(status: string): string {
  switch (status) {
    case "publicado":
      return "bg-green-100 text-green-800";

    case "arquivado":
      return "bg-stone-200 text-stone-700";

    default:
      return "bg-amber-100 text-amber-800";
  }
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export function ProductsPage() {
  const [draftFilters, setDraftFilters] =
    useState<ProductListFilters>(initialFilters);

  const [appliedFilters, setAppliedFilters] =
    useState<ProductListFilters>(initialFilters);

  const { products, categories, isLoading, loadError, reload } =
    useAdminProducts(appliedFilters);

  function handleFilterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setAppliedFilters({
      search: draftFilters.search.trim(),
      categoryId: draftFilters.categoryId,
      status: draftFilters.status,
    });
  }

  function clearFilters() {
    setDraftFilters(initialFilters);
    setAppliedFilters(initialFilters);
  }

  return (
    <section>
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
            Administração
          </p>

          <h1 className="mt-2 text-3xl font-semibold text-stone-950">
            Produtos
          </h1>

          <p className="mt-3 max-w-2xl text-stone-600">
            Consulte os produtos cadastrados, seus status e categorias.
          </p>
        </div>

        <button
          type="button"
          disabled
          title="O cadastro será implementado na próxima etapa."
          className="cursor-not-allowed rounded-lg bg-stone-300 px-4 py-3 text-sm font-medium text-stone-600"
        >
          Novo produto
        </button>
      </header>

      <form
        onSubmit={handleFilterSubmit}
        className="mt-8 rounded-2xl border border-stone-200 bg-white p-5"
      >
        <div className="grid gap-4 lg:grid-cols-[1fr_220px_180px_auto]">
          <div>
            <label
              htmlFor="product-search"
              className="mb-2 block text-sm font-medium text-stone-700"
            >
              Pesquisar
            </label>

            <input
              id="product-search"
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
              htmlFor="product-category"
              className="mb-2 block text-sm font-medium text-stone-700"
            >
              Categoria
            </label>

            <select
              id="product-category"
              value={draftFilters.categoryId}
              onChange={(event) =>
                setDraftFilters((currentFilters) => ({
                  ...currentFilters,
                  categoryId: event.target.value,
                }))
              }
              className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 outline-none transition focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10"
            >
              <option value="">Todas</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="product-status"
              className="mb-2 block text-sm font-medium text-stone-700"
            >
              Status
            </label>

            <select
              id="product-status"
              value={draftFilters.status}
              onChange={(event) =>
                setDraftFilters((currentFilters) => ({
                  ...currentFilters,
                  status: event.target.value as ProductStatus | "",
                }))
              }
              className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 outline-none transition focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10"
            >
              <option value="">Todos</option>
              <option value="rascunho">Rascunho</option>
              <option value="publicado">Publicado</option>
              <option value="arquivado">Arquivado</option>
            </select>
          </div>

          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="rounded-lg bg-stone-900 px-4 py-3 text-sm font-medium text-white hover:bg-stone-700"
            >
              Filtrar
            </button>

            <button
              type="button"
              onClick={clearFilters}
              className="rounded-lg border border-stone-300 px-4 py-3 text-sm font-medium text-stone-700 hover:bg-stone-100"
            >
              Limpar
            </button>
          </div>
        </div>
      </form>

      <div className="mt-6">
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
              Ainda não existem produtos ou nenhum produto corresponde aos
              filtros informados.
            </p>
          </div>
        )}

        {!isLoading && !loadError && products.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
            <div className="border-b border-stone-200 px-5 py-4">
              <p className="text-sm text-stone-600">
                {products.length}{" "}
                {products.length === 1
                  ? "produto encontrado"
                  : "produtos encontrados"}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead className="bg-stone-50">
                  <tr>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-stone-500">
                      Produto
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-stone-500">
                      Categoria
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-stone-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-stone-500">
                      Disponibilidade
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-stone-500">
                      Atualizado
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-stone-200">
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="px-5 py-4">
                        <p className="font-medium text-stone-950">
                          {product.nome}
                        </p>

                        <p className="mt-1 text-xs text-stone-500">
                          /produto/
                          {product.slug}
                        </p>

                        {product.descricao_curta && (
                          <p className="mt-2 max-w-md text-sm text-stone-600">
                            {product.descricao_curta}
                          </p>
                        )}
                      </td>

                      <td className="px-5 py-4 text-sm text-stone-700">
                        {product.categoria?.nome ?? "Categoria indisponível"}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={[
                            "inline-flex rounded-full px-3 py-1 text-xs font-medium",
                            getStatusClasses(product.status),
                          ].join(" ")}
                        >
                          {getStatusLabel(product.status)}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={[
                            "inline-flex rounded-full px-3 py-1 text-xs font-medium",
                            product.disponivel
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800",
                          ].join(" ")}
                        >
                          {product.disponivel ? "Disponível" : "Indisponível"}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-sm text-stone-600">
                        {formatDate(product.updated_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
