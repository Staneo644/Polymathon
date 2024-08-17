"use client";

import backgroundImage from "@/public/images/background-card-2.png";
import { YellowButton } from "@/components/button";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface WordPreview {
  id: number;
  name: string;
  distance: number;
}

export default function MoreWorld () {
    const [inputValue, setInputValue] = useState('');
    const [debouncedValue, setDebouncedValue] = useState(inputValue);
    const [isAdmin, setIsAdmin] = useState(false);
    const [listSearchedWord, setListSearchedWord] = useState<WordPreview[]>([]);
    const router = useRouter();
  
    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(inputValue);
      }, 300);
  
      return () => {
        clearTimeout(handler);
      };
    }, [inputValue]);
  
    useEffect(() => {
      if (debouncedValue) {
        fetch("http://localhost:3000/api/word/search?text=" + debouncedValue, {method: 'GET'}).then((response) => {
          if (response.ok) {
            response.json().then((data) => {
              setListSearchedWord(data.data);
            });
          }
        }
        ).catch((e) => {
          console.error("erreur: ", e);
        });
      }
    }, [debouncedValue]);

    useEffect(() => {
      fetch("http://localhost:3000/api/profile", {method: 'GET'}).then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            setIsAdmin(data.data.admin);
            console.log(data.data);
          });
        }
      }
      ).catch((e) => {
        console.error("erreur: ", e);
      });
    }, []);
    
    return (
      <>
        <div className="flex items-center w-full h-1/3 flex-col">
        <p className="text-[var(--yellow)] mt-10 font-bold">Entrez le mot à modifier ou ajouter</p>
        <div className="relative">
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        type="text"
        className="w-full py-2 pr-12 pl-4 border mt-2 text-black border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Entrez quelque chose..."
        />
    </div>
        </div>
        <div className="flex items-center w-full b-4 flex-col"> 
          <YellowButton onClick={() => {router.push("/plus-de-mots/ajouter-un-mot?word=" + inputValue)}} inactive={inputValue.length == 0} className={"font-bold py-2 px-4 rounded-full mt-4"}>
            Ajouter
            </YellowButton>
            {isAdmin && <YellowButton onClick={() => {router.push("/plus-de-mots/valider-un-mot")}} className={"font-bold py-2 px-4 rounded-full mt-4"}>
            Valide les mots mon pitit BG d'admin
            </YellowButton>}

        </div>
        <div className="flex items-center w-full h-1/2 flex-col">
          <p className="text-[var(--yellow)] mt-10 font-bold">Liste des mots</p>
          <div className="flex flex-col items-center w-full align-center items-center overflow-scroll">
            {listSearchedWord.map((word) => {
              return (                  
                    <button key={word.id} onClick={() => {router.push("/plus-de-mots/modifier-un-mot?id=" + word.id)}} className={`text-gray-900 font-bold px-4 rounded-full flex items-center w-1/2 my-2 justify-between`}
                      style={{
                        backgroundImage: `url(${backgroundImage.src})`,
                        borderRadius: "20px",
                        backgroundSize: "cover",
                      }}
                      >
                      {word.name} <div className="h-12 w-1 bg-black mx-4 opacity-50"/> {" "}
                      modifier
                    </button>
                  
              );
            })}
          </div>
        </div>
        </>
    )
}