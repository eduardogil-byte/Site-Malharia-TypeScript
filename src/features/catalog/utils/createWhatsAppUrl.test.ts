import { describe, expect, it } from "vitest";
import { createWhatsAppUrl } from "./createWhatsAppUrl";

describe("createWhatsAppUrl", () => {
  it("cria um link com os dados do produto", () => {
    const result = createWhatsAppUrl({
      phoneNumber: "5547999999999",
      productName: "Malha Floral",
      customMessage: "Olá! Tenho interesse neste produto.",
      productUrl: "https://exemplo.com/produto/malha-floral",
    });

    const url = new URL(result);

    expect(url.origin).toBe("https://wa.me");

    expect(url.pathname).toBe("/5547999999999");

    const message = url.searchParams.get("text");

    expect(message).toContain("Olá! Tenho interesse neste produto.");

    expect(message).toContain("Malha Floral");

    expect(message).toContain("https://exemplo.com/produto/malha-floral");
  });

  it("remove a formatação do telefone", () => {
    const result = createWhatsAppUrl({
      phoneNumber: "+55 (47) 99999-9999",
      productName: "Vela artesanal",
      customMessage: null,
      productUrl: "https://exemplo.com/produto/vela",
    });

    expect(result).toContain("wa.me/5547999999999");
  });

  it("utiliza uma mensagem padrão quando não existe mensagem personalizada", () => {
    const result = createWhatsAppUrl({
      phoneNumber: "5547999999999",
      productName: "Sabonete artesanal",
      customMessage: null,
      productUrl: "https://exemplo.com/produto/sabonete",
    });

    const url = new URL(result);

    const message = url.searchParams.get("text");

    expect(message).toContain("Sabonete artesanal");

    expect(message).toContain("https://exemplo.com/produto/sabonete");
  });
});
