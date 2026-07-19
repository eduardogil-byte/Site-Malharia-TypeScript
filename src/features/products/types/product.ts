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
