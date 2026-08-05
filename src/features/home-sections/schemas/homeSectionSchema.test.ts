import { describe, expect, it } from "vitest";
import { homeSectionFormSchema } from "./homeSectionSchema";

const validSection = {
  titulo: "Malhas em destaque",
  subtitulo: "Confira algumas opções selecionadas.",
  slug: "malhas-em-destaque",
  ativa: true,
  limiteProdutos: 4,
};

describe("homeSectionFormSchema", () => {
  it("aceita uma seção válida", () => {
    const result = homeSectionFormSchema.safeParse(validSection);

    expect(result.success).toBe(true);
  });

  it("recusa um título muito curto", () => {
    const result = homeSectionFormSchema.safeParse({
      ...validSection,
      titulo: "A",
    });

    expect(result.success).toBe(false);
  });

  it("aceita subtítulo vazio", () => {
    const result = homeSectionFormSchema.safeParse({
      ...validSection,
      subtitulo: "",
    });

    expect(result.success).toBe(true);
  });

  it("recusa slug com letras maiúsculas", () => {
    const result = homeSectionFormSchema.safeParse({
      ...validSection,
      slug: "Malhas-Em-Destaque",
    });

    expect(result.success).toBe(false);
  });

  it("recusa slug com espaços", () => {
    const result = homeSectionFormSchema.safeParse({
      ...validSection,
      slug: "malhas em destaque",
    });

    expect(result.success).toBe(false);
  });

  it("recusa limite igual a zero", () => {
    const result = homeSectionFormSchema.safeParse({
      ...validSection,
      limiteProdutos: 0,
    });

    expect(result.success).toBe(false);
  });

  it("recusa limite acima de vinte", () => {
    const result = homeSectionFormSchema.safeParse({
      ...validSection,
      limiteProdutos: 21,
    });

    expect(result.success).toBe(false);
  });

  it("recusa limite decimal", () => {
    const result = homeSectionFormSchema.safeParse({
      ...validSection,
      limiteProdutos: 4.5,
    });

    expect(result.success).toBe(false);
  });
});
