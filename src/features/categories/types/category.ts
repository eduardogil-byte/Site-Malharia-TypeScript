import type { Database } from "../../../types/database.types";

export type Category = Database["public"]["Tables"]["categorias"]["Row"];

export type CategoryFormValues = {
  nome: string;
  slug: string;
  descricao: string;
  ativa: boolean;
};

export type CreateCategoryInput = {
  nome: string;
  slug: string;
  descricao: string | null;
  ativa: boolean;
};

export type UpdateCategoryInput = CreateCategoryInput;
