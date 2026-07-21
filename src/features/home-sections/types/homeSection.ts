import type { Database } from "../../../types/database.types";

export type HomeSection = Database["public"]["Tables"]["secoes_home"]["Row"];

export type HomeSectionFormValues = {
  titulo: string;
  subtitulo: string;
  slug: string;
  ativa: boolean;
  limiteProdutos: number;
};

export type HomeSectionWriteInput = {
  titulo: string;
  subtitulo: string | null;
  slug: string;
  ativa: boolean;
  limiteProdutos: number;
};
