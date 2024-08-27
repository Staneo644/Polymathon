"use client";
import form from "@/components/form";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { completeWord } from "@/utils/word/completeWord";
import { NewWord } from "@/utils/word/newWord";
import { WordRow } from "@/utils/word/word";

export default function MoreWorlds() {
  const searchParam = useSearchParams();
  const wordId = [searchParam?.get("id") ?? ""][0];
  const [word, setWord] = useState<WordRow | null>(null);
  const param = new URLSearchParams({ id: wordId });

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
    fetch(`http://localhost:3000/api/word/id?${param}`, {
      method: "GET",
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            setWord(data.data.data[0]);
          });
        }
      })
      .catch((e) => {
        console.error("erreur: ", e);
      });
  }, [wordId]);

  return form(word?.name ?? "", word, addWord, null);
}
