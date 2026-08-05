import { describe, expect, it } from "vitest";
import {
  createGeneralWhatsAppUrl,
  createInstagramUrl,
  getInstagramLabel,
} from "./publicContactLinks";

describe("createGeneralWhatsAppUrl", () => {
  it("cria o link com o número e a mensagem", () => {
    const result = createGeneralWhatsAppUrl(
      "5547999999999",
      "Olá! Gostaria de informações.",
    );

    expect(result).not.toBeNull();

    const url = new URL(result!);

    expect(url.origin).toBe("https://wa.me");

    expect(url.pathname).toBe("/5547999999999");

    expect(url.searchParams.get("text")).toBe("Olá! Gostaria de informações.");
  });

  it("remove caracteres não numéricos", () => {
    const result = createGeneralWhatsAppUrl("+55 (47) 99999-9999");

    expect(result).toContain("5547999999999");
  });

  it("retorna null quando o número não existe", () => {
    expect(createGeneralWhatsAppUrl(null)).toBeNull();
  });

  it("retorna null quando o número não possui dígitos", () => {
    expect(createGeneralWhatsAppUrl("telefone")).toBeNull();
  });
});

describe("createInstagramUrl", () => {
  it("cria uma URL usando um usuário com arroba", () => {
    expect(createInstagramUrl("@conexaoearomas")).toBe(
      "https://www.instagram.com/conexaoearomas/",
    );
  });

  it("cria uma URL usando um usuário sem arroba", () => {
    expect(createInstagramUrl("conexaoearomas")).toBe(
      "https://www.instagram.com/conexaoearomas/",
    );
  });

  it("mantém uma URL válida do Instagram", () => {
    const result = createInstagramUrl(
      "https://www.instagram.com/conexaoearomas/",
    );

    expect(result).not.toBeNull();

    const url = new URL(result!);

    expect(url.hostname).toBe("www.instagram.com");

    expect(url.pathname).toBe("/conexaoearomas/");
  });

  it("recusa URLs de outros sites", () => {
    expect(createInstagramUrl("https://site-invalido.com/perfil")).toBeNull();
  });

  it("recusa nomes de usuário inválidos", () => {
    expect(createInstagramUrl("nome com espaços")).toBeNull();
  });

  it("retorna null quando não existe Instagram", () => {
    expect(createInstagramUrl(null)).toBeNull();

    expect(createInstagramUrl("")).toBeNull();
  });
});

describe("getInstagramLabel", () => {
  it("adiciona arroba ao nome do usuário", () => {
    expect(getInstagramLabel("conexaoearomas")).toBe("@conexaoearomas");
  });

  it("não duplica o arroba", () => {
    expect(getInstagramLabel("@conexaoearomas")).toBe("@conexaoearomas");
  });

  it("extrai o usuário de uma URL", () => {
    expect(getInstagramLabel("https://www.instagram.com/conexaoearomas/")).toBe(
      "@conexaoearomas",
    );
  });

  it("usa um texto padrão quando o valor não existe", () => {
    expect(getInstagramLabel(null)).toBe("Instagram");
  });
});
