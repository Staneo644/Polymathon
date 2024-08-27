"use client";

import form from "@/components/form";
import { ThemeRow } from "@/utils/theme/theme";
import { completeWord } from "@/utils/word/completeWord";
import { NewWord } from "@/utils/word/newWord";
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
      { method: "GET" },
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
    if (words && words.length > 0)
      fetch(
        `http://localhost:3000/api/word/id?${new URLSearchParams({ id: words[index].id.toString() })}`,
        { method: "GET" },
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

  const acceptWord = async (word: NewWord) => {
    const w = words[index];
    const body = {
      id: w.id,
      name: word.name,
      definition: word.definition,
      type: word.type,
      etymology: word.etymology,
      example: word.example,
      theme: word.theme,
    };
    console.log(body);
    // ecraser la proposition de mot
    fetch(`http://localhost:3000/api/word`, {
      method: "PATCH",
      body: JSON.stringify(body),
    })
      .then(async (response) => {
        return await response.json();
      })
      .then((data) => {
        console.log(data);
        if (data.error) return;
        fetch(`http://localhost:3000/api/word/validate`, {
          method: "PATCH",
          body: JSON.stringify({ id: w.id, validated: true }),
        })
          .then(async (response) => {
            return await response.json();
          })
          .then((data) => {
            console.log(data);
            if (data.error) return;
            setIndex(index + 1);
          })
          .catch((e) => {
            console.error("erreur: ", e);
          });
      })
      .catch((e) => {
        console.error("erreur: ", e);
      });

    // valider le mot
  };

  const rejectWord = async () => {
    const w = words[index];
    fetch(`http://localhost:3000/api/word/refuse`, {
      method: "PATCH",
      body: JSON.stringify({ id: w.id }),
    })
      .then(async (response) => {
        return await response.json();
      })
      .then((data) => {
        console.log(data);
        if (data.error) return;
        setIndex(index + 1);
      })
      .catch((e) => {
        console.error("erreur: ", e);
      });
  };

  return (
    <>
      <h1 className="absolute l-0">
        {isWordAdded ? "Mot ajouté" : "Mot modifié"}
      </h1>
      {isWordAdded ? <></> : <p className="absolute mt-10">{compareWord}</p>}
      {form(
        words && words.length > 0 ? words[index].name : "",
        words && words.length > 0 ? words[index] : null,
        acceptWord,
        rejectWord,
      )}
    </>
  );
}
