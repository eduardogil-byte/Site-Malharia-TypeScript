import type { Database } from "../../../types/database.types";

export type SiteSettingsRow =
  Database["public"]["Tables"]["configuracoes_site"]["Row"];

export type SiteSettings = {
  id: number;
  nomeMarca: string;
  slogan: string | null;
  whatsapp: string | null;
  instagram: string | null;
  email: string | null;
  endereco: string | null;
  textoSobre: string | null;
  textoContato: string | null;
  logoPath: string | null;
  bannerPath: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  updatedAt: string;
};

export type PublicSiteSettings = SiteSettings;

export type SiteSettingsWriteInput = {
  nomeMarca: string;
  slogan: string | null;
  whatsapp: string | null;
  instagram: string | null;
  email: string | null;
  endereco: string | null;
  textoSobre: string | null;
  textoContato: string | null;
};

export type SiteAssetKind = "logo" | "banner";
