import { z } from "zod";
import { PRODUCT_STATUS_VALUES } from "../types/product";

const productAttributeSchema = z.object({
  id: z.string(),

  chave: z
    .string()
    .trim()
    .min(1, "Informe o nome do atributo.")
    .max(60, "O nome do atributo deve possuir no máximo 60 caracteres."),

  valor: z
    .string()
    .trim()
    .min(1, "Informe o valor do atributo.")
    .max(200, "O valor deve possuir no máximo 200 caracteres."),
});

export const productFormSchema = z
  .object({
    categoriaId: z.string().uuid("Selecione uma categoria válida."),

    nome: z
      .string()
      .trim()
      .min(2, "O nome deve possuir pelo menos 2 caracteres.")
      .max(150, "O nome deve possuir no máximo 150 caracteres."),

    slug: z
      .string()
      .trim()
      .min(2, "O endereço deve possuir pelo menos 2 caracteres.")
      .max(180, "O endereço deve possuir no máximo 180 caracteres.")
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Use apenas letras minúsculas, números e hífens.",
      ),

    descricaoCurta: z
      .string()
      .trim()
      .max(300, "A descrição curta deve possuir no máximo 300 caracteres."),

    descricao: z
      .string()
      .trim()
      .max(5000, "A descrição deve possuir no máximo 5000 caracteres."),

    status: z.enum(PRODUCT_STATUS_VALUES),

    disponivel: z.boolean(),

    atributos: z
      .array(productAttributeSchema)
      .max(20, "O produto pode possuir no máximo 20 atributos."),

    mensagemWhatsapp: z
      .string()
      .trim()
      .max(500, "A mensagem deve possuir no máximo 500 caracteres."),
  })
  .superRefine((values, context) => {
    const usedKeys = new Set<string>();

    values.atributos.forEach((attribute, index) => {
      const normalizedKey = attribute.chave.trim().toLocaleLowerCase("pt-BR");

      if (!normalizedKey) {
        return;
      }

      if (usedKeys.has(normalizedKey)) {
        context.addIssue({
          code: "custom",
          path: ["atributos", index, "chave"],
          message: "Este atributo está duplicado.",
        });

        return;
      }

      usedKeys.add(normalizedKey);
    });
  });

export type ProductFormValues = z.infer<typeof productFormSchema>;
