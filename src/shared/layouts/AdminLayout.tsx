import { NavLink, Outlet } from "react-router";

const adminNavigationItems = [
  { label: "Visão geral", to: "/admin", end: true },
  { label: "Produtos", to: "/admin/produtos", end: false },
  { label: "Categorias", to: "/admin/categorias", end: false },
  { label: "Página inicial", to: "/admin/pagina-inicial", end: false },
  { label: "Configurações", to: "/admin/configuracoes", end: false },
];

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-stone-100 text-stone-900">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <p className="font-semibold">Painel administrativo</p>

          <NavLink
            to="/"
            className="text-sm font-medium text-stone-600 hover:text-stone-950"
          >
            Ver site
          </NavLink>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
        <aside className="rounded-2xl border border-stone-200 bg-white p-4">
          <nav aria-label="Navegação administrativa">
            <ul className="space-y-1">
              {adminNavigationItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      [
                        "block rounded-lg px-3 py-2 text-sm font-medium transition",
                        isActive
                          ? "bg-stone-900 text-white"
                          : "text-stone-600 hover:bg-stone-100 hover:text-stone-950",
                      ].join(" ")
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
