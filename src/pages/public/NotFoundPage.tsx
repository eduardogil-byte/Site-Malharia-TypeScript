import { Link } from "react-router";

export function NotFoundPage() {
  return (
    <section className="content-shell section-spacing flex min-h-[60vh] max-w-5xl items-center justify-center text-center">
      <section>
        <p className="eyebrow">
          Erro 404
        </p>

        <h1 className="page-title">
          Página não encontrada
        </h1>

        <p className="lead-copy mx-auto mt-5 max-w-2xl">
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
