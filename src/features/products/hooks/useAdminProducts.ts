import { useCallback, useEffect, useState } from "react";
import { listCategoriesAdmin } from "../../categories/services/categoryService";
import type { Category } from "../../categories/types/category";
import { listProductsAdmin } from "../services/productService";
import type { ProductListFilters, ProductWithCategory } from "../types/product";

export function useAdminProducts(filters: ProductListFilters) {
  const [products, setProducts] = useState<ProductWithCategory[]>([]);

  const [categories, setCategories] = useState<Category[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [loadError, setLoadError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const data = await listProductsAdmin(filters);

      setProducts(data);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);

      setLoadError(
        error instanceof Error
          ? error.message
          : "Não foi possível carregar os produtos.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [filters.search, filters.categoryId, filters.status]);

  const loadCategories = useCallback(async () => {
    try {
      const data = await listCategoriesAdmin();

      setCategories(data);
    } catch (error) {
      console.error("Erro ao carregar categorias para o filtro:", error);
    }
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  return {
    products,
    categories,
    isLoading,
    loadError,
    reload: loadProducts,
  };
}
