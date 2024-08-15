"use client";

import { useEffect, useState } from "react";
import { NewWord } from "@/utils/word/newWord";
import { ThemeRow } from "@/utils/theme/theme";
import { CustomSelect } from "./customSelect";
import { completeWord } from "@/utils/word/completeWord";
import { getIdByName } from "@/utils/theme/convert-theme";

export default function form(
  name: string,
  word: completeWord | null,
  click: (word: NewWord) => void,
  reject: null | (() => void)
): JSX.Element {
  const [searchWord, setSearchWord] = useState("");
  const [definition, setDefinition] = useState("");
  const [etymology, setetymology] = useState("");
  const [example, setExample] = useState("");
  const [type, setType] = useState("");
  const [theme, setTheme] = useState<number | null>();
  const [completeField, setCompleteField] = useState(false);
  const [themes, setThemes] = useState<ThemeRow[]>();

  useEffect(() => {
      fetch('http://localhost:3000/api/theme', { method: 'GET' })
        .then((response) => {
          if (response.ok) {
            response.json().then((data) => {
              setThemes(data.data);
              if (word !== null && word.theme !== null) {
                setTheme(getIdByName(data.data, word.theme));
              }
            });
          }
        })
        .catch((e) => {
          console.error('erreur: ', e);
        });
    }, []);

  useEffect(() => {
    if (word === null) {
      setSearchWord(name);
    } else {
      setSearchWord(word.name);
      setDefinition(word.definition);
      setetymology(word.etymology);
      setExample(word.example ?? "");
      setType(word.type);
    }
  }, [name, word]);

  return (
    <div className="flex flex-col items-center h-full w-100 justify-evenly text-black">
      <input
        type="text"
        placeholder="Mot"
        className="custom-width border rounded p-2"
        value={searchWord}
        onChange={(e) => setSearchWord(e.target.value)}
      />
      <select
        className={`border rounded p-2 custom-width ${
          type === "" ? "text-gray-400" : ""
        }`}
        onChange={(e) => setType(e.target.value)}
        value={type}
      >
        <option
          value=""
          disabled
          hidden
          style={{ fontStyle: "italic", color: "grey" }}
        >
          Selectionnez
        </option>
        <option value="adj">Adjectif</option>
        <option value="n.m.">Nom masculin</option>
        <option value="n.f.">Nom féminin</option>
        <option value="v">Verbe</option>
        <option value="adv">Adverbe</option>
        <option value="expr">Expression</option>
        <option value="autre">Autre</option>
      </select>
      <CustomSelect
        setCurrent={(current: number) => setTheme(current)}
        themes={themes ?? []}
        current={theme ?? 0}
      />
      <textarea
        placeholder="Définition"
        className="border rounded p-2 custom-width"
        onChange={(e) => setDefinition(e.target.value)}
        value={definition}
      ></textarea>
      <textarea
        placeholder="Étymologie"
        className="border rounded p-2 custom-width"
        onChange={(e) => setetymology(e.target.value)}
        value={etymology}
      />
      <textarea
        placeholder="Exemples"
        className="border rounded p-2 custom-width"
        onChange={(e) => setExample(e.target.value)}
        value={example}
      ></textarea>

      {completeField && (
        <p className="text-red-500 mb-4">Veuillez remplir tous les champs</p>
      )}

      <button
        className="bg-blue-500 text-white py-2 px-4 rounded custom-width"
        onClick={() => {
          if (
            searchWord == "" ||
            etymology == "" ||
            definition === "" ||
            type === "" ||
            example === "" ||
            theme === undefined
          ) {
            setCompleteField(true);
            return;
          }
          click({
            name: searchWord,
            etymology: etymology,
            definition: definition,
            type: type,
            example: example,
            theme: theme,
          });
        }}
      >
        Soumettre
      </button>
      {reject && (
        <button
          className="bg-red-500 text-white py-2 px-4 rounded custom-width"
          onClick={() => {
            reject();
          }}
        >
          Rejeter
        </button>
      )}
    </div>
  );
}
