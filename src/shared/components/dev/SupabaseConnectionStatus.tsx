import { useState } from "react";
import { checkSupabaseConnection } from "../../../features/system/services/systemService";

type ConnectionStatus = "idle" | "loading" | "success" | "error";

export function SupabaseConnectionStatus() {
  const [status, setStatus] = useState<ConnectionStatus>("idle");

  async function handleCheckConnection() {
    setStatus("loading");

    const isConnected = await checkSupabaseConnection();

    setStatus(isConnected ? "success" : "error");
  }

  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-stone-950">
        Conexão com o Supabase
      </h2>

      <p className="mt-2 text-sm text-stone-600">
        Verifique se o frontend consegue acessar o banco.
      </p>

      <button
        type="button"
        onClick={handleCheckConnection}
        disabled={status === "loading"}
        className="mt-5 rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "loading" ? "Verificando..." : "Testar conexão"}
      </button>

      {status === "success" && (
        <p role="status" className="mt-4 text-sm font-medium text-green-700">
          Conexão realizada com sucesso.
        </p>
      )}

      {status === "error" && (
        <p role="alert" className="mt-4 text-sm font-medium text-red-700">
          Não foi possível conectar ao Supabase.
        </p>
      )}
    </section>
  );
}
