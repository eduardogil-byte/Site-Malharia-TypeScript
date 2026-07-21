import type { PublicProduct } from "../../catalog/types/publicCatalog";

export type PublicHomeSection = {
  id: string;
  titulo: string;
  subtitulo: string | null;
  slug: string;
  posicao: number;
  limiteProdutos: number;
  produtos: PublicProduct[];
};
