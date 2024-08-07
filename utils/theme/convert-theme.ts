import { ThemeRow } from "@/utils/theme/theme";

export const ThemeAll = { id: 0, name: "Tous", parent: null };

export const getParentThemes = (themes: ThemeRow[]): ThemeRow[] => {
  themes.unshift(ThemeAll);
  return themes.filter((e) => e.parent === null);
};

export const getChildrenThemes = (themes: ThemeRow[], parent_id: number): ThemeRow[] => themes.filter((e) => e.parent === parent_id)
