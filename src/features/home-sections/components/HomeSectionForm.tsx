import { useEffect, useState, type FormEvent } from "react";
import { createSlug } from "../../../shared/utils/createSlug";
import {
  homeSectionFormSchema,
  type ValidatedHomeSectionFormValues,
} from "../schemas/homeSectionSchema";
import type { HomeSection, HomeSectionFormValues } from "../types/homeSection";

type HomeSectionFormProps = {
  section?: HomeSection | null;
  isSubmitting: boolean;
  onSubmit: (values: ValidatedHomeSectionFormValues) => Promise<void>;
  onCancel: () => void;
};

type FieldErrors = Partial<Record<keyof HomeSectionFormValues, string>>;

const emptyValues: HomeSectionFormValues = {
  titulo: "",
  subtitulo: "",
  slug: "",
  ativa: true,
  limiteProdutos: 4,
};

export function HomeSectionForm({
  section,
  isSubmitting,
  onSubmit,
  onCancel,
}: HomeSectionFormProps) {
  const [values, setValues] = useState<HomeSectionFormValues>(emptyValues);

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const [slugWasEdited, setSlugWasEdited] = useState(false);

  useEffect(() => {
    if (section) {
      setValues({
        titulo: section.titulo,
        subtitulo: section.subtitulo ?? "",
        slug: section.slug,
        ativa: section.ativa,
        limiteProdutos: section.limite_produtos,
      });

      setSlugWasEdited(true);
    } else {
      setValues(emptyValues);
      setSlugWasEdited(false);
    }

    setFieldErrors({});
  }, [section]);

  function handleTitleChange(nextTitle: string) {
    setValues((currentValues) => ({
      ...currentValues,
      titulo: nextTitle,
      slug: slugWasEdited ? currentValues.slug : createSlug(nextTitle),
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
      slug: createSlug(currentValues.titulo),
    }));

    setSlugWasEdited(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationResult = homeSectionFormSchema.safeParse(values);

    if (!validationResult.success) {
      const nextErrors: FieldErrors = {};

      for (const issue of validationResult.error.issues) {
        const field = issue.path[0];

        if (typeof field === "string" && field in values) {
          nextErrors[field as keyof HomeSectionFormValues] = issue.message;
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
      noValidate
      className="rounded-2xl border border-stone-200 bg-white p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-stone-950">
            {section ? "Editar seção" : "Nova seção"}
          </h2>

          <p className="mt-1 text-sm text-stone-600">
            Configure uma vitrine de produtos para a página inicial.
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

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div>
          <label
            htmlFor="home-section-title"
            className="mb-2 block text-sm font-medium text-stone-700"
          >
            Título
          </label>

          <input
            id="home-section-title"
            value={values.titulo}
            onChange={(event) => handleTitleChange(event.target.value)}
            maxLength={150}
            disabled={isSubmitting}
            placeholder="Ex.: Malhas em destaque"
            className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 disabled:bg-stone-100"
          />

          {fieldErrors.titulo && (
            <p className="mt-2 text-sm text-red-700">{fieldErrors.titulo}</p>
          )}
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-4">
            <label
              htmlFor="home-section-slug"
              className="block text-sm font-medium text-stone-700"
            >
              Identificador
            </label>

            <button
              type="button"
              onClick={regenerateSlug}
              disabled={isSubmitting || !values.titulo}
              className="text-xs font-medium text-stone-600 hover:text-stone-950 disabled:opacity-50"
            >
              Gerar novamente
            </button>
          </div>

          <input
            id="home-section-slug"
            value={values.slug}
            onChange={(event) => handleSlugChange(event.target.value)}
            maxLength={150}
            disabled={isSubmitting}
            placeholder="malhas-em-destaque"
            className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 disabled:bg-stone-100"
          />

          {fieldErrors.slug && (
            <p className="mt-2 text-sm text-red-700">{fieldErrors.slug}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="home-section-subtitle"
            className="mb-2 block text-sm font-medium text-stone-700"
          >
            Subtítulo
          </label>

          <textarea
            id="home-section-subtitle"
            value={values.subtitulo}
            onChange={(event) =>
              setValues((currentValues) => ({
                ...currentValues,
                subtitulo: event.target.value,
              }))
            }
            rows={3}
            maxLength={300}
            disabled={isSubmitting}
            placeholder="Uma pequena descrição para a seção."
            className="w-full resize-y rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 disabled:bg-stone-100"
          />

          <p className="mt-2 text-right text-xs text-stone-500">
            {values.subtitulo.length}/300
          </p>

          {fieldErrors.subtitulo && (
            <p className="mt-2 text-sm text-red-700">{fieldErrors.subtitulo}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="home-section-limit"
            className="mb-2 block text-sm font-medium text-stone-700"
          >
            Limite de produtos
          </label>

          <input
            id="home-section-limit"
            type="number"
            min={1}
            max={20}
            value={values.limiteProdutos}
            onChange={(event) =>
              setValues((currentValues) => ({
                ...currentValues,
                limiteProdutos: event.target.valueAsNumber,
              }))
            }
            disabled={isSubmitting}
            className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 disabled:bg-stone-100"
          />

          {fieldErrors.limiteProdutos && (
            <p className="mt-2 text-sm text-red-700">
              {fieldErrors.limiteProdutos}
            </p>
          )}
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
              Seção ativa
            </span>

            <span className="block text-xs text-stone-500">
              Somente seções ativas aparecerão no site.
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
            : section
              ? "Salvar alterações"
              : "Cadastrar seção"}
        </button>
      </div>
    </form>
  );
}
