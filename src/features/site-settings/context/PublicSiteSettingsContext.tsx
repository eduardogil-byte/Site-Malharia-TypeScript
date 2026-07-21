import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getPublicSiteSettings } from "../services/siteSettingsService";
import type { SiteSettings } from "../types/siteSettings";

type PublicSiteSettingsContextValue = {
  settings: SiteSettings | null;
  isLoading: boolean;
  loadError: string | null;
  reload: () => Promise<void>;
};

const PublicSiteSettingsContext = createContext<
  PublicSiteSettingsContextValue | undefined
>(undefined);

type PublicSiteSettingsProviderProps = {
  children: ReactNode;
};

export function PublicSiteSettingsProvider({
  children,
}: PublicSiteSettingsProviderProps) {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [loadError, setLoadError] = useState<string | null>(null);

  const loadSettings = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const data = await getPublicSiteSettings();

      setSettings(data);
    } catch (error) {
      console.error("Erro ao carregar configurações públicas:", error);

      setLoadError(
        error instanceof Error
          ? error.message
          : "Não foi possível carregar as informações da marca.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  const contextValue = useMemo<PublicSiteSettingsContextValue>(
    () => ({
      settings,
      isLoading,
      loadError,
      reload: loadSettings,
    }),
    [settings, isLoading, loadError, loadSettings],
  );

  return (
    <PublicSiteSettingsContext.Provider value={contextValue}>
      {children}
    </PublicSiteSettingsContext.Provider>
  );
}

export function usePublicSiteSettings() {
  const context = useContext(PublicSiteSettingsContext);

  if (!context) {
    throw new Error(
      "usePublicSiteSettings deve ser utilizado dentro de PublicSiteSettingsProvider.",
    );
  }

  return context;
}
