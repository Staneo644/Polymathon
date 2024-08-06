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

export default function Search() {
  const [themes, setThemes] = useState<ThemeRow[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState<ThemeRow>(TousTheme);

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

  const handleThemeSelect = (theme: ThemeRow) => {
    setSelectedTheme(theme);
  };

  return (
    <>
      <div className="h-32 bg-blue-600 flex items-center">
        <h1 className="text-center text-5xl w-full">Explorer</h1>
      </div>
      <div className="h-32 bg-blue-700 p-4">
        {loading || !themes ? (
          <p>Chargement...</p>
        ) : (
          <>
            <ThemeButton
              themes={getThemes(themes)}
              onSelect={handleThemeSelect}
              selectedTheme={selectedTheme}
              setSelectedTheme={setSelectedTheme}
            />
            {selectedTheme && <p>Thème sélectionné: {selectedTheme.name}</p>}
          </>
        )}
      </div>
    </>
  );
}
