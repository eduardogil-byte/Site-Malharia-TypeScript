const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl) {
  throw new Error("A variável VITE_SUPABASE_URL não foi configurada.");
}

if (!supabasePublishableKey) {
  throw new Error(
    "A variável VITE_SUPABASE_PUBLISHABLE_KEY não foi configurada.",
  );
}

try {
  new URL(supabaseUrl);
} catch {
  throw new Error("A variável VITE_SUPABASE_URL não contém uma URL válida.");
}

export const env = {
  supabaseUrl,
  supabasePublishableKey,
} as const;
