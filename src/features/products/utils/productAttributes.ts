import type { Json } from "../../../types/database.types";
import type { ProductAttributeField } from "../types/product";

export function createEmptyProductAttribute(): ProductAttributeField {
  return {
    id: crypto.randomUUID(),
    chave: "",
    valor: "",
  };
}

export function attributesFieldsToRecord(
  fields: ProductAttributeField[],
): Record<string, string> {
  return fields.reduce<Record<string, string>>((attributes, field) => {
    const key = field.chave.trim();
    const value = field.valor.trim();

    if (key && value) {
      attributes[key] = value;
    }

    return attributes;
  }, {});
}

export function attributesRecordToFields(value: Json): ProductAttributeField[] {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return [];
  }

  return Object.entries(value).map(([key, attributeValue]) => ({
    id: crypto.randomUUID(),
    chave: key,
    valor:
      typeof attributeValue === "string"
        ? attributeValue
        : (JSON.stringify(attributeValue) ?? ""),
  }));
}
