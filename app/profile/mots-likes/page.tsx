"use client";
import { useState, useEffect } from "react";
import { completeWord } from "@/utils/word/enrichWord";
import WordContainer from "@/components/wordContainer";
import { wordLimit } from "@/app/search/page";


export default function Search() {
  const [loadingWords, setLoadingWords] = useState(true);
  const [listWord, setListWord] = useState<completeWord[]>([]);

  const fetchData = async (empty?: Boolean) => {
    setLoadingWords(true);
    try {
      await fetch(
        "/api/word?limit=" + wordLimit
      )
        .then((res) => res.json())
        .then((data) => {
          console.log(data.data);
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
          console.log(listWord);
        });
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    setListWord([]);
    fetchData(true);
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
