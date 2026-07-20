import type { Database } from "../../../types/database.types";

export type ProductImageRow =
  Database["public"]["Tables"]["produto_imagens"]["Row"];

export type ProductImage = ProductImageRow & {
  publicUrl: string;
};
