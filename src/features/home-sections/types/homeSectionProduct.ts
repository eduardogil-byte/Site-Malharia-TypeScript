import type { ProductStatus } from "../../products/types/product";

export type HomeSectionProductCategory = {
  id: string;
  nome: string;
};

export type HomeSectionProductOption = {
  id: string;
  nome: string;
  slug: string;
  status: ProductStatus;
  disponivel: boolean;
  categoria: HomeSectionProductCategory | null;
};
