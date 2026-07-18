export function CatalogPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
          Nossos produtos
        </p>

        <h1 className="mt-2 text-4xl font-semibold text-stone-950">Catálogo</h1>

        <p className="mt-4 text-lg leading-8 text-stone-600">
          Encontre malhas, sabonetes, velas, aromatizadores e outros produtos da
          marca.
        </p>
      </header>

      <div className="mt-12 rounded-2xl border border-dashed border-stone-300 p-12 text-center text-stone-500">
        Os produtos serão carregados do Supabase.
      </div>
    </section>
  );
}
