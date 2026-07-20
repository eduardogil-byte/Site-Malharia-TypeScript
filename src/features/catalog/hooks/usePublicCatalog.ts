import { useCallback, useEffect, useState } from "react";
import {
  listPublicCategories,
  listPublicProducts,
} from "../services/publicCatalogService";
import type {
  PublicCatalogFilters,
  PublicCategory,
  PublicProduct,
} from "../types/publicCatalog";

export function usePublicCatalog(filters: PublicCatalogFilters) {
  const [products, setProducts] = useState<PublicProduct[]>([]);

  const [categories, setCategories] = useState<PublicCategory[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [loadError, setLoadError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const data = await listPublicProducts(filters);

      setProducts(data);
    } catch (error) {
      console.error("Erro ao carregar catálogo:", error);

      setLoadError(
        error instanceof Error
          ? error.message
          : "Não foi possível carregar o catálogo.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [filters.search, filters.categoryId]);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      try {
        const data = await listPublicCategories();

        if (!cancelled) {
          setCategories(data);
        }
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      }
    }

    void loadCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    products,
    categories,
    isLoading,
    loadError,
    reload: loadProducts,
  };
}
