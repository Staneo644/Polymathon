import { useState, useEffect } from "react";
import { completeWord } from "@/utils/word/completeWord";
import { WordContainer } from "@/components/wordContainer";
import { ParamsWord } from "@/app/rechercher/page";

export function PageWordContainer(apiUrl: string) {
  const [loadingWords, setLoadingWords] = useState(true);
  const [listWord, setListWord] = useState<completeWord[]>([]);

  const fetchData = async () => {
    setLoadingWords(true);
    try {
      await fetch(`${apiUrl}?${ParamsWord}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            console.error("Erreur: ", data.error);
            return;
          }
          setListWord(data.data);
          setLoadingWords(false);
        });
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {loadingWords && <div>Chargement en cours...</div>}
      {!loadingWords && listWord && listWord.length === 0 && (
        <div>Aucun mot à afficher</div>
      )}
      {WordContainer(listWord, fetchData)}
    </>
  );
}
