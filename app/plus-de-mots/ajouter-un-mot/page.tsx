"use client";
import form from "@/components/form";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { WordRow } from "@/utils/word/word";
import { completeWord } from "@/utils/word/completeWord";
import { NewWord } from "@/utils/word/newWord";

export default function MoreWorlds() {
  const searchParam = useSearchParams();
  const wordName = [searchParam?.get("word") ?? ""][0];
  const [word, setWord] = useState<completeWord | null>(null);
  const param = new URLSearchParams({ word: wordName });

  const addWord = async (word: NewWord) => {
    await fetch("http://localhost:3000/api/word", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(word),
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            console.log("Le mot a bien été ajouté", data);
          });
        }
      })
      .catch((e) => {
        console.error("erreur: ", e);
      });
  };

  useEffect(() => {
    fetch(`http://localhost:3000/api/word?${param}`, {
      method: "GET",
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            setWord(data);
          });
        }
      })
      .catch((e) => {
        console.error("erreur: ", e);
      });
  }, [wordName]);

  return form(wordName, word, addWord, null);
}
