"use client";
import form from "@/components/form";
import { completeWord } from "@/utils/word/enrichWord";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function MoreWorlds() {
    
        const searchParam = useSearchParams();
        const wordName = ([searchParam?.get('word') ?? ''])[0];
        const [word, setWord] = useState<completeWord | null>(null);
      
        const addWord = async (word: completeWord) => {
          //createPotentialWord(word, -1);
        };
        const param = new URLSearchParams(
          {word: wordName}
        );

        useEffect(() => {
          fetch(`http://localhost:3000/api/word?${param}` + wordName, {method: 'GET'}).then((response) => {
            if (response.ok) {
              response.json().then((data) => {
                setWord(data);
              });
            }
          }
          ).catch((e) => {
            console.error("erreur: ", e);
          });
        }, [wordName]);
      
        return form(wordName, word, addWord, null);
      }
      
    