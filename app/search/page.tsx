"use client";
import ThemeButton from "@/components/themeButton";
import { ThemeRow } from "@/utils/theme/theme";
import { useState, useEffect } from "react";

const TousTheme = { id: 0, name: "Tous", parent: null };
function getThemes(themes: ThemeRow[]): ThemeRow[] {
  const res = themes.filter((e) => e.parent === null);
  res.unshift(TousTheme);
  return res;
}
function getSousThemes(themes: ThemeRow[], parent_id: number): ThemeRow[] {
  const res = themes.filter((e) => e.parent === parent_id);
  return res;
}

export default function Search() {
  const [themes, setThemes] = useState<ThemeRow[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState<ThemeRow>(TousTheme);
  const [sousSelectedTheme, setSousSelectedTheme] =
    useState<ThemeRow>(TousTheme);

  useEffect(() => {
    fetch("http://localhost:3000/api/theme")
      .then((res) => res.json())
      .then((data) => {
        console.log(data.data);
        setThemes(data.data);
        setLoading(false);
      })
      .catch((e: any) => {
        console.error("erreur: ", e);
        setThemes(null);
      });
  }, []);

  return (
    <>
      <div className="h-32 bg-blue-700 p-4">
        {loading || !themes ? (
          <p>Chargement...</p>
        ) : (
          <>
            <ThemeButton
              themes={getThemes(themes)}
              selectedTheme={selectedTheme}
              setSelectedTheme={setSelectedTheme}
            />
            {selectedTheme && <p>Thème sélectionné: {selectedTheme.name}</p>}
          </>
        )}
      </div>
      {selectedTheme.name === "Tous" ? (
        <p>Tous !</p>
      ) : (
        !loading &&
        themes && (
          <div className="h-32 bg-blue-800 p-4">
            <p>Theme: {selectedTheme.name}</p>
            <ThemeButton
              themes={getSousThemes(themes, selectedTheme.id)}
              selectedTheme={sousSelectedTheme}
              setSelectedTheme={setSousSelectedTheme}
            />
          </div>
        )
      )}
      {<p> </p>}
    </>
  );
}
