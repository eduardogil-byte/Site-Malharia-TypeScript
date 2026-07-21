import { useEffect, useState, type FormEvent } from "react";
import {
  siteSettingsFormSchema,
  type SiteSettingsFormValues,
} from "../schemas/siteSettingsSchema";
import type { SiteSettings } from "../types/siteSettings";

type SiteSettingsFormProps = {
  settings: SiteSettings;
  isSubmitting: boolean;
  onSubmit: (values: SiteSettingsFormValues) => Promise<void>;
};

type FieldErrors = Partial<Record<keyof SiteSettingsFormValues, string>>;

function createInitialValues(settings: SiteSettings): SiteSettingsFormValues {
  return {
    nomeMarca: settings.nomeMarca,
    slogan: settings.slogan ?? "",
    whatsapp: settings.whatsapp ?? "",
    instagram: settings.instagram ?? "",
    email: settings.email ?? "",
    endereco: settings.endereco ?? "",
    textoSobre: settings.textoSobre ?? "",
    textoContato: settings.textoContato ?? "",
  };
}

export function SiteSettingsForm({
  settings,
  isSubmitting,
  onSubmit,
}: SiteSettingsFormProps) {
  const [values, setValues] = useState<SiteSettingsFormValues>(() =>
    createInitialValues(settings),
  );

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  useEffect(() => {
    setValues(createInitialValues(settings));

    setFieldErrors({});
  }, [settings]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationResult = siteSettingsFormSchema.safeParse(values);

    if (!validationResult.success) {
      const nextErrors: FieldErrors = {};

      for (const issue of validationResult.error.issues) {
        const field = issue.path[0];

        if (typeof field === "string") {
          nextErrors[field as keyof SiteSettingsFormValues] = issue.message;
        }
      }

      setFieldErrors(nextErrors);
      return;
    }

    setFieldErrors({});

    await onSubmit(validationResult.data);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <section className="rounded-2xl border border-stone-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-stone-950">
          Identidade da marca
        </h2>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="brand-name"
              className="mb-2 block text-sm font-medium text-stone-700"
            >
              Nome da marca
            </label>

            <input
              id="brand-name"
              value={values.nomeMarca}
              onChange={(event) =>
                setValues((currentValues) => ({
                  ...currentValues,
                  nomeMarca: event.target.value,
                }))
              }
              maxLength={120}
              disabled={isSubmitting}
              className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 disabled:bg-stone-100"
            />

            {fieldErrors.nomeMarca && (
              <p className="mt-2 text-sm text-red-700">
                {fieldErrors.nomeMarca}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="brand-slogan"
              className="mb-2 block text-sm font-medium text-stone-700"
            >
              Slogan
            </label>

            <input
              id="brand-slogan"
              value={values.slogan}
              onChange={(event) =>
                setValues((currentValues) => ({
                  ...currentValues,
                  slogan: event.target.value,
                }))
              }
              maxLength={200}
              disabled={isSubmitting}
              placeholder="Ex.: Feito com carinho para você"
              className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 disabled:bg-stone-100"
            />

            {fieldErrors.slogan && (
              <p className="mt-2 text-sm text-red-700">{fieldErrors.slogan}</p>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-stone-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-stone-950">Contato</h2>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="settings-whatsapp"
              className="mb-2 block text-sm font-medium text-stone-700"
            >
              WhatsApp
            </label>

            <input
              id="settings-whatsapp"
              inputMode="numeric"
              value={values.whatsapp}
              onChange={(event) =>
                setValues((currentValues) => ({
                  ...currentValues,
                  whatsapp: event.target.value.replace(/\D/g, ""),
                }))
              }
              maxLength={15}
              disabled={isSubmitting}
              placeholder="5547999999999"
              className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 disabled:bg-stone-100"
            />

            <p className="mt-2 text-xs text-stone-500">
              Código do país, DDD e número. Utilize somente números.
            </p>

            {fieldErrors.whatsapp && (
              <p className="mt-2 text-sm text-red-700">
                {fieldErrors.whatsapp}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="settings-instagram"
              className="mb-2 block text-sm font-medium text-stone-700"
            >
              Instagram
            </label>

            <input
              id="settings-instagram"
              value={values.instagram}
              onChange={(event) =>
                setValues((currentValues) => ({
                  ...currentValues,
                  instagram: event.target.value,
                }))
              }
              maxLength={200}
              disabled={isSubmitting}
              placeholder="@nomedamarca"
              className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 disabled:bg-stone-100"
            />

            {fieldErrors.instagram && (
              <p className="mt-2 text-sm text-red-700">
                {fieldErrors.instagram}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="settings-email"
              className="mb-2 block text-sm font-medium text-stone-700"
            >
              E-mail
            </label>

            <input
              id="settings-email"
              type="email"
              value={values.email}
              onChange={(event) =>
                setValues((currentValues) => ({
                  ...currentValues,
                  email: event.target.value,
                }))
              }
              maxLength={254}
              disabled={isSubmitting}
              className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 disabled:bg-stone-100"
            />

            {fieldErrors.email && (
              <p className="mt-2 text-sm text-red-700">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="settings-address"
              className="mb-2 block text-sm font-medium text-stone-700"
            >
              Endereço
            </label>

            <textarea
              id="settings-address"
              value={values.endereco}
              onChange={(event) =>
                setValues((currentValues) => ({
                  ...currentValues,
                  endereco: event.target.value,
                }))
              }
              rows={3}
              maxLength={500}
              disabled={isSubmitting}
              className="w-full resize-y rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 disabled:bg-stone-100"
            />

            {fieldErrors.endereco && (
              <p className="mt-2 text-sm text-red-700">
                {fieldErrors.endereco}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-stone-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-stone-950">
          Textos institucionais
        </h2>

        <div className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="settings-about"
              className="mb-2 block text-sm font-medium text-stone-700"
            >
              Texto da página Sobre
            </label>

            <textarea
              id="settings-about"
              value={values.textoSobre}
              onChange={(event) =>
                setValues((currentValues) => ({
                  ...currentValues,
                  textoSobre: event.target.value,
                }))
              }
              rows={8}
              maxLength={5000}
              disabled={isSubmitting}
              className="w-full resize-y rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 disabled:bg-stone-100"
            />

            <p className="mt-2 text-right text-xs text-stone-500">
              {values.textoSobre.length}/5000
            </p>

            {fieldErrors.textoSobre && (
              <p className="mt-2 text-sm text-red-700">
                {fieldErrors.textoSobre}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="settings-contact-text"
              className="mb-2 block text-sm font-medium text-stone-700"
            >
              Texto da página Contato
            </label>

            <textarea
              id="settings-contact-text"
              value={values.textoContato}
              onChange={(event) =>
                setValues((currentValues) => ({
                  ...currentValues,
                  textoContato: event.target.value,
                }))
              }
              rows={5}
              maxLength={2000}
              disabled={isSubmitting}
              className="w-full resize-y rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 disabled:bg-stone-100"
            />

            <p className="mt-2 text-right text-xs text-stone-500">
              {values.textoContato.length}/2000
            </p>

            {fieldErrors.textoContato && (
              <p className="mt-2 text-sm text-red-700">
                {fieldErrors.textoContato}
              </p>
            )}
          </div>
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-stone-900 px-5 py-3 text-sm font-medium text-white hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Salvando..." : "Salvar configurações"}
        </button>
      </div>
    </form>
  );
}
