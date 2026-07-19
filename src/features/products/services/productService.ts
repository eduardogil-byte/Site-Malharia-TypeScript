import type { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "../../../lib/supabase";
import type { ProductListFilters, ProductWithCategory } from "../types/product";

export class ProductPermissionError extends Error {
  constructor() {
    super("Você não possui permissão para acessar os produtos.");

    this.name = "ProductPermissionError";
  }
}

export class ProductPersistenceError extends Error {
  constructor(message = "Não foi possível carregar os produtos.") {
    super(message);
    this.name = "ProductPersistenceError";
  }
}

function mapProductError(error: PostgrestError): Error {
  console.error("Erro recebido do Supabase ao consultar produtos:", error);

  switch (error.code) {
    case "42501":
      return new ProductPermissionError();

    default:
      return new ProductPersistenceError();
  }
}

export async function listProductsAdmin(
  filters: ProductListFilters,
): Promise<ProductWithCategory[]> {
  let query = supabase
    .from("produtos")
    .select(
      `
      *,
      categoria:categorias!produtos_categoria_id_fkey (
        id,
        nome,
        slug
      )
    `,
    )
    .order("updated_at", {
      ascending: false,
    });

  const searchTerm = filters.search.trim();

  if (searchTerm) {
    query = query.ilike("nome", `%${searchTerm}%`);
  }

  if (filters.categoryId) {
    query = query.eq("categoria_id", filters.categoryId);
  }

  if (filters.status) {
    query = query.eq("status", filters.status);
  }

  const { data, error } = await query;

  if (error) {
    throw mapProductError(error);
  }

  return data as ProductWithCategory[];
}
