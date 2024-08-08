"use client";
import form from "@/components/form";
import { completeWord } from "../../api/word/route";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function MoreWorlds() {
    
        const searchParam = useSearchParams();
        const [wordId, setWordId] = useState([searchParam?.get('mot') ?? '']);
      
        const addWord = async (word: completeWord) => {
          //createPotentialWord(word, -1);
        };
      
        return form(wordId, addWord, null);
      }
      
    