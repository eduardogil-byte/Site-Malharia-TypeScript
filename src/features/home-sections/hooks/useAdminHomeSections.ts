import { useCallback, useEffect, useState } from "react";
import {
  createHomeSection,
  deleteHomeSection,
  listHomeSectionsAdmin,
  reorderHomeSections,
  setHomeSectionActive,
  updateHomeSection,
} from "../services/homeSectionService";
import type { HomeSection, HomeSectionWriteInput } from "../types/homeSection";

type MoveDirection = "up" | "down";

export function useAdminHomeSections() {
  const [sections, setSections] = useState<HomeSection[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [loadError, setLoadError] = useState<string | null>(null);

  const loadSections = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const data = await listHomeSectionsAdmin();

      setSections(data);
    } catch (error) {
      console.error("Erro ao carregar seções da home:", error);

      setLoadError(
        error instanceof Error
          ? error.message
          : "Não foi possível carregar as seções.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSections();
  }, [loadSections]);

  const addSection = useCallback(
    async (input: HomeSectionWriteInput) => {
      await createHomeSection(input);
      await loadSections();
    },
    [loadSections],
  );

  const editSection = useCallback(
    async (sectionId: string, input: HomeSectionWriteInput) => {
      await updateHomeSection(sectionId, input);

      await loadSections();
    },
    [loadSections],
  );

  const toggleSection = useCallback(
    async (section: HomeSection) => {
      await setHomeSectionActive(section.id, !section.ativa);

      await loadSections();
    },
    [loadSections],
  );

  const removeSection = useCallback(
    async (sectionId: string) => {
      await deleteHomeSection(sectionId);
      await loadSections();
    },
    [loadSections],
  );

  const moveSection = useCallback(
    async (sectionId: string, direction: MoveDirection) => {
      const currentIndex = sections.findIndex(
        (section) => section.id === sectionId,
      );

      if (currentIndex === -1) {
        return;
      }

      const targetIndex =
        direction === "up" ? currentIndex - 1 : currentIndex + 1;

      if (targetIndex < 0 || targetIndex >= sections.length) {
        return;
      }

      const previousSections = sections;
      const reorderedSections = [...sections];

      [reorderedSections[currentIndex], reorderedSections[targetIndex]] = [
        reorderedSections[targetIndex],
        reorderedSections[currentIndex],
      ];

      const normalizedSections = reorderedSections.map((section, index) => ({
        ...section,
        posicao: index + 1,
      }));

      setSections(normalizedSections);

      try {
        await reorderHomeSections(
          normalizedSections.map((section) => section.id),
        );
      } catch (error) {
        setSections(previousSections);
        throw error;
      }
    },
    [sections],
  );

  return {
    sections,
    isLoading,
    loadError,
    reload: loadSections,
    addSection,
    editSection,
    toggleSection,
    removeSection,
    moveSection,
  };
}
