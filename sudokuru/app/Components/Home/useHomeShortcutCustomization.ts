import React from "react";
import { useFocusEffect } from "@react-navigation/native";
import { DEFAULT_HOME_SHORTCUTS } from "../../Api/HomeShortcuts";
import type { HomeShortcutId } from "../../Api/HomeShortcuts";
import type { HomeDashboardCardDescriptor } from "./HomeDashboard";
import { useHomeShortcuts } from "./useHomeShortcuts";

export const useHomeShortcutCustomization = (
  catalogue: HomeDashboardCardDescriptor[],
  shortcuts: ReturnType<typeof useHomeShortcuts>,
) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const isEditingRef = React.useRef(false);
  const [isLibraryOpen, setIsLibraryOpen] = React.useState(false);
  const [previewShortcutIds, setPreviewShortcutIds] = React.useState<
    HomeShortcutId[] | null
  >(null);
  const previewShortcutIdsRef = React.useRef<HomeShortcutId[] | null>(null);

  const shortcutById = new Map(
    catalogue.map((shortcut) => [shortcut.id, shortcut]),
  );
  const persistedVisibleShortcutIds = shortcuts.shortcutIds.filter(
    (shortcutId) => shortcutById.has(shortcutId),
  );
  const visibleShortcutIds =
    isEditing && previewShortcutIds
      ? previewShortcutIds
      : persistedVisibleShortcutIds;
  const selectedShortcuts = visibleShortcutIds.flatMap((shortcutId) => {
    const shortcut = shortcutById.get(shortcutId);
    return shortcut ? [shortcut] : [];
  });
  // Render in catalogue order while editing so the drag preview can animate
  // cards to their positions without remounting them.
  const renderedShortcuts = isEditing
    ? catalogue.filter((shortcut) => visibleShortcutIds.includes(shortcut.id))
    : selectedShortcuts;

  const clearCustomization = React.useCallback(() => {
    isEditingRef.current = false;
    setIsLibraryOpen(false);
    setIsEditing(false);
    previewShortcutIdsRef.current = null;
    setPreviewShortcutIds(null);
  }, []);

  // Discard only the temporary preview on blur. Returning Home rebuilds the
  // visible order from the current catalogue and saved shortcuts.
  useFocusEffect(
    React.useCallback(() => clearCustomization, [clearCustomization]),
  );

  const setPreviewOrder = (shortcutIds: HomeShortcutId[]) => {
    previewShortcutIdsRef.current = shortcutIds;
    setPreviewShortcutIds(shortcutIds);
  };

  const previewShortcutOrder = (
    shortcutId: HomeShortcutId,
    toIndex: number,
  ) => {
    const currentOrder =
      previewShortcutIdsRef.current ?? persistedVisibleShortcutIds;
    const fromIndex = currentOrder.indexOf(shortcutId);
    if (fromIndex < 0 || fromIndex === toIndex) return;

    const nextShortcuts = [...currentOrder];
    const [movedShortcut] = nextShortcuts.splice(fromIndex, 1);
    nextShortcuts.splice(toIndex, 0, movedShortcut);
    setPreviewOrder(nextShortcuts);
  };

  const beginEditing = () => {
    setPreviewOrder([...persistedVisibleShortcutIds]);
    isEditingRef.current = true;
    setIsEditing(true);
  };

  const finishEditing = () => {
    const previewOrder = previewShortcutIdsRef.current;
    if (previewOrder) shortcuts.reorderShortcuts(previewOrder);
    clearCustomization();
  };

  const resetShortcuts = () => {
    shortcuts.resetShortcuts();
    setPreviewOrder(
      DEFAULT_HOME_SHORTCUTS.filter((shortcutId) =>
        shortcutById.has(shortcutId),
      ),
    );
  };

  const removeShortcut = (shortcutId: HomeShortcutId) => {
    const nextPreview = (
      previewShortcutIdsRef.current ?? persistedVisibleShortcutIds
    ).filter((id) => id !== shortcutId);
    setPreviewOrder(nextPreview);
    shortcuts.removeShortcut(shortcutId);
  };

  const addShortcut = (shortcutId: HomeShortcutId) => {
    const currentPreview =
      previewShortcutIdsRef.current ?? persistedVisibleShortcutIds;
    if (!currentPreview.includes(shortcutId)) {
      setPreviewOrder([...currentPreview, shortcutId]);
    }
    shortcuts.addShortcut(shortcutId);
  };

  const commitDrag = () => {
    const previewOrder = previewShortcutIdsRef.current;
    if (previewOrder) shortcuts.reorderShortcuts(previewOrder);
  };

  const cancelDrag = () => {
    if (isEditingRef.current) {
      setPreviewOrder([...persistedVisibleShortcutIds]);
    }
  };

  return {
    isEditing,
    isLibraryOpen,
    openLibrary: () => setIsLibraryOpen(true),
    closeLibrary: () => setIsLibraryOpen(false),
    visibleShortcutIds,
    selectedShortcuts,
    renderedShortcuts,
    previewShortcutOrder,
    beginEditing,
    finishEditing,
    resetShortcuts,
    removeShortcut,
    addShortcut,
    commitDrag,
    cancelDrag,
  };
};
