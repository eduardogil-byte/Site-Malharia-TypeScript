import { useCallback, useEffect, useState } from "react";
import {
  getSiteSettingsAdmin,
  removeSiteAsset,
  updateSiteSettings,
  uploadSiteAsset,
} from "../services/siteSettingsService";
import type {
  SiteAssetKind,
  SiteSettings,
  SiteSettingsWriteInput,
} from "../types/siteSettings";

export function useAdminSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [loadError, setLoadError] = useState<string | null>(null);

  const loadSettings = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const data = await getSiteSettingsAdmin();

      setSettings(data);
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);

      setLoadError(
        error instanceof Error
          ? error.message
          : "Não foi possível carregar as configurações.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  const saveSettings = useCallback(async (input: SiteSettingsWriteInput) => {
    const updated = await updateSiteSettings(input);

    setSettings(updated);
  }, []);

  const uploadAsset = useCallback(
    async (kind: SiteAssetKind, file: File) => {
      if (!settings) {
        throw new Error("As configurações ainda não foram carregadas.");
      }

      const currentPath =
        kind === "logo" ? settings.logoPath : settings.bannerPath;

      const updated = await uploadSiteAsset(kind, file, currentPath);

      setSettings(updated);
    },
    [settings],
  );

  const deleteAsset = useCallback(
    async (kind: SiteAssetKind) => {
      if (!settings) {
        throw new Error("As configurações ainda não foram carregadas.");
      }

      const currentPath =
        kind === "logo" ? settings.logoPath : settings.bannerPath;

      const updated = await removeSiteAsset(kind, currentPath);

      setSettings(updated);
    },
    [settings],
  );

  return {
    settings,
    isLoading,
    loadError,
    reload: loadSettings,
    saveSettings,
    uploadAsset,
    deleteAsset,
  };
}
