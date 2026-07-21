export function createGeneralWhatsAppUrl(
  phoneNumber: string | null,
  message = "Olá! Gostaria de saber mais sobre os produtos.",
): string | null {
  if (!phoneNumber) {
    return null;
  }

  const normalizedPhoneNumber = phoneNumber.replace(/\D/g, "");

  if (!normalizedPhoneNumber) {
    return null;
  }

  return `https://wa.me/${normalizedPhoneNumber}?text=${encodeURIComponent(
    message,
  )}`;
}

export function createInstagramUrl(instagram: string | null): string | null {
  const value = instagram?.trim();

  if (!value) {
    return null;
  }

  if (value.startsWith("https://") || value.startsWith("http://")) {
    try {
      const url = new URL(value);

      const normalizedHostname = url.hostname
        .toLocaleLowerCase()
        .replace(/^www\./, "");

      if (normalizedHostname !== "instagram.com") {
        return null;
      }

      return url.toString();
    } catch {
      return null;
    }
  }

  const username = value.replace(/^@/, "").replace(/^\/+|\/+$/g, "");

  if (!username || !/^[a-zA-Z0-9._]+$/.test(username)) {
    return null;
  }

  return `https://www.instagram.com/${encodeURIComponent(username)}/`;
}

export function getInstagramLabel(instagram: string | null): string {
  const value = instagram?.trim();

  if (!value) {
    return "Instagram";
  }

  if (value.startsWith("https://") || value.startsWith("http://")) {
    try {
      const url = new URL(value);

      const username = url.pathname.split("/").filter(Boolean)[0];

      return username ? `@${username}` : "Instagram";
    } catch {
      return "Instagram";
    }
  }

  return value.startsWith("@") ? value : `@${value}`;
}
