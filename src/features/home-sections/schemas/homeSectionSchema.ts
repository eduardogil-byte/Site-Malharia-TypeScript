import { z } from "zod";

export const homeSectionFormSchema = z.object({
  titulo: z
    .string()
    .trim()
    .min(2, "O título deve possuir pelo menos 2 caracteres.")
    .max(150, "O título deve possuir no máximo 150 caracteres."),

  subtitulo: z
    .string()
    .trim()
    .max(300, "O subtítulo deve possuir no máximo 300 caracteres."),

  slug: z
    .string()
    .trim()
    .min(2, "O identificador deve possuir pelo menos 2 caracteres.")
    .max(150, "O identificador deve possuir no máximo 150 caracteres.")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use somente letras minúsculas, números e hífens.",
    ),

  ativa: z.boolean(),

  limiteProdutos: z
    .number({
      error: "Informe um limite válido.",
    })
    .int("O limite deve ser um número inteiro.")
    .min(1, "A seção deve permitir pelo menos 1 produto.")
    .max(20, "A seção pode permitir no máximo 20 produtos."),
});

export type ValidatedHomeSectionFormValues = z.infer<
  typeof homeSectionFormSchema
>;
