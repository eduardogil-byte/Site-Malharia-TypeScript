type AdminPlaceholderPageProps = {
  title: string;
  description: string;
};

export function AdminPlaceholderPage({
  title,
  description,
}: AdminPlaceholderPageProps) {
  return (
    <section>
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
          Administração
        </p>

        <h1 className="mt-2 text-3xl font-semibold text-stone-950">{title}</h1>

        <p className="mt-3 text-stone-600">{description}</p>
      </header>

      <div className="mt-8 rounded-2xl border border-dashed border-stone-300 bg-white p-12 text-center text-stone-500">
        Esta funcionalidade será desenvolvida em uma próxima etapa.
      </div>
    </section>
  );
}
