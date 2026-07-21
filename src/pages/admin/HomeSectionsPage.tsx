import { useState } from "react";
import { Link } from "react-router";
import { HomeSectionForm } from "../../features/home-sections/components/HomeSectionForm";
import { useAdminHomeSections } from "../../features/home-sections/hooks/useAdminHomeSections";
import type { ValidatedHomeSectionFormValues } from "../../features/home-sections/schemas/homeSectionSchema";
import type { HomeSection } from "../../features/home-sections/types/homeSection";

export function HomeSectionsPage() {
  const {
    sections,
    isLoading,
    loadError,
    reload,
    addSection,
    editSection,
    toggleSection,
    removeSection,
    moveSection,
  } = useAdminHomeSections();

  const [isFormOpen, setIsFormOpen] = useState(false);

  const [editingSection, setEditingSection] = useState<HomeSection | null>(
    null,
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [actingSectionId, setActingSectionId] = useState<string | null>(null);

  const [actionError, setActionError] = useState<string | null>(null);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  function clearMessages() {
    setActionError(null);
    setSuccessMessage(null);
  }

  function openCreateForm() {
    clearMessages();
    setEditingSection(null);
    setIsFormOpen(true);
  }

  function openEditForm(section: HomeSection) {
    clearMessages();
    setEditingSection(section);
    setIsFormOpen(true);
  }

  function closeForm() {
    if (isSubmitting) {
      return;
    }

    setIsFormOpen(false);
    setEditingSection(null);
  }

  async function handleFormSubmit(values: ValidatedHomeSectionFormValues) {
    setIsSubmitting(true);
    clearMessages();

    const input = {
      titulo: values.titulo,
      subtitulo: values.subtitulo || null,
      slug: values.slug,
      ativa: values.ativa,
      limiteProdutos: values.limiteProdutos,
    };

    try {
      if (editingSection) {
        await editSection(editingSection.id, input);

        setSuccessMessage("Seção atualizada com sucesso.");
      } else {
        await addSection(input);

        setSuccessMessage("Seção cadastrada com sucesso.");
      }

      setIsFormOpen(false);
      setEditingSection(null);
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Não foi possível salvar a seção.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleToggle(section: HomeSection) {
    clearMessages();
    setActingSectionId(section.id);

    try {
      await toggleSection(section);

      setSuccessMessage(section.ativa ? "Seção desativada." : "Seção ativada.");
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Não foi possível alterar a seção.",
      );
    } finally {
      setActingSectionId(null);
    }
  }

  async function handleMove(sectionId: string, direction: "up" | "down") {
    clearMessages();
    setActingSectionId(sectionId);

    try {
      await moveSection(sectionId, direction);

      setSuccessMessage("Ordem atualizada.");
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Não foi possível alterar a ordem.",
      );
    } finally {
      setActingSectionId(null);
    }
  }

  async function handleDelete(section: HomeSection) {
    const confirmed = window.confirm(
      `Excluir a seção "${section.titulo}"? Os produtos não serão excluídos, apenas removidos desta seção.`,
    );

    if (!confirmed) {
      return;
    }

    clearMessages();
    setActingSectionId(section.id);

    try {
      await removeSection(section.id);

      setSuccessMessage("Seção excluída com sucesso.");
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Não foi possível excluir a seção.",
      );
    } finally {
      setActingSectionId(null);
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
            Página inicial
          </h1>

          <p className="mt-3 max-w-2xl text-stone-600">
            Crie e organize as vitrines que serão exibidas na página inicial.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          className="rounded-lg bg-stone-900 px-4 py-3 text-sm font-medium text-white hover:bg-stone-700"
        >
          Nova seção
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
          <HomeSectionForm
            key={editingSection?.id ?? "new-home-section"}
            section={editingSection}
            isSubmitting={isSubmitting}
            onSubmit={handleFormSubmit}
            onCancel={closeForm}
          />
        </div>
      )}

      <div className="mt-8">
        {isLoading && (
          <div className="rounded-2xl border border-stone-200 bg-white p-12 text-center text-stone-600">
            Carregando seções...
          </div>
        )}

        {!isLoading && loadError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <p className="text-sm text-red-800">{loadError}</p>

            <button
              type="button"
              onClick={() => void reload()}
              className="mt-4 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-800"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {!isLoading && !loadError && sections.length === 0 && (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-12 text-center">
            <h2 className="font-semibold text-stone-900">
              Nenhuma seção cadastrada
            </h2>

            <p className="mt-2 text-sm text-stone-600">
              Cadastre a primeira vitrine da página inicial.
            </p>
          </div>
        )}

        {!isLoading && !loadError && sections.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead className="bg-stone-50">
                  <tr>
                    <th className="px-5 py-4 text-xs font-semibold uppercase text-stone-500">
                      Ordem
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase text-stone-500">
                      Seção
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase text-stone-500">
                      Limite
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase text-stone-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase text-stone-500">
                      Ações
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-stone-200">
                  {sections.map((section, index) => {
                    const isActing = actingSectionId === section.id;

                    return (
                      <tr key={section.id}>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <span className="min-w-6 text-center text-sm font-semibold">
                              {index + 1}
                            </span>

                            <button
                              type="button"
                              onClick={() => void handleMove(section.id, "up")}
                              disabled={isActing || index === 0}
                              className="rounded border border-stone-300 px-2 py-1 disabled:opacity-30"
                            >
                              ↑
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                void handleMove(section.id, "down")
                              }
                              disabled={
                                isActing || index === sections.length - 1
                              }
                              className="rounded border border-stone-300 px-2 py-1 disabled:opacity-30"
                            >
                              ↓
                            </button>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-medium text-stone-950">
                            {section.titulo}
                          </p>

                          <p className="mt-1 text-xs text-stone-500">
                            {section.slug}
                          </p>

                          {section.subtitulo && (
                            <p className="mt-2 max-w-lg text-sm text-stone-600">
                              {section.subtitulo}
                            </p>
                          )}
                        </td>

                        <td className="px-5 py-4 text-sm text-stone-700">
                          {section.limite_produtos}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={[
                              "inline-flex rounded-full px-3 py-1 text-xs font-medium",
                              section.ativa
                                ? "bg-green-100 text-green-800"
                                : "bg-stone-200 text-stone-700",
                            ].join(" ")}
                          >
                            {section.ativa ? "Ativa" : "Inativa"}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex flex-wrap justify-end gap-2">
                            <Link
                              to={`/admin/pagina-inicial/${section.id}/produtos`}
                              className="rounded-lg border border-stone-300 px-3 py-2 text-xs font-medium text-stone-700 hover:bg-stone-100"
                            >
                              Produtos
                            </Link>
                            <button
                              type="button"
                              onClick={() => openEditForm(section)}
                              disabled={isActing}
                              className="rounded-lg border border-stone-300 px-3 py-2 text-xs font-medium"
                            >
                              Editar
                            </button>

                            <button
                              type="button"
                              onClick={() => void handleToggle(section)}
                              disabled={isActing}
                              className="rounded-lg border border-stone-300 px-3 py-2 text-xs font-medium"
                            >
                              {section.ativa ? "Desativar" : "Ativar"}
                            </button>

                            <button
                              type="button"
                              onClick={() => void handleDelete(section)}
                              disabled={isActing}
                              className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-700"
                            >
                              Excluir
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
