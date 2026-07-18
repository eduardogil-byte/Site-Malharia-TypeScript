import { Link } from "react-router";

export function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-50 px-4">
      <section className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
          Erro 404
        </p>

        <h1 className="mt-3 text-4xl font-semibold text-stone-950">
          Página não encontrada
        </h1>

        <p className="mt-4 text-stone-600">
          O endereço acessado não existe ou foi alterado.
        </p>

        <Link
          to="/"
          className="mt-8 inline-flex rounded-full bg-stone-900 px-6 py-3 font-medium text-white transition hover:bg-stone-700"
        >
          Voltar ao início
        </Link>
      </section>
    </main>
  );
}
