import { Link } from "react-router";

export function NotFoundPage() {
  return (
    <section className="mx-auto flex min-h-[65vh] max-w-5xl items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-stone-500">
          Erro 404
        </p>

        <h1 className="mt-4 text-4xl font-semibold text-stone-950 sm:text-5xl">
          Página não encontrada
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-stone-600">
          O endereço acessado não existe, foi alterado ou não está mais
          disponível.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex justify-center rounded-xl bg-stone-900 px-6 py-4 text-sm font-semibold text-white transition hover:bg-stone-700"
          >
            Voltar ao início
          </Link>

          <Link
            to="/catalogo"
            className="inline-flex justify-center rounded-xl border border-stone-300 px-6 py-4 text-sm font-semibold text-stone-800 transition hover:bg-stone-100"
          >
            Abrir catálogo
          </Link>
        </div>
      </section>
    </section>
  );
}
