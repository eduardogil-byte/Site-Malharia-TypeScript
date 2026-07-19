import { useCallback, useEffect, useState } from "react";
import {
  createCategory,
  deleteCategory,
  listCategoriesAdmin,
  reorderCategories,
  setCategoryActive,
  updateCategory,
} from "../services/categoryService";
import type {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../types/category";

type MoveDirection = "up" | "down";

export function useAdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [loadError, setLoadError] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const data = await listCategoriesAdmin();

      setCategories(data);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);

      setLoadError("Não foi possível carregar as categorias.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  const addCategory = useCallback(
    async (input: CreateCategoryInput) => {
      await createCategory(input);
      await loadCategories();
    },
    [loadCategories],
  );

  const editCategory = useCallback(
    async (categoryId: string, input: UpdateCategoryInput) => {
      await updateCategory(categoryId, input);
      await loadCategories();
    },
    [loadCategories],
  );

  const toggleCategory = useCallback(
    async (category: Category) => {
      await setCategoryActive(category.id, !category.ativa);

      await loadCategories();
    },
    [loadCategories],
  );

  const removeCategory = useCallback(
    async (categoryId: string) => {
      await deleteCategory(categoryId);
      await loadCategories();
    },
    [loadCategories],
  );

  const moveCategory = useCallback(
    async (categoryId: string, direction: MoveDirection) => {
      const currentIndex = categories.findIndex(
        (category) => category.id === categoryId,
      );

      if (currentIndex === -1) {
        return;
      }

      const targetIndex =
        direction === "up" ? currentIndex - 1 : currentIndex + 1;

      if (targetIndex < 0 || targetIndex >= categories.length) {
        return;
      }

      const previousCategories = categories;

      const reorderedCategories = [...categories];

      [reorderedCategories[currentIndex], reorderedCategories[targetIndex]] = [
        reorderedCategories[targetIndex],
        reorderedCategories[currentIndex],
      ];

      const categoriesWithNewPositions = reorderedCategories.map(
        (category, index) => ({
          ...category,
          posicao: index + 1,
        }),
      );

      setCategories(categoriesWithNewPositions);

      try {
        await reorderCategories(
          categoriesWithNewPositions.map((category) => category.id),
        );
      } catch (error) {
        setCategories(previousCategories);
        throw error;
      }
    },
    [categories],
  );

  return {
    categories,
    isLoading,
    loadError,
    reload: loadCategories,
    addCategory,
    editCategory,
    toggleCategory,
    removeCategory,
    moveCategory,
  };
}
