type CreateWhatsAppUrlParams = {
  phoneNumber: string;
  productName: string;
  customMessage: string | null;
  productUrl: string;
};

export function createWhatsAppUrl({
  phoneNumber,
  productName,
  customMessage,
  productUrl,
}: CreateWhatsAppUrlParams): string {
  const normalizedPhoneNumber = phoneNumber.replace(/\D/g, "");

  const message =
    customMessage?.trim() ||
    `Olá! Gostaria de saber mais sobre o produto "${productName}".`;

  const completeMessage = [
    message,
    "",
    `Produto: ${productName}`,
    productUrl,
  ].join("\n");

  return `https://wa.me/${normalizedPhoneNumber}?text=${encodeURIComponent(
    completeMessage,
  )}`;
}
