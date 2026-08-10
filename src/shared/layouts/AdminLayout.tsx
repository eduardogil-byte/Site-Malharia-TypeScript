import { useState } from "react";
import { Outlet } from "react-router";
import { AdminShell } from "../../components/admin/AdminShell";
import { useAuth } from "../../features/auth/hooks/useAuth";

export function AdminLayout() {
  const { user, signOut } = useAuth();

  const [logoutError, setLogoutError] = useState<string | null>(null);

  async function handleSignOut() {
    setLogoutError(null);

    try {
      await signOut();
    } catch (error) {
      console.error("Erro ao encerrar sessão:", error);

      setLogoutError("Não foi possível sair. Tente novamente.");
    }
  }

  return (
    <AdminShell onLogout={handleSignOut}>
      <div className="mb-8 flex flex-col gap-2 border-b border-stone-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-stone-900">Administrador</p>

          {user?.email && (
            <p className="mt-1 break-all text-xs text-stone-500">
              {user.email}
            </p>
          )}
        </div>

        <p className="text-xs font-medium uppercase tracking-[0.1em] text-stone-500">
          Painel administrativo
        </p>
      </div>

      {logoutError && (
        <div
          role="alert"
          className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {logoutError}
        </div>
      )}

      <Outlet />
    </AdminShell>
  );
}
