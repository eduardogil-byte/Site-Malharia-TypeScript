import { useParams } from "react-router";

type ProductPageParams = {
  slug: string;
};

export function ProductPage() {
  const { slug } = useParams<ProductPageParams>();

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm font-medium text-stone-500">
        Identificador do produto
      </p>

      <h1 className="mt-2 text-4xl font-semibold text-stone-950">
        {slug ?? "Produto não encontrado"}
      </h1>

      <div className="mt-10 rounded-2xl border border-dashed border-stone-300 p-12 text-center text-stone-500">
        A galeria e as informações do produto serão adicionadas posteriormente.
      </div>
    </section>
  );
}
