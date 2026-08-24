import React from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  DEFAULT_HOME_SHORTCUTS,
  getHomeShortcuts,
  HomeShortcutId,
  saveHomeShortcuts,
} from "../../Api/HomeShortcuts";

export const useHomeShortcuts = () => {
  const [shortcutIds, setShortcutIds] = React.useState<HomeShortcutId[]>(
    DEFAULT_HOME_SHORTCUTS,
  );
  const [isLoading, setIsLoading] = React.useState(true);

  useFocusEffect(
    React.useCallback(() => {
      let shouldUpdate = true;
      const loadShortcuts = async () => {
        const storedShortcuts = await getHomeShortcuts();
        if (shouldUpdate) {
          setShortcutIds(storedShortcuts);
          setIsLoading(false);
        }
      };

      void loadShortcuts();
      return () => {
        shouldUpdate = false;
      };
    }, []),
  );

  const updateShortcuts = (nextShortcuts: HomeShortcutId[]) => {
    setShortcutIds(nextShortcuts);
    void saveHomeShortcuts(nextShortcuts);
  };

  const addShortcut = (shortcutId: HomeShortcutId) => {
    if (!shortcutIds.includes(shortcutId)) {
      updateShortcuts([...shortcutIds, shortcutId]);
    }
  };

  const removeShortcut = (shortcutId: HomeShortcutId) => {
    updateShortcuts(shortcutIds.filter((id) => id !== shortcutId));
  };

  const reorderShortcuts = (visibleShortcutIds: HomeShortcutId[]) => {
    const visibleIds = new Set(visibleShortcutIds);
    let visibleIndex = 0;
    const nextShortcuts = shortcutIds.map((shortcutId) =>
      visibleIds.has(shortcutId)
        ? visibleShortcutIds[visibleIndex++]
        : shortcutId,
    );
    updateShortcuts(nextShortcuts);
  };

  return {
    shortcutIds,
    isLoading,
    addShortcut,
    removeShortcut,
    reorderShortcuts,
    resetShortcuts: () => updateShortcuts([...DEFAULT_HOME_SHORTCUTS]),
  };
};
