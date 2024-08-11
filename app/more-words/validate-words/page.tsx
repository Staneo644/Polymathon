"use client";

import form from "@/components/form";
import { completeWord } from "@/utils/word/enrichWord";
import { useEffect, useState } from "react";

export default function validateWords() {
    const [index, setIndex] = useState(0);
    const [words, setWords] = useState<completeWord[]>([]);
    console.log(words);
    useEffect(() => {
        fetch("http://localhost:3000/api/word/unvalidated?", {method: 'GET'}).then((response) => {
        if (response.ok) {
            response.json().then((data) => {
            setWords(data.data);
            console.log(data);
            });
        }
        }
        ).catch((e) => {
        console.error("erreur: ", e);
        });
    }, []);

    const acceptWord = async () => {
        //createPotentialWord(word, -1);
    };

    const rejectWord = async () => {
        //createPotentialWord(word, -1);
    };

    return (
        <>
            { 
            form("",(words && words.length > 0) ? words[index] : null, acceptWord, rejectWord)}
        </>
    );

}