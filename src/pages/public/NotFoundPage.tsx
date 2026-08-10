import { Link } from "react-router";

export function NotFoundPage() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8">
      <section>
        <p className="eyebrow">
          Erro 404
        </p>

        <h1 className="mt-5 text-5xl leading-none text-stone-950 sm:text-6xl">
          Página não encontrada
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-stone-600">
          O endereço acessado não existe, foi alterado ou não está mais
          disponível.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="button-primary"
          >
            Voltar ao início
          </Link>

          <Link
            to="/catalogo"
            className="button-secondary"
          >
            Abrir catálogo
          </Link>
        </div>
      </section>
    </section>
  );
}
