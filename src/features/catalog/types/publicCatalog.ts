import type { Json } from "../../../types/database.types";

export type PublicCategory = {
  id: string;
  nome: string;
  slug: string;
  descricao: string | null;
  posicao: number;
};

export type PublicProductImage = {
  id: string;
  storagePath: string;
  altText: string | null;
  posicao: number;
  publicUrl: string;
};

export type PublicProductCategory = {
  id: string;
  nome: string;
  slug: string;
};

export type PublicProduct = {
  id: string;
  categoriaId: string;
  nome: string;
  slug: string;
  descricaoCurta: string | null;
  descricao: string | null;
  disponivel: boolean;
  atributos: Json;
  mensagemWhatsapp: string | null;
  categoria: PublicProductCategory | null;
  imagens: PublicProductImage[];
};

export type PublicCatalogFilters = {
  search: string;
  categoryId: string;
};
