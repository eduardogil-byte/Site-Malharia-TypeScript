import { isRouteErrorResponse, Link, useRouteError } from "react-router";

type RouteErrorInformation = {
  status: number;
  title: string;
  message: string;
  technicalDetails: string | null;
};

function getResponseMessage(data: unknown): string | null {
  if (typeof data === "string") {
    return data;
  }

  if (
    data &&
    typeof data === "object" &&
    "message" in data &&
    typeof data.message === "string"
  ) {
    return data.message;
  }

  return null;
}

function getRouteErrorInformation(error: unknown): RouteErrorInformation {
  if (isRouteErrorResponse(error)) {
    const responseMessage = getResponseMessage(error.data);

    switch (error.status) {
      case 404:
        return {
          status: 404,
          title: "Página não encontrada",
          message:
            responseMessage ?? "O conteúdo solicitado não foi encontrado.",
          technicalDetails: null,
        };

      case 403:
        return {
          status: 403,
          title: "Acesso não autorizado",
          message:
            responseMessage ??
            "Você não possui permissão para acessar este conteúdo.",
          technicalDetails: null,
        };

      default:
        return {
          status: error.status,
          title: "Não foi possível abrir esta página",
          message:
            responseMessage ??
            "Ocorreu um erro durante o carregamento da página.",
          technicalDetails: import.meta.env.DEV
            ? `${error.status} ${error.statusText}`
            : null,
        };
    }
  }

  if (error instanceof Error) {
    return {
      status: 500,
      title: "Ocorreu um erro inesperado",
      message:
        "Não foi possível carregar esta página. Tente novamente em alguns instantes.",
      technicalDetails: import.meta.env.DEV ? error.message : null,
    };
  }

  return {
    status: 500,
    title: "Ocorreu um erro inesperado",
    message:
      "Não foi possível carregar esta página. Tente novamente em alguns instantes.",
    technicalDetails: null,
  };
}

export function RouteErrorPage() {
  const error = useRouteError();

  const errorInformation = getRouteErrorInformation(error);

  function reloadPage() {
    window.location.reload();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-100 px-4 py-16">
      <section className="w-full max-w-2xl rounded-3xl border border-stone-200 bg-white p-8 text-center shadow-sm sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
          Erro {errorInformation.status}
        </p>

        <h1 className="mt-4 text-3xl font-semibold text-stone-950 sm:text-4xl">
          {errorInformation.title}
        </h1>

        <p className="mx-auto mt-5 max-w-xl leading-7 text-stone-600">
          {errorInformation.message}
        </p>

        {errorInformation.technicalDetails && (
          <details className="mt-7 rounded-xl border border-amber-200 bg-amber-50 p-4 text-left">
            <summary className="cursor-pointer text-sm font-semibold text-amber-900">
              Detalhes para desenvolvimento
            </summary>

            <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-words text-xs leading-6 text-amber-800">
              {errorInformation.technicalDetails}
            </pre>
          </details>
        )}

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex justify-center rounded-xl bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
          >
            Voltar ao início
          </Link>

          <button
            type="button"
            onClick={reloadPage}
            className="rounded-xl border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
          >
            Tentar novamente
          </button>
        </div>
      </section>
    </main>
  );
}
