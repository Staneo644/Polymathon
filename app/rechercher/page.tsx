"use client";
import ThemeButton from "@/components/themeButton";
import { ThemeRow } from "@/utils/theme/theme";
import { useState, useEffect } from "react";
import { completeWord } from "@/utils/word/completeWord";
import {
  getChildrenThemes,
  getParentThemes,
  ThemeAll,
} from "@/utils/theme/convert-theme";
import CardContainer from "@/components/cardContainer";

export const wordLimit = 9;
export const wordNewCall = 6;
export const ParamsWord = new URLSearchParams({ limit: wordLimit.toString() });

function getNomTheme(selectedTheme: ThemeRow, sousSelectedTheme: ThemeRow) {
  if (selectedTheme.name === "Tous") return "";
  if (sousSelectedTheme.name === "Tous") return selectedTheme.name;
  return sousSelectedTheme.name;
}

export default function Search() {
  const [loadingWords, setLoadingWords] = useState(true);
  const [loadingThemes, setLoadingThemes] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState<ThemeRow>(ThemeAll);
  const [listWord, setListWord] = useState<completeWord[]>([]);
  const [sousSelectedTheme, setSousSelectedTheme] =
    useState<ThemeRow>(ThemeAll);
  const [themes, setThemes] = useState<ThemeRow[] | null>(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/theme")
      .then((res) => res.json())
      .then((data) => {
        setThemes(data.data);
        setLoadingThemes(false);
      })
      .catch((e: any) => {
        console.error("erreur: ", e);
        setThemes(null);
      });
  }, []);

  const fetchData = async (empty?: Boolean) => {
    setLoadingWords(true);
    try {
      const theme = getNomTheme(selectedTheme, sousSelectedTheme);
      await fetch(
        theme
          ? `api/word?${new URLSearchParams({limit: wordLimit.toString(),"theme": theme})}`
          : `api/word?${ParamsWord}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            console.error("Erreur: ", data.error);
            return;
          }
          if (empty) {
            setListWord([]);
            setListWord(data.data);
          } else {
            setListWord([...listWord, ...data.data]);
          }
          setLoadingWords(false);
        });
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    setListWord([]);
    fetchData(true);
  }, [selectedTheme, sousSelectedTheme]);

  function handleSelectTheme(theme: ThemeRow) {
    setSelectedTheme(theme);
    setSousSelectedTheme(ThemeAll);
  }

  return (
    <>
      <div className="bg-[var(--yellow)] p-4 shadow-md">
        {loadingThemes || !themes ? (
          <p>Chargement...</p>
        ) : (
          <>
            <ThemeButton
              themes={getParentThemes(themes, true)}
              selectedTheme={selectedTheme}
              setSelectedTheme={handleSelectTheme}
            />
          </>
        )}
      </div>
      {selectedTheme.name !== "Tous" &&
        !loadingThemes &&
        themes &&
        getChildrenThemes(themes, selectedTheme.id).length !== 0 && (
          <div className="bg-[var(--dark-yellow)] p-4 shadow-md">
            <ThemeButton
              themes={getChildrenThemes(themes, selectedTheme.id)}
              selectedTheme={sousSelectedTheme}
              setSelectedTheme={setSousSelectedTheme}
            />
          </div>
        )}
        {listWord && listWord.length == 0 && (
          <>
          {loadingWords && <div>Chargement en cours...</div>}
          {!loadingWords && (
            <div>Aucun mot à afficher</div>
          )}
          </>
        )}
      {CardContainer(listWord, setListWord, fetchData)}
    </>
  );
}
