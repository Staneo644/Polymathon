"use client";

import form from "@/components/form";
import { ThemeRow } from "@/utils/theme/theme";
import { completeWord } from "@/utils/word/completeWord";
import { useEffect, useState } from "react";

const findTheme = (theme: number, themes: ThemeRow[]) => {
  return themes.find((t) => t.id == theme);
};

export default function validateWords() {
  const [index, setIndex] = useState(0);
  const [words, setWords] = useState<completeWord[]>([]);
  const [isWordAdded, setIsWordAdded] = useState(true);
  const [themes, setThemes] = useState([]);
  const [compareWord, setCompareWord] = useState("");

  useEffect(() => {
    fetch(
      `http://localhost:3000/api/word/unvalidated?${new URLSearchParams({ limit: "20" })}`,
      { method: "GET" }
    )
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            setWords(data.data);
            console.log(data);
          });
        }
      })
      .catch((e) => {
        console.error("erreur: ", e);
      });
    fetch(`http://localhost:3000/api/theme`, { method: "GET" })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            setThemes(data.data);
            console.log(data);
          });
        }
      })
      .catch((e) => {
        console.error("erreur: ", e);
      });
  }, []);

  useEffect(() => {
    if (words.length > 0)
      fetch(
        `http://localhost:3000/api/word/name?${new URLSearchParams({ name: words[index].name })}`,
        { method: "GET" }
      )
        .then((response) => {
          if (response.ok) {
            response.json().then((data) => {
              if (data.data.data && data.data.data.length > 0) {
                setIsWordAdded(false);
                let text = "";
                if (data.data.data[0].definition != words[index].definition) {
                  text += "definition: " + data.data.data[0].definition;
                }
                if (data.data.data[0].type != words[index].type) {
                  text += "type: " + data.data.data[0].type;
                }
                if (data.data.data[0].etymology != words[index].etymology) {
                  text += "etymology: " + data.data.data[0].etymology;
                }
                if (
                  findTheme(data.data.data[0].theme, themes)?.name !=
                  words[index].theme
                ) {
                  text += "theme: " + data.data.data[0].theme;
                }
                if (data.data.data[0].example != words[index].example) {
                  text += "example: " + data.data.data[0].example;
                }
                setCompareWord(text);

                console.log(data.data.data[0].definition);
                console.log(data.data.data[0].type);
                console.log(data.data.data[0].etymology);
                console.log(data.data.data[0].theme);
                console.log(data.data.data[0].example);
                console.log(compareWord);
              }
            });
          }
        })
        .catch((e) => {
          console.error("erreur: ", e);
        });
  }, [index, words, themes]);

  const acceptWord = async () => {
    //createPotentialWord(word, -1);
  };

  const rejectWord = async () => {
    //createPotentialWord(word, -1);
  };

  return (
    <>
      <h1 className="absolute l-0">
        {isWordAdded ? "Mot ajouté" : "Mot modifié"}
      </h1>
      {isWordAdded ? <></> : <p className="absolute mt-10">{compareWord}</p>}
      {form(
        "",
        words && words.length > 0 ? words[index] : null,
        acceptWord,
        rejectWord
      )}
    </>
  );
}
