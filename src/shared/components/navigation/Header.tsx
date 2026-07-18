import { NavLink } from "react-router";

const navigationItems = [
  { label: "Início", to: "/" },
  { label: "Catálogo", to: "/catalogo" },
  { label: "Sobre", to: "/sobre" },
  { label: "Contato", to: "/contato" },
];

export function Header() {
  return (
    <header className="border-b border-stone-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <NavLink
          to="/"
          aria-label="Ir para a página inicial"
          className="text-xl font-semibold tracking-wide text-stone-900"
        >
          Nome da Marca
        </NavLink>

        <nav aria-label="Navegação principal">
          <ul className="flex items-center gap-6">
            {navigationItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    [
                      "text-sm font-medium transition-colors",
                      isActive
                        ? "text-stone-950"
                        : "text-stone-600 hover:text-stone-950",
                    ].join(" ")
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
