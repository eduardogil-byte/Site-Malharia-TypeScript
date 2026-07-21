import { useState } from "react";
import { SiteAssetCard } from "../../features/site-settings/components/SiteAssetCard";
import { SiteSettingsForm } from "../../features/site-settings/components/SiteSettingsForm";
import { useAdminSiteSettings } from "../../features/site-settings/hooks/useAdminSiteSettings";
import type { SiteSettingsFormValues } from "../../features/site-settings/schemas/siteSettingsSchema";
import type { SiteAssetKind } from "../../features/site-settings/types/siteSettings";

export function SiteSettingsPage() {
  const {
    settings,
    isLoading,
    loadError,
    reload,
    saveSettings,
    uploadAsset,
    deleteAsset,
  } = useAdminSiteSettings();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [assetAction, setAssetAction] = useState<SiteAssetKind | null>(null);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [actionError, setActionError] = useState<string | null>(null);

  function clearMessages() {
    setSuccessMessage(null);
    setActionError(null);
  }

  async function handleSubmit(values: SiteSettingsFormValues) {
    clearMessages();
    setIsSubmitting(true);

    try {
      await saveSettings({
        nomeMarca: values.nomeMarca,
        slogan: values.slogan || null,
        whatsapp: values.whatsapp || null,
        instagram: values.instagram || null,
        email: values.email || null,
        endereco: values.endereco || null,
        textoSobre: values.textoSobre || null,
        textoContato: values.textoContato || null,
      });

      setSuccessMessage("Configurações salvas com sucesso.");
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Não foi possível salvar as configurações.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpload(kind: SiteAssetKind, file: File) {
    clearMessages();
    setAssetAction(kind);

    try {
      await uploadAsset(kind, file);

      setSuccessMessage(
        kind === "logo"
          ? "Logo atualizada com sucesso."
          : "Banner atualizado com sucesso.",
      );
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Não foi possível enviar a imagem.",
      );

      throw error;
    } finally {
      setAssetAction(null);
    }
  }

  async function handleRemove(kind: SiteAssetKind) {
    const confirmed = window.confirm(
      kind === "logo"
        ? "Deseja remover a logo atual?"
        : "Deseja remover o banner atual?",
    );

    if (!confirmed) {
      return;
    }

    clearMessages();
    setAssetAction(kind);

    try {
      await deleteAsset(kind);

      setSuccessMessage(
        kind === "logo" ? "Logo removida." : "Banner removido.",
      );
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Não foi possível remover a imagem.",
      );
    } finally {
      setAssetAction(null);
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-stone-200 bg-white p-12 text-center text-stone-600">
        Carregando configurações...
      </div>
    );
  }

  if (loadError || !settings) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
        <p className="text-sm text-red-800">
          {loadError ?? "As configurações não foram encontradas."}
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

  const anyAssetAction = assetAction !== null;

  return (
    <section>
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
          Administração
        </p>

        <h1 className="mt-2 text-3xl font-semibold text-stone-950">
          Configurações
        </h1>

        <p className="mt-3 max-w-2xl text-stone-600">
          Configure a identidade, os contatos e os textos institucionais do
          site.
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

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <SiteAssetCard
          title="Logo da marca"
          description="Será utilizada no cabeçalho e em outros elementos de identificação do site."
          imageUrl={settings.logoUrl}
          isBusy={assetAction === "logo"}
          disabled={isSubmitting || anyAssetAction}
          onUpload={(file) => handleUpload("logo", file)}
          onRemove={() => handleRemove("logo")}
        />

        <SiteAssetCard
          title="Banner principal"
          description="Será utilizado como imagem de destaque na página inicial."
          imageUrl={settings.bannerUrl}
          isBusy={assetAction === "banner"}
          disabled={isSubmitting || anyAssetAction}
          onUpload={(file) => handleUpload("banner", file)}
          onRemove={() => handleRemove("banner")}
        />
      </div>

      <div className="mt-8">
        <SiteSettingsForm
          settings={settings}
          isSubmitting={isSubmitting || anyAssetAction}
          onSubmit={handleSubmit}
        />
      </div>
    </section>
  );
}
