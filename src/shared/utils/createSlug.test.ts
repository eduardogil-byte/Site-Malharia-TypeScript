import { describe, expect, it } from "vitest";
import { createSlug } from "./createSlug";

describe("createSlug", () => {
  it("converte um texto simples em slug", () => {
    expect(createSlug("Malhas em destaque")).toBe("malhas-em-destaque");
  });

  it("remove acentos", () => {
    expect(createSlug("Conexão e Aromas")).toBe("conexao-e-aromas");
  });

  it("remove espaços no início e no final", () => {
    expect(createSlug("  Produtos artesanais  ")).toBe("produtos-artesanais");
  });

  it("substitui vários espaços por um hífen", () => {
    expect(createSlug("Malha    Floral    Azul")).toBe("malha-floral-azul");
  });

  it("remove caracteres especiais", () => {
    expect(createSlug("Velas, aromas & sabonetes!")).toBe(
      "velas-aromas-sabonetes",
    );
  });

  it("não deixa hífens duplicados", () => {
    expect(createSlug("Produtos --- especiais")).toBe("produtos-especiais");
  });

  it("retorna uma string vazia para um texto vazio", () => {
    expect(createSlug("")).toBe("");
  });
});
