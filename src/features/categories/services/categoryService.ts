import type { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "../../../lib/supabase";
import type {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../types/category";

export class CategoryConflictError extends Error {
  constructor() {
    super("Já existe uma categoria com esse nome ou endereço.");

    this.name = "CategoryConflictError";
  }
}

export class CategoryInUseError extends Error {
  constructor() {
    super(
      "Essa categoria possui produtos relacionados e não pode ser excluída.",
    );

    this.name = "CategoryInUseError";
  }
}

export class CategoryPermissionError extends Error {
  constructor() {
    super("Você não possui permissão para realizar essa operação.");

    this.name = "CategoryPermissionError";
  }
}

export class CategoryPersistenceError extends Error {
  constructor(message = "Não foi possível salvar a categoria.") {
    super(message);
    this.name = "CategoryPersistenceError";
  }
}

function mapCategoryError(error: PostgrestError): Error {
  console.error("Erro recebido do Supabase:", error);

  switch (error.code) {
    case "23505":
      return new CategoryConflictError();

    case "23503":
      return new CategoryInUseError();

    case "42501":
      return new CategoryPermissionError();

    case "23514":
    case "22023":
      return new CategoryPersistenceError(
        "Os dados da categoria são inválidos.",
      );

    default:
      return new CategoryPersistenceError();
  }
}

export async function listCategoriesAdmin(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categorias")
    .select("*")
    .order("posicao", {
      ascending: true,
    });

  if (error) {
    throw mapCategoryError(error);
  }

  return data;
}

export async function createCategory(
  input: CreateCategoryInput,
): Promise<Category> {
  const { data, error } = await supabase
    .from("categorias")
    .insert({
      nome: input.nome,
      slug: input.slug,
      descricao: input.descricao,
      ativa: input.ativa,
    })
    .select()
    .single();

  if (error) {
    throw mapCategoryError(error);
  }

  return data;
}

export async function updateCategory(
  categoryId: string,
  input: UpdateCategoryInput,
): Promise<Category> {
  const { data, error } = await supabase
    .from("categorias")
    .update({
      nome: input.nome,
      slug: input.slug,
      descricao: input.descricao,
      ativa: input.ativa,
    })
    .eq("id", categoryId)
    .select()
    .single();

  if (error) {
    throw mapCategoryError(error);
  }

  return data;
}

export async function setCategoryActive(
  categoryId: string,
  active: boolean,
): Promise<Category> {
  const { data, error } = await supabase
    .from("categorias")
    .update({
      ativa: active,
    })
    .eq("id", categoryId)
    .select()
    .single();

  if (error) {
    throw mapCategoryError(error);
  }

  return data;
}

export async function deleteCategory(categoryId: string): Promise<void> {
  const { data, error } = await supabase
    .from("categorias")
    .delete()
    .eq("id", categoryId)
    .select("id")
    .single();

  if (error) {
    throw mapCategoryError(error);
  }

  if (!data) {
    throw new CategoryPersistenceError("A categoria não foi encontrada.");
  }
}

export async function reorderCategories(categoryIds: string[]): Promise<void> {
  const { error } = await supabase.rpc("reordenar_categorias", {
    p_categoria_ids: categoryIds,
  });

  if (error) {
    throw mapCategoryError(error);
  }
}
