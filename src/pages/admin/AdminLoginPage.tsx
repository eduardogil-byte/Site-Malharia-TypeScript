import type { FormEvent } from "react";

export function AdminLoginPage() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    console.log("O Supabase Auth será integrado posteriormente.");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-100 px-4">
      <section className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
          Administração
        </p>

        <h1 className="mt-2 text-3xl font-semibold text-stone-950">
          Entrar no painel
        </h1>

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
              autoComplete="email"
              required
              className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10"
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
              autoComplete="current-password"
              required
              className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-stone-900 px-4 py-3 font-medium text-white transition hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:ring-offset-2"
          >
            Entrar
          </button>
        </form>
      </section>
    </main>
  );
}
