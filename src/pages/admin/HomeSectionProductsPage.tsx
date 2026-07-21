import { useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { useHomeSectionProducts } from "../../features/home-sections/hooks/useHomeSectionProducts";
import type { ProductStatus } from "../../features/products/types/product";

const statusLabels: Record<ProductStatus, string> = {
  rascunho: "Rascunho",
  publicado: "Publicado",
  arquivado: "Arquivado",
};

function getStatusClasses(status: ProductStatus): string {
  switch (status) {
    case "publicado":
      return "bg-green-100 text-green-800";

    case "arquivado":
      return "bg-stone-200 text-stone-700";

    default:
      return "bg-amber-100 text-amber-800";
  }
}

export function HomeSectionProductsPage() {
  const { sectionId } = useParams<{
    sectionId: string;
  }>();

  const [search, setSearch] = useState("");

  const [actionError, setActionError] = useState<string | null>(null);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    section,
    selectedProducts,
    availableProducts,
    isLoading,
    isSaving,
    loadError,
    hasChanges,
    limitReached,
    reload,
    addProduct,
    removeProduct,
    moveProduct,
    resetSelection,
    saveSelection,
  } = useHomeSectionProducts(sectionId);

  const filteredAvailableProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase("pt-BR");

    if (!normalizedSearch) {
      return availableProducts;
    }

    return availableProducts.filter(
      (product) =>
        product.nome.toLocaleLowerCase("pt-BR").includes(normalizedSearch) ||
        product.categoria?.nome
          .toLocaleLowerCase("pt-BR")
          .includes(normalizedSearch),
    );
  }, [availableProducts, search]);

  async function handleSave() {
    setActionError(null);
    setSuccessMessage(null);

    try {
      await saveSelection();

      setSuccessMessage("Produtos da seção salvos com sucesso.");
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Não foi possível salvar os produtos.",
      );
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-stone-200 bg-white p-12 text-center text-stone-600">
        Carregando seção...
      </div>
    );
  }

  if (loadError || !section) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
        <p className="text-sm text-red-800">
          {loadError ?? "A seção não foi encontrada."}
        </p>

        <button
          type="button"
          onClick={() => void reload()}
          className="mt-4 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-800"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <section>
      <header>
        <Link
          to="/admin/pagina-inicial"
          className="text-sm font-medium text-stone-600 hover:text-stone-950"
        >
          ← Voltar para as seções
        </Link>

        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
          Página inicial
        </p>

        <h1 className="mt-2 text-3xl font-semibold text-stone-950">
          {section.titulo}
        </h1>

        <p className="mt-3 text-stone-600">
          Escolha os produtos e defina a ordem em que eles aparecerão nesta
          seção.
        </p>

        <p className="mt-2 text-sm font-medium text-stone-700">
          {selectedProducts.length} de {section.limite_produtos} produtos
          selecionados
        </p>
      </header>

      {successMessage && (
        <div
          role="status"
          className="mt-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
        >
          {successMessage}
        </div>
      )}

      {actionError && (
        <div
          role="alert"
          className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {actionError}
        </div>
      )}

      <div className="mt-8 grid gap-8 xl:grid-cols-2">
        <section className="rounded-2xl border border-stone-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-stone-950">
            Produtos selecionados
          </h2>

          <p className="mt-1 text-sm text-stone-600">
            A ordem abaixo será a ordem exibida na página inicial.
          </p>

          <div className="mt-6 space-y-3">
            {selectedProducts.length === 0 && (
              <div className="rounded-lg border border-dashed border-stone-300 p-8 text-center text-sm text-stone-500">
                Nenhum produto selecionado.
              </div>
            )}

            {selectedProducts.map((product, index) => (
              <article
                key={product.id}
                className="rounded-xl border border-stone-200 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-stone-950">
                      {index + 1}. {product.nome}
                    </p>

                    <p className="mt-1 text-xs text-stone-500">
                      {product.categoria?.nome ?? "Sem categoria"}
                    </p>

                    <span
                      className={[
                        "mt-3 inline-flex rounded-full px-3 py-1 text-xs font-medium",
                        getStatusClasses(product.status),
                      ].join(" ")}
                    >
                      {statusLabels[product.status]}
                    </span>

                    {product.status !== "publicado" && (
                      <p className="mt-2 text-xs text-amber-700">
                        Este produto só aparecerá publicamente quando estiver
                        publicado.
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => removeProduct(product.id)}
                    disabled={isSaving}
                    className="text-sm font-medium text-red-700 hover:text-red-900 disabled:opacity-50"
                  >
                    Remover
                  </button>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => moveProduct(product.id, "up")}
                    disabled={isSaving || index === 0}
                    className="rounded-lg border border-stone-300 px-3 py-2 text-xs font-medium disabled:opacity-30"
                  >
                    Mover para cima
                  </button>

                  <button
                    type="button"
                    onClick={() => moveProduct(product.id, "down")}
                    disabled={isSaving || index === selectedProducts.length - 1}
                    className="rounded-lg border border-stone-300 px-3 py-2 text-xs font-medium disabled:opacity-30"
                  >
                    Mover para baixo
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-stone-950">
            Produtos disponíveis
          </h2>

          <div className="mt-5">
            <label
              htmlFor="section-product-search"
              className="mb-2 block text-sm font-medium text-stone-700"
            >
              Pesquisar
            </label>

            <input
              id="section-product-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Produto ou categoria"
              className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10"
            />
          </div>

          {limitReached && (
            <p className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
              O limite de produtos desta seção foi atingido.
            </p>
          )}

          <div className="mt-5 max-h-[600px] space-y-3 overflow-y-auto pr-1">
            {filteredAvailableProducts.length === 0 && (
              <div className="rounded-lg border border-dashed border-stone-300 p-8 text-center text-sm text-stone-500">
                Nenhum produto disponível.
              </div>
            )}

            {filteredAvailableProducts.map((product) => {
              const isArchived = product.status === "arquivado";

              return (
                <article
                  key={product.id}
                  className="flex items-center justify-between gap-4 rounded-xl border border-stone-200 p-4"
                >
                  <div>
                    <p className="font-medium text-stone-950">{product.nome}</p>

                    <p className="mt-1 text-xs text-stone-500">
                      {product.categoria?.nome ?? "Sem categoria"}
                    </p>

                    <span
                      className={[
                        "mt-2 inline-flex rounded-full px-3 py-1 text-xs font-medium",
                        getStatusClasses(product.status),
                      ].join(" ")}
                    >
                      {statusLabels[product.status]}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => addProduct(product.id)}
                    disabled={isSaving || limitReached || isArchived}
                    title={
                      isArchived
                        ? "Produtos arquivados não podem ser adicionados."
                        : undefined
                    }
                    className="rounded-lg bg-stone-900 px-3 py-2 text-sm font-medium text-white hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Adicionar
                  </button>
                </article>
              );
            })}
          </div>
        </section>
      </div>

      <div className="sticky bottom-4 mt-8 flex flex-col items-end justify-between gap-4 rounded-2xl border border-stone-200 bg-white/95 p-5 shadow-lg backdrop-blur sm:flex-row sm:items-center">
        <p className="text-sm text-stone-600">
          {hasChanges
            ? "Existem alterações ainda não salvas."
            : "Todas as alterações estão salvas."}
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={resetSelection}
            disabled={!hasChanges || isSaving}
            className="rounded-lg border border-stone-300 px-4 py-3 text-sm font-medium text-stone-700 hover:bg-stone-100 disabled:opacity-40"
          >
            Desfazer alterações
          </button>

          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={!hasChanges || isSaving}
            className="rounded-lg bg-stone-900 px-5 py-3 text-sm font-medium text-white hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSaving ? "Salvando..." : "Salvar produtos"}
          </button>
        </div>
      </div>
    </section>
  );
}
