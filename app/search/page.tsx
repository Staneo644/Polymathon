"use client";
import ThemeButton from "@/components/themeButton";
import { ThemeRow } from "@/utils/theme/theme";
import { useState, useEffect } from "react";
import { completeWord } from "../api/word/route";
import listCardComponent from "@/components/listCard";
import { getChildrenThemes, getParentThemes, ThemeAll } from "@/utils/theme/convert-theme";
import CardContainer from "@/components/cardContainer";

export const wordLimit = 9;
export const wordNewCall = 6;


function getNomTheme(selectedTheme: ThemeRow, sousSelectedTheme: ThemeRow) {
  if (selectedTheme.name === "Tous") return "";
  if (sousSelectedTheme.name === "Tous") return selectedTheme.name;
  return sousSelectedTheme.name;
}

export default function Search() {
  const [loading, setLoading] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState<ThemeRow>(ThemeAll);
  const [listWord, setListWord] = useState<completeWord[]>([]);
  const [sousSelectedTheme, setSousSelectedTheme] =
  useState<ThemeRow>(ThemeAll);
  const [themes, setThemes] = useState<ThemeRow[] | null>(null);

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

  const fetchData = async () => {
      try {
        const theme = getNomTheme(selectedTheme, sousSelectedTheme);
        const response = await fetch(
          theme ? "/api/word?limit=" + wordLimit + "&theme=" + theme : "api/word?limit=" + wordLimit
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log(data);
        setListWord([... listWord, ... data.data]);
        console.log(listWord);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

  useEffect(() => {
      setListWord([]);
  
      fetchData();
    
  }, [selectedTheme, sousSelectedTheme]);

  function handleSelectTheme(theme: ThemeRow) {
    setSelectedTheme(theme);
    setSousSelectedTheme(ThemeAll);
  }

  return (
    <>
      <div className="bg-[var(--yellow)] p-4">
        {loading || !themes ? (
          <p>Chargement...</p>
        ) : (
          <>
            <ThemeButton
              themes={getParentThemes(themes)}
              selectedTheme={selectedTheme}
              setSelectedTheme={handleSelectTheme}
            />
          </>
        )}
      </div>
      {selectedTheme.name !== "Tous" &&
        !loading &&
        themes &&
        getChildrenThemes(themes, selectedTheme.id).length !== 0 && (
          <div className="bg-[var(--dark-yellow)] p-4">
            <ThemeButton
              themes={getChildrenThemes(themes, selectedTheme.id)}
              selectedTheme={sousSelectedTheme}
              setSelectedTheme={setSousSelectedTheme}
            />
          </div>
        )}

      {CardContainer(listWord, setListWord, fetchData)}
    </>
  );
}
