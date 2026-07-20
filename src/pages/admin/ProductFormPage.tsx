import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { listCategoriesAdmin } from "../../features/categories/services/categoryService";
import type { Category } from "../../features/categories/types/category";
import { ProductForm } from "../../features/products/components/ProductForm";
import type { ProductFormValues } from "../../features/products/schemas/productSchema";
import {
  createProduct,
  getProductAdmin,
  updateProduct,
} from "../../features/products/services/productService";
import type { Product } from "../../features/products/types/product";
import { attributesFieldsToRecord } from "../../features/products/utils/productAttributes";

export function ProductFormPage() {
  const navigate = useNavigate();

  const { productId } = useParams<{
    productId: string;
  }>();

  const [product, setProduct] = useState<Product | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [loadError, setLoadError] = useState<string | null>(null);

  const [saveError, setSaveError] = useState<string | null>(null);

  const isEditing = Boolean(productId);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setIsLoading(true);
      setLoadError(null);

      try {
        const [categoriesData, productData] = await Promise.all([
          listCategoriesAdmin(),

          productId ? getProductAdmin(productId) : Promise.resolve(null),
        ]);

        if (cancelled) {
          return;
        }

        setCategories(categoriesData);
        setProduct(productData);
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error("Erro ao carregar formulário de produto:", error);

        setLoadError(
          error instanceof Error
            ? error.message
            : "Não foi possível carregar os dados.",
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadData();

    return () => {
      cancelled = true;
    };
  }, [productId]);

  async function handleSubmit(values: ProductFormValues) {
    setIsSubmitting(true);
    setSaveError(null);

    const input = {
      categoriaId: values.categoriaId,
      nome: values.nome,
      slug: values.slug,

      descricaoCurta: values.descricaoCurta || null,

      descricao: values.descricao || null,

      status: values.status,
      disponivel: values.disponivel,

      atributos: attributesFieldsToRecord(values.atributos),

      mensagemWhatsapp: values.mensagemWhatsapp || null,
    };

    try {
      if (productId) {
        await updateProduct(productId, input);
      } else {
        await createProduct(input);
      }

      navigate("/admin/produtos", {
        replace: true,
      });
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : "Não foi possível salvar o produto.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-stone-200 bg-white p-12 text-center text-stone-600">
        Carregando produto...
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
        <p className="text-sm text-red-800">{loadError}</p>

        <button
          type="button"
          onClick={() => navigate("/admin/produtos")}
          className="mt-4 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-800 hover:bg-red-100"
        >
          Voltar aos produtos
        </button>
      </div>
    );
  }

  return (
    <section>
      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
          Administração
        </p>

        <h1 className="mt-2 text-3xl font-semibold text-stone-950">
          {isEditing ? "Editar produto" : "Novo produto"}
        </h1>
      </header>

      {saveError && (
        <div
          role="alert"
          className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {saveError}
        </div>
      )}

      <ProductForm
        product={product}
        categories={categories}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/admin/produtos")}
      />
    </section>
  );
}
