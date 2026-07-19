import { z } from "zod";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const categoryFormSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(2, "O nome deve possuir pelo menos 2 caracteres.")
    .max(100, "O nome deve possuir no máximo 100 caracteres."),

  slug: z
    .string()
    .trim()
    .min(2, "O endereço deve possuir pelo menos 2 caracteres.")
    .max(120, "O endereço deve possuir no máximo 120 caracteres.")
    .regex(slugPattern, "Use apenas letras minúsculas, números e hífens."),

  descricao: z
    .string()
    .trim()
    .max(500, "A descrição deve possuir no máximo 500 caracteres."),

  ativa: z.boolean(),
});

export type ValidatedCategoryFormValues = z.infer<typeof categoryFormSchema>;
