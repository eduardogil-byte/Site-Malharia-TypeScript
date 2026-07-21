import type { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "../../../lib/supabase";
import type { HomeSectionProductOption } from "../types/homeSectionProduct";

export class HomeSectionProductError extends Error {
  constructor(message = "Não foi possível gerenciar os produtos da seção.") {
    super(message);
    this.name = "HomeSectionProductError";
  }
}

function mapHomeSectionProductError(error: PostgrestError): Error {
  console.error("Erro ao gerenciar produtos da seção:", error);

  switch (error.code) {
    case "42501":
      return new HomeSectionProductError(
        "Você não possui permissão para alterar esta seção.",
      );

    case "P0002":
      return new HomeSectionProductError("A seção não foi encontrada.");

    case "22023":
      return new HomeSectionProductError(
        error.message || "A configuração da seção é inválida.",
      );

    default:
      return new HomeSectionProductError();
  }
}

export async function listProductsForHomeSection(): Promise<
  HomeSectionProductOption[]
> {
  const { data, error } = await supabase
    .from("produtos")
    .select(
      `
      id,
      nome,
      slug,
      status,
      disponivel,
      categoria:categorias!produtos_categoria_id_fkey (
        id,
        nome
      )
    `,
    )
    .order("nome", {
      ascending: true,
    });

  if (error) {
    throw mapHomeSectionProductError(error);
  }

  return data as unknown as HomeSectionProductOption[];
}

export async function listHomeSectionProductIds(
  sectionId: string,
): Promise<string[]> {
  const { data, error } = await supabase
    .from("home_secao_produtos")
    .select(
      `
      produto_id,
      posicao
    `,
    )
    .eq("secao_id", sectionId)
    .order("posicao", {
      ascending: true,
    });

  if (error) {
    throw mapHomeSectionProductError(error);
  }

  return data.map((item) => item.produto_id);
}

export async function saveHomeSectionProducts(
  sectionId: string,
  productIds: string[],
): Promise<void> {
  const { error } = await supabase.rpc("salvar_produtos_secao_home", {
    p_secao_id: sectionId,
    p_produto_ids: productIds,
  });

  if (error) {
    throw mapHomeSectionProductError(error);
  }
}
