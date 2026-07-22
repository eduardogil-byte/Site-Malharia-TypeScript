import { Link } from "react-router";

export function AdminNotFoundPage() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-2xl rounded-2xl border border-stone-200 bg-white p-8 text-center sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
          Erro 404
        </p>

        <h1 className="mt-4 text-3xl font-semibold text-stone-950">
          Página administrativa não encontrada
        </h1>

        <p className="mx-auto mt-4 max-w-xl leading-7 text-stone-600">
          O endereço informado não corresponde a nenhuma página disponível no
          painel.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/admin"
            className="inline-flex justify-center rounded-lg bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
          >
            Ir para o painel
          </Link>

          <Link
            to="/admin/produtos"
            className="inline-flex justify-center rounded-lg border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
          >
            Abrir produtos
          </Link>
        </div>
      </div>
    </section>
  );
}
