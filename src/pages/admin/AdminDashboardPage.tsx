const dashboardItems = [
  {
    title: "Produtos",
    description: "Cadastre, publique e organize os produtos.",
  },
  {
    title: "Categorias",
    description: "Gerencie malhas, velas, sabonetes e aromatizadores.",
  },
  {
    title: "Página inicial",
    description: "Escolha os produtos em destaque e suas posições.",
  },
];

export function AdminDashboardPage() {
  return (
    <section>
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
          Administração
        </p>

        <h1 className="mt-2 text-3xl font-semibold text-stone-950">
          Visão geral
        </h1>
      </header>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {dashboardItems.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-stone-200 bg-white p-6"
          >
            <h2 className="text-lg font-semibold text-stone-950">
              {item.title}
            </h2>

            <p className="mt-2 text-sm leading-6 text-stone-600">
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
