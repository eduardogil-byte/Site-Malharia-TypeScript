import { z } from "zod";

export const siteSettingsFormSchema = z.object({
  nomeMarca: z
    .string()
    .trim()
    .min(2, "O nome da marca deve possuir pelo menos 2 caracteres.")
    .max(120, "O nome da marca deve possuir no máximo 120 caracteres."),

  slogan: z
    .string()
    .trim()
    .max(200, "O slogan deve possuir no máximo 200 caracteres."),

  whatsapp: z
    .string()
    .trim()
    .max(15, "O WhatsApp deve possuir no máximo 15 números.")
    .refine(
      (value) => value === "" || /^\d{10,15}$/.test(value),
      "Informe o código do país, DDD e número, utilizando somente números.",
    ),

  instagram: z
    .string()
    .trim()
    .max(200, "O Instagram deve possuir no máximo 200 caracteres."),

  email: z
    .string()
    .trim()
    .max(254, "O e-mail deve possuir no máximo 254 caracteres.")
    .refine(
      (value) => value === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      "Informe um endereço de e-mail válido.",
    ),

  endereco: z
    .string()
    .trim()
    .max(500, "O endereço deve possuir no máximo 500 caracteres."),

  textoSobre: z
    .string()
    .trim()
    .max(5000, "O texto deve possuir no máximo 5000 caracteres."),

  textoContato: z
    .string()
    .trim()
    .max(2000, "O texto deve possuir no máximo 2000 caracteres."),
});

export type SiteSettingsFormValues = z.infer<typeof siteSettingsFormSchema>;
