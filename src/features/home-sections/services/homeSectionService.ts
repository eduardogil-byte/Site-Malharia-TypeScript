import type { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "../../../lib/supabase";
import type { HomeSection, HomeSectionWriteInput } from "../types/homeSection";

export class HomeSectionConflictError extends Error {
  constructor() {
    super("Já existe uma seção com esse identificador ou posição.");

    this.name = "HomeSectionConflictError";
  }
}

export class HomeSectionPermissionError extends Error {
  constructor() {
    super("Você não possui permissão para gerenciar as seções.");

    this.name = "HomeSectionPermissionError";
  }
}

export class HomeSectionNotFoundError extends Error {
  constructor() {
    super("A seção não foi encontrada.");
    this.name = "HomeSectionNotFoundError";
  }
}

export class HomeSectionPersistenceError extends Error {
  constructor(message = "Não foi possível realizar a operação com a seção.") {
    super(message);
    this.name = "HomeSectionPersistenceError";
  }
}

function mapHomeSectionError(error: PostgrestError): Error {
  console.error("Erro recebido do Supabase ao manipular seção:", error);

  switch (error.code) {
    case "23505":
      return new HomeSectionConflictError();

    case "42501":
      return new HomeSectionPermissionError();

    case "P0002":
      return new HomeSectionNotFoundError();

    case "22023":
    case "23514":
      return new HomeSectionPersistenceError(
        error.message || "Os dados da seção são inválidos.",
      );

    default:
      return new HomeSectionPersistenceError();
  }
}

function createHomeSectionPayload(input: HomeSectionWriteInput) {
  return {
    titulo: input.titulo,
    subtitulo: input.subtitulo,
    slug: input.slug,
    ativa: input.ativa,
    limite_produtos: input.limiteProdutos,
  };
}

export async function listHomeSectionsAdmin(): Promise<HomeSection[]> {
  const { data, error } = await supabase
    .from("secoes_home")
    .select("*")
    .order("posicao", {
      ascending: true,
    });

  if (error) {
    throw mapHomeSectionError(error);
  }

  return data;
}

export async function createHomeSection(
  input: HomeSectionWriteInput,
): Promise<HomeSection> {
  const { data, error } = await supabase
    .from("secoes_home")
    .insert(createHomeSectionPayload(input))
    .select("*")
    .single();

  if (error) {
    throw mapHomeSectionError(error);
  }

  return data;
}

export async function updateHomeSection(
  sectionId: string,
  input: HomeSectionWriteInput,
): Promise<HomeSection> {
  const { data, error } = await supabase
    .from("secoes_home")
    .update(createHomeSectionPayload(input))
    .eq("id", sectionId)
    .select("*")
    .single();

  if (error) {
    throw mapHomeSectionError(error);
  }

  return data;
}

export async function setHomeSectionActive(
  sectionId: string,
  active: boolean,
): Promise<HomeSection> {
  const { data, error } = await supabase
    .from("secoes_home")
    .update({
      ativa: active,
    })
    .eq("id", sectionId)
    .select("*")
    .single();

  if (error) {
    throw mapHomeSectionError(error);
  }

  return data;
}

export async function deleteHomeSection(sectionId: string): Promise<void> {
  const { data, error } = await supabase
    .from("secoes_home")
    .delete()
    .eq("id", sectionId)
    .select("id")
    .maybeSingle();

  if (error) {
    throw mapHomeSectionError(error);
  }

  if (!data) {
    throw new HomeSectionNotFoundError();
  }
}

export async function reorderHomeSections(sectionIds: string[]): Promise<void> {
  const { error } = await supabase.rpc("reordenar_secoes_home", {
    p_secao_ids: sectionIds,
  });

  if (error) {
    throw mapHomeSectionError(error);
  }
}
