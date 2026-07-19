import { useEffect, useState, type FormEvent } from "react";
import {
  categoryFormSchema,
  type ValidatedCategoryFormValues,
} from "../schemas/categorySchema";
import type { Category, CategoryFormValues } from "../types/category";
import { createSlug } from "../../../shared/utils/createSlug";

type CategoryFormProps = {
  category?: Category | null;
  isSubmitting: boolean;
  onSubmit: (values: ValidatedCategoryFormValues) => Promise<void>;
  onCancel: () => void;
};

type FieldErrors = Partial<Record<keyof CategoryFormValues, string>>;

const emptyValues: CategoryFormValues = {
  nome: "",
  slug: "",
  descricao: "",
  ativa: true,
};

export function CategoryForm({
  category,
  isSubmitting,
  onSubmit,
  onCancel,
}: CategoryFormProps) {
  const [values, setValues] = useState<CategoryFormValues>(emptyValues);

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const [slugWasEdited, setSlugWasEdited] = useState(false);

  useEffect(() => {
    if (category) {
      setValues({
        nome: category.nome,
        slug: category.slug,
        descricao: category.descricao ?? "",
        ativa: category.ativa,
      });

      setSlugWasEdited(true);
    } else {
      setValues(emptyValues);
      setSlugWasEdited(false);
    }

    setFieldErrors({});
  }, [category]);

  function handleNameChange(nextName: string) {
    setValues((currentValues) => ({
      ...currentValues,
      nome: nextName,
      slug: slugWasEdited ? currentValues.slug : createSlug(nextName),
    }));
  }

  function handleSlugChange(nextSlug: string) {
    setSlugWasEdited(true);

    setValues((currentValues) => ({
      ...currentValues,
      slug: createSlug(nextSlug),
    }));
  }

  function regenerateSlug() {
    setValues((currentValues) => ({
      ...currentValues,
      slug: createSlug(currentValues.nome),
    }));

    setSlugWasEdited(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationResult = categoryFormSchema.safeParse(values);

    if (!validationResult.success) {
      const nextErrors: FieldErrors = {};

      for (const issue of validationResult.error.issues) {
        const field = issue.path[0];

        if (typeof field === "string" && field in values) {
          nextErrors[field as keyof CategoryFormValues] = issue.message;
        }
      }

      setFieldErrors(nextErrors);
      return;
    }

    setFieldErrors({});

    await onSubmit(validationResult.data);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-stone-200 bg-white p-6"
      noValidate
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-stone-950">
            {category ? "Editar categoria" : "Nova categoria"}
          </h2>

          <p className="mt-1 text-sm text-stone-600">
            Defina como os produtos serão agrupados no catálogo.
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="text-sm font-medium text-stone-500 hover:text-stone-900 disabled:opacity-50"
        >
          Fechar
        </button>
      </div>

      <div className="mt-6 grid gap-5">
        <div>
          <label
            htmlFor="category-name"
            className="mb-2 block text-sm font-medium text-stone-700"
          >
            Nome
          </label>

          <input
            id="category-name"
            value={values.nome}
            onChange={(event) => handleNameChange(event.target.value)}
            maxLength={100}
            disabled={isSubmitting}
            aria-invalid={Boolean(fieldErrors.nome)}
            className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 disabled:bg-stone-100"
            placeholder="Ex.: Malhas"
          />

          {fieldErrors.nome && (
            <p className="mt-2 text-sm text-red-700">{fieldErrors.nome}</p>
          )}
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-4">
            <label
              htmlFor="category-slug"
              className="block text-sm font-medium text-stone-700"
            >
              Endereço da categoria
            </label>

            <button
              type="button"
              onClick={regenerateSlug}
              disabled={isSubmitting || values.nome.length === 0}
              className="text-xs font-medium text-stone-600 hover:text-stone-950 disabled:opacity-50"
            >
              Gerar novamente
            </button>
          </div>

          <input
            id="category-slug"
            value={values.slug}
            onChange={(event) => handleSlugChange(event.target.value)}
            maxLength={120}
            disabled={isSubmitting}
            aria-invalid={Boolean(fieldErrors.slug)}
            className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 disabled:bg-stone-100"
            placeholder="malhas"
          />

          <p className="mt-2 text-xs text-stone-500">
            Exemplo: /catalogo/{values.slug || "malhas"}
          </p>

          {fieldErrors.slug && (
            <p className="mt-2 text-sm text-red-700">{fieldErrors.slug}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="category-description"
            className="mb-2 block text-sm font-medium text-stone-700"
          >
            Descrição
          </label>

          <textarea
            id="category-description"
            value={values.descricao}
            onChange={(event) =>
              setValues((currentValues) => ({
                ...currentValues,
                descricao: event.target.value,
              }))
            }
            maxLength={500}
            rows={4}
            disabled={isSubmitting}
            aria-invalid={Boolean(fieldErrors.descricao)}
            className="w-full resize-y rounded-lg border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 disabled:bg-stone-100"
            placeholder="Descrição opcional da categoria."
          />

          <div className="mt-2 flex justify-between gap-4">
            <div>
              {fieldErrors.descricao && (
                <p className="text-sm text-red-700">{fieldErrors.descricao}</p>
              )}
            </div>

            <p className="text-xs text-stone-500">
              {values.descricao.length}/500
            </p>
          </div>
        </div>

        <label className="flex items-center gap-3 rounded-lg border border-stone-200 p-4">
          <input
            type="checkbox"
            checked={values.ativa}
            onChange={(event) =>
              setValues((currentValues) => ({
                ...currentValues,
                ativa: event.target.checked,
              }))
            }
            disabled={isSubmitting}
            className="size-4 rounded border-stone-300"
          />

          <span>
            <span className="block text-sm font-medium text-stone-900">
              Categoria ativa
            </span>

            <span className="block text-xs text-stone-500">
              Categorias inativas não aparecem para os visitantes.
            </span>
          </span>
        </label>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 disabled:opacity-50"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? "Salvando..."
            : category
              ? "Salvar alterações"
              : "Cadastrar categoria"}
        </button>
      </div>
    </form>
  );
}
