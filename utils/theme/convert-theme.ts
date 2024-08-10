import { ThemeRow } from "@/utils/theme/theme";

export const ThemeAll = { id: 0, name: "Tous", parent: null };


export const getParentThemes = (themes: ThemeRow[], addThemeAll?:boolean): ThemeRow[] => {
  const res = themes.filter((e) => e.parent === null);
  if (addThemeAll)
    res.unshift(ThemeAll);
  return res;
};

export const getChildrenThemes = (themes: ThemeRow[], parent_id: number): ThemeRow[] => themes.filter((e) => e.parent === parent_id)

  export const hasChildren = (themes: ThemeRow[], parent_id: number): boolean => getChildrenThemes(themes, parent_id).length !== 0;