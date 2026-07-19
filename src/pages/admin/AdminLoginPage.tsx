import { useState, type FormEvent } from "react";
import { Navigate, useLocation } from "react-router";
import { AuthLoadingScreen } from "../../features/auth/components/AuthLoadingScreen";
import { useAuth } from "../../features/auth/hooks/useAuth";
import {
  AdminAccessDeniedError,
  AdminVerificationError,
  InvalidCredentialsError,
} from "../../features/auth/services/authService";

type LoginLocationState = {
  from?: unknown;
};

function getSafeAdminRedirect(state: unknown): string {
  if (!state || typeof state !== "object") {
    return "/admin";
  }

  const { from } = state as LoginLocationState;

  if (typeof from !== "string") {
    return "/admin";
  }

  const isAdminRoute = from === "/admin" || from.startsWith("/admin/");

  const isLoginRoute =
    from === "/admin/login" || from.startsWith("/admin/login?");

  if (!isAdminRoute || isLoginRoute) {
    return "/admin";
  }

  return from;
}

export function AdminLoginPage() {
  const location = useLocation();
  const { status, signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectPath = getSafeAdminRedirect(location.state);

  if (status === "loading" && !isSubmitting) {
    return <AuthLoadingScreen />;
  }

  if (status === "admin") {
    return <Navigate to={redirectPath} replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await signIn(email, password);
    } catch (error) {
      if (
        error instanceof InvalidCredentialsError ||
        error instanceof AdminAccessDeniedError ||
        error instanceof AdminVerificationError
      ) {
        setErrorMessage(error.message);
      } else {
        console.error("Erro inesperado durante o login:", error);

        setErrorMessage("Não foi possível realizar o login. Tente novamente.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-100 px-4 py-12">
      <section className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
          Administração
        </p>

        <h1 className="mt-2 text-3xl font-semibold text-stone-950">
          Entrar no painel
        </h1>

        <p className="mt-3 text-sm leading-6 text-stone-600">
          Utilize uma conta autorizada para gerenciar o catálogo.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-stone-700"
            >
              E-mail
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              inputMode="email"
              required
              disabled={isSubmitting}
              className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 disabled:cursor-not-allowed disabled:bg-stone-100"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-stone-700"
            >
              Senha
            </label>

            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
              disabled={isSubmitting}
              className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 disabled:cursor-not-allowed disabled:bg-stone-100"
            />
          </div>

          {errorMessage && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-stone-900 px-4 py-3 font-medium text-white transition hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </section>
    </main>
  );
}
