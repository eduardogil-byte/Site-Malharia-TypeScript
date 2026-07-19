import type { Session } from "@supabase/supabase-js";
import { supabase } from "../../../lib/supabase";

export class InvalidCredentialsError extends Error {
  constructor() {
    super("E-mail ou senha inválidos.");
    this.name = "InvalidCredentialsError";
  }
}

export class AdminAccessDeniedError extends Error {
  constructor() {
    super("Este usuário não possui acesso administrativo.");
    this.name = "AdminAccessDeniedError";
  }
}

export class AdminVerificationError extends Error {
  constructor() {
    super("Não foi possível verificar a permissão administrativa.");
    this.name = "AdminVerificationError";
  }
}

export async function checkCurrentUserIsAdmin(): Promise<boolean> {
  const { data, error } = await supabase.rpc("usuario_atual_e_admin");

  if (error) {
    console.error("Erro ao verificar permissão administrativa:", error);

    throw new AdminVerificationError();
  }

  return data === true;
}

export async function signInAsAdmin(
  email: string,
  password: string,
): Promise<Session> {
  const normalizedEmail = email.trim();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: normalizedEmail,
    password,
  });

  if (error || !data.session) {
    throw new InvalidCredentialsError();
  }

  try {
    const isAdmin = await checkCurrentUserIsAdmin();

    if (!isAdmin) {
      await signOutCurrentSession();
      throw new AdminAccessDeniedError();
    }

    return data.session;
  } catch (error) {
    if (error instanceof AdminAccessDeniedError) {
      throw error;
    }

    await signOutCurrentSession().catch(() => undefined);

    throw new AdminVerificationError();
  }
}

export async function signOutCurrentSession(): Promise<void> {
  const { error } = await supabase.auth.signOut({
    scope: "local",
  });

  if (error) {
    throw new Error("Não foi possível encerrar a sessão.");
  }
}
