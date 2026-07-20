import type { Json } from "../../../types/database.types";

export type DisplayProductAttribute = {
  name: string;
  value: string;
};

function formatAttributeValue(value: Json): string {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (value === null) {
    return "";
  }

  return JSON.stringify(value);
}

export function getProductAttributes(
  attributes: Json,
): DisplayProductAttribute[] {
  if (
    !attributes ||
    typeof attributes !== "object" ||
    Array.isArray(attributes)
  ) {
    return [];
  }

  return Object.entries(attributes as Record<string, Json>)
    .map(([name, value]) => ({
      name,
      value: formatAttributeValue(value),
    }))
    .filter((attribute) => attribute.value.length > 0);
}
