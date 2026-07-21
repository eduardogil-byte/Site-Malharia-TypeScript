import { useCallback, useEffect, useMemo, useState } from "react";
import { getHomeSectionAdmin } from "../services/homeSectionService";
import {
  listHomeSectionProductIds,
  listProductsForHomeSection,
  saveHomeSectionProducts,
} from "../services/homeSectionProductService";
import type { HomeSection } from "../types/homeSection";
import type { HomeSectionProductOption } from "../types/homeSectionProduct";

type MoveDirection = "up" | "down";

function arraysAreEqual(first: string[], second: string[]): boolean {
  return (
    first.length === second.length &&
    first.every((value, index) => value === second[index])
  );
}

export function useHomeSectionProducts(sectionId: string | undefined) {
  const [section, setSection] = useState<HomeSection | null>(null);

  const [products, setProducts] = useState<HomeSectionProductOption[]>([]);

  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  const [savedProductIds, setSavedProductIds] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [isSaving, setIsSaving] = useState(false);

  const [loadError, setLoadError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!sectionId) {
      setLoadError("O identificador da seção é inválido.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setLoadError(null);

    try {
      const [sectionData, productsData, productIdsData] = await Promise.all([
        getHomeSectionAdmin(sectionId),
        listProductsForHomeSection(),
        listHomeSectionProductIds(sectionId),
      ]);

      setSection(sectionData);
      setProducts(productsData);
      setSelectedProductIds(productIdsData);
      setSavedProductIds(productIdsData);
    } catch (error) {
      console.error("Erro ao carregar produtos da seção:", error);

      setLoadError(
        error instanceof Error
          ? error.message
          : "Não foi possível carregar a seção.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [sectionId]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const selectedProducts = useMemo(
    () =>
      selectedProductIds
        .map((productId) =>
          products.find((product) => product.id === productId),
        )
        .filter((product): product is HomeSectionProductOption =>
          Boolean(product),
        ),
    [products, selectedProductIds],
  );

  const availableProducts = useMemo(
    () =>
      products.filter((product) => !selectedProductIds.includes(product.id)),
    [products, selectedProductIds],
  );

  const hasChanges = !arraysAreEqual(selectedProductIds, savedProductIds);

  const limitReached =
    section !== null && selectedProductIds.length >= section.limite_produtos;

  const addProduct = useCallback(
    (productId: string) => {
      setSelectedProductIds((currentIds) => {
        if (
          currentIds.includes(productId) ||
          (section && currentIds.length >= section.limite_produtos)
        ) {
          return currentIds;
        }

        return [...currentIds, productId];
      });
    },
    [section],
  );

  const removeProduct = useCallback((productId: string) => {
    setSelectedProductIds((currentIds) =>
      currentIds.filter((currentId) => currentId !== productId),
    );
  }, []);

  const moveProduct = useCallback(
    (productId: string, direction: MoveDirection) => {
      setSelectedProductIds((currentIds) => {
        const currentIndex = currentIds.indexOf(productId);

        if (currentIndex === -1) {
          return currentIds;
        }

        const targetIndex =
          direction === "up" ? currentIndex - 1 : currentIndex + 1;

        if (targetIndex < 0 || targetIndex >= currentIds.length) {
          return currentIds;
        }

        const nextIds = [...currentIds];

        [nextIds[currentIndex], nextIds[targetIndex]] = [
          nextIds[targetIndex],
          nextIds[currentIndex],
        ];

        return nextIds;
      });
    },
    [],
  );

  const resetSelection = useCallback(() => {
    setSelectedProductIds(savedProductIds);
  }, [savedProductIds]);

  const saveSelection = useCallback(async () => {
    if (!sectionId) {
      throw new Error("A seção informada é inválida.");
    }

    setIsSaving(true);

    try {
      await saveHomeSectionProducts(sectionId, selectedProductIds);

      setSavedProductIds(selectedProductIds);
    } finally {
      setIsSaving(false);
    }
  }, [sectionId, selectedProductIds]);

  return {
    section,
    selectedProducts,
    availableProducts,
    selectedProductIds,
    isLoading,
    isSaving,
    loadError,
    hasChanges,
    limitReached,
    reload: loadData,
    addProduct,
    removeProduct,
    moveProduct,
    resetSelection,
    saveSelection,
  };
}
