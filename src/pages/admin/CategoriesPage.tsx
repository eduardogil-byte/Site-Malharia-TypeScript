import { useState } from "react";
import { CategoryForm } from "../../features/categories/components/CategoryForm";
import { useAdminCategories } from "../../features/categories/hooks/useAdminCategories";
import type { ValidatedCategoryFormValues } from "../../features/categories/schemas/categorySchema";
import type { Category } from "../../features/categories/types/category";

export function CategoriesPage() {
  const {
    categories,
    isLoading,
    loadError,
    reload,
    addCategory,
    editCategory,
    toggleCategory,
    removeCategory,
    moveCategory,
  } = useAdminCategories();

  const [isFormOpen, setIsFormOpen] = useState(false);

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [actionError, setActionError] = useState<string | null>(null);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  function openCreateForm() {
    setEditingCategory(null);
    setActionError(null);
    setSuccessMessage(null);
    setIsFormOpen(true);
  }

  function openEditForm(category: Category) {
    setEditingCategory(category);
    setActionError(null);
    setSuccessMessage(null);
    setIsFormOpen(true);
  }

  function closeForm() {
    if (isSubmitting) {
      return;
    }

    setIsFormOpen(false);
    setEditingCategory(null);
  }

  async function handleFormSubmit(values: ValidatedCategoryFormValues) {
    setIsSubmitting(true);
    setActionError(null);
    setSuccessMessage(null);

    const input = {
      nome: values.nome,
      slug: values.slug,
      descricao: values.descricao.length > 0 ? values.descricao : null,
      ativa: values.ativa,
    };

    try {
      if (editingCategory) {
        await editCategory(editingCategory.id, input);

        setSuccessMessage("Categoria atualizada com sucesso.");
      } else {
        await addCategory(input);

        setSuccessMessage("Categoria cadastrada com sucesso.");
      }

      setIsFormOpen(false);
      setEditingCategory(null);
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Não foi possível salvar a categoria.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleToggle(category: Category) {
    setActionError(null);
    setSuccessMessage(null);

    try {
      await toggleCategory(category);

      setSuccessMessage(
        category.ativa ? "Categoria desativada." : "Categoria ativada.",
      );
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Não foi possível alterar a categoria.",
      );
    }
  }

  async function handleDelete(category: Category) {
    const confirmed = window.confirm(
      `Deseja excluir a categoria "${category.nome}"?`,
    );

    if (!confirmed) {
      return;
    }

    setActionError(null);
    setSuccessMessage(null);

    try {
      await removeCategory(category.id);

      setSuccessMessage("Categoria excluída com sucesso.");
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Não foi possível excluir a categoria.",
      );
    }
  }

  async function handleMove(categoryId: string, direction: "up" | "down") {
    setActionError(null);
    setSuccessMessage(null);

    try {
      await moveCategory(categoryId, direction);
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Não foi possível alterar a ordem.",
      );
    }
  }

  return (
    <section>
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
            Administração
          </p>

          <h1 className="mt-2 text-3xl font-semibold text-stone-950">
            Categorias
          </h1>

          <p className="mt-3 max-w-2xl text-stone-600">
            Organize os tipos de produtos e defina a ordem em que eles aparecem
            no catálogo.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          className="rounded-lg bg-stone-900 px-4 py-3 text-sm font-medium text-white hover:bg-stone-700"
        >
          Nova categoria
        </button>
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

      {isFormOpen && (
        <div className="mt-8">
          <CategoryForm
            key={editingCategory?.id ?? "new-category"}
            category={editingCategory}
            isSubmitting={isSubmitting}
            onSubmit={handleFormSubmit}
            onCancel={closeForm}
          />
        </div>
      )}

      <div className="mt-8">
        {isLoading && (
          <div
            className="rounded-2xl border border-stone-200 bg-white p-12 text-center text-stone-600"
            aria-live="polite"
          >
            Carregando categorias...
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

        {!isLoading && !loadError && categories.length === 0 && (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-12 text-center">
            <h2 className="font-semibold text-stone-900">
              Nenhuma categoria cadastrada
            </h2>

            <p className="mt-2 text-sm text-stone-600">
              Cadastre a primeira categoria para começar a organizar os
              produtos.
            </p>
          </div>
        )}

        {!isLoading && !loadError && categories.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead className="bg-stone-50">
                  <tr>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-stone-500">
                      Ordem
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-stone-500">
                      Categoria
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-stone-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-stone-500">
                      Ações
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-stone-200">
                  {categories.map((category, index) => (
                    <tr key={category.id}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="min-w-6 text-center text-sm font-semibold text-stone-700">
                            {index + 1}
                          </span>

                          <button
                            type="button"
                            onClick={() => void handleMove(category.id, "up")}
                            disabled={index === 0}
                            aria-label={`Mover ${category.nome} para cima`}
                            className="rounded border border-stone-300 px-2 py-1 text-sm hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            ↑
                          </button>

                          <button
                            type="button"
                            onClick={() => void handleMove(category.id, "down")}
                            disabled={index === categories.length - 1}
                            aria-label={`Mover ${category.nome} para baixo`}
                            className="rounded border border-stone-300 px-2 py-1 text-sm hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            ↓
                          </button>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-medium text-stone-950">
                          {category.nome}
                        </p>

                        <p className="mt-1 text-xs text-stone-500">
                          /catalogo/
                          {category.slug}
                        </p>

                        {category.descricao && (
                          <p className="mt-2 max-w-md text-sm text-stone-600">
                            {category.descricao}
                          </p>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={[
                            "inline-flex rounded-full px-3 py-1 text-xs font-medium",
                            category.ativa
                              ? "bg-green-100 text-green-800"
                              : "bg-stone-200 text-stone-700",
                          ].join(" ")}
                        >
                          {category.ativa ? "Ativa" : "Inativa"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex flex-wrap justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditForm(category)}
                            className="rounded-lg border border-stone-300 px-3 py-2 text-xs font-medium text-stone-700 hover:bg-stone-100"
                          >
                            Editar
                          </button>

                          <button
                            type="button"
                            onClick={() => void handleToggle(category)}
                            className="rounded-lg border border-stone-300 px-3 py-2 text-xs font-medium text-stone-700 hover:bg-stone-100"
                          >
                            {category.ativa ? "Desativar" : "Ativar"}
                          </button>

                          <button
                            type="button"
                            onClick={() => void handleDelete(category)}
                            className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-50"
                          >
                            Excluir
                          </button>
                        </div>
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
