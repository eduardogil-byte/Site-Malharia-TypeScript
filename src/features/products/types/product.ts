import type { Database } from "../../../types/database.types";

export const PRODUCT_STATUS_VALUES = [
  "rascunho",
  "publicado",
  "arquivado",
] as const;

export type ProductStatus = (typeof PRODUCT_STATUS_VALUES)[number];

export type Product = Database["public"]["Tables"]["produtos"]["Row"];

export type ProductCategorySummary = {
  id: string;
  nome: string;
  slug: string;
};

export type ProductWithCategory = Product & {
  categoria: ProductCategorySummary | null;
};

export type ProductListFilters = {
  search: string;
  categoryId: string;
  status: ProductStatus | "";
};

export type ProductAttributeField = {
  id: string;
  chave: string;
  valor: string;
};

export type ProductWriteInput = {
  categoriaId: string;
  nome: string;
  slug: string;
  descricaoCurta: string | null;
  descricao: string | null;
  status: ProductStatus;
  disponivel: boolean;
  atributos: Record<string, string>;
  mensagemWhatsapp: string | null;
};
