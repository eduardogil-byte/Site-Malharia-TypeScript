import { describe, expect, it } from "vitest";
import { siteSettingsFormSchema } from "./siteSettingsSchema";

const validSettings = {
  nomeMarca: "Conexão e Aromas",
  slogan: "Produtos feitos com carinho",
  whatsapp: "5547999999999",
  instagram: "@conexaoearomas",
  email: "contato@conexaoearomas.com.br",
  endereco: "Rua de exemplo, 100",
  textoSobre: "Texto institucional da marca.",
  textoContato: "Entre em contato conosco.",
};

describe("siteSettingsFormSchema", () => {
  it("aceita configurações válidas", () => {
    const result = siteSettingsFormSchema.safeParse(validSettings);

    expect(result.success).toBe(true);
  });

  it("recusa um nome de marca muito curto", () => {
    const result = siteSettingsFormSchema.safeParse({
      ...validSettings,
      nomeMarca: "A",
    });

    expect(result.success).toBe(false);
  });

  it("aceita campos opcionais vazios", () => {
    const result = siteSettingsFormSchema.safeParse({
      ...validSettings,
      slogan: "",
      whatsapp: "",
      instagram: "",
      email: "",
      endereco: "",
      textoSobre: "",
      textoContato: "",
    });

    expect(result.success).toBe(true);
  });

  it("recusa WhatsApp com letras", () => {
    const result = siteSettingsFormSchema.safeParse({
      ...validSettings,
      whatsapp: "55telefone",
    });

    expect(result.success).toBe(false);
  });

  it("recusa WhatsApp sem quantidade suficiente de números", () => {
    const result = siteSettingsFormSchema.safeParse({
      ...validSettings,
      whatsapp: "123",
    });

    expect(result.success).toBe(false);
  });

  it("recusa e-mail inválido", () => {
    const result = siteSettingsFormSchema.safeParse({
      ...validSettings,
      email: "email-invalido",
    });

    expect(result.success).toBe(false);
  });

  it("recusa um texto Sobre acima do limite", () => {
    const result = siteSettingsFormSchema.safeParse({
      ...validSettings,
      textoSobre: "a".repeat(5001),
    });

    expect(result.success).toBe(false);
  });
});
