"use client";
import { logout } from "@/utils/supabase/logout";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function Checkbox(status: boolean, setStatus: (status: boolean) => void) {
  return (
    
     <button className={`w-6 h-6 ${status ? "bg-blue-400" : "bg-gray-200"} rounded-md flex items-center justify-center cursor-pointer shadow-sm hover:bg-gray-300 peer-checked:bg-blue-600 peer-checked:border-transparent transition-all duration-300`}
      onClick={() => setStatus(!status)}
     >
      <svg
        className={`w-8 h-8 text-wgite peer-checked:block ${status ? "block" : "hidden"}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
      </svg>
</button>
  );
}


export default function Profile() {
    const router = useRouter();
    const [showLogout, setShowLogout] = useState(false);
    const [statusHideDefinition, setStatusHideDefinition] = useState(localStorage.getItem('hideDefinition') == 'true');
    const [statusHideLikesDislikes, setStatusHideLikesDislikes] = useState(localStorage.getItem('hideLikesDislikes') == 'true');
    const [seenWords, setSeenWords] = useState();
      const [likedWords, setLikedWords] = useState();
      const [dislikedWords, setDislikedWords] = useState();

      useEffect(() => {
        fetch("http://localhost:3000/api/stats", {method: 'GET'}).then((response) => {
          if (response.ok) {
            response.json().then((data) => {
              setSeenWords(data.views);
                  setLikedWords(data.likes);
                  setDislikedWords(data.dislikes);
            });
          }
        }
        ).catch((e) => {
          console.error("erreur: ", e);
        });

        fetch("http://localhost:3000/api/profile", {method: 'GET'}).then((response) => {
          if (response.ok) {
            response.json().then((data) => {
              setStatusHideDefinition(data.data.hide_definition);
              setStatusHideLikesDislikes(data.data.hide_likes);
            });
          }
        }
        ).catch((e) => {
          console.error("erreur: ", e);
        });
      }, []);


    const hideDefinition = (e: any) => {
        fetch("http://localhost:3000/api/profile", {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({hide_definition: e.target.checked, hide_likes: statusHideLikesDislikes})
        }).then((response) => {
          if (response.ok) {
            response.json().then((data) => {
              setStatusHideDefinition(e.target.checked);
            });
          }
        }
        ).catch((e) => {
          console.error("erreur: ", e);
        });
    }

    const hideLikesDislikes = async (e: any) => {
        fetch("http://localhost:3000/api/profile", {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({hide_likes: e.target.checked, hide_definition: statusHideDefinition})
        }).then((response) => {
          if (response.ok) {
            response.json().then((data) => {
              setStatusHideLikesDislikes(e.target.checked);
            });
          }
        }
        ).catch((e) => {
          console.error("erreur: ", e);
        });
    }

    const SeeButton = ({ newURL, content, className }: {newURL: string; content?:string; className?:string}) => (
      <button className={"bg-[var(--blue)] rounded-full px-2 py-1 " + className} onClick={() => router.push(newURL)}>
        {content ? content : "Voir"}
      </button>
    );
    return (
        <>
        {showLogout && 
            <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50">
            <div className="w-2/3 mx-auto mt-32 bg-white p-4 rounded-lg text-black font-serif italic">
            <p>Êtes-vous sûr de vouloir vous déconnecter ?</p>
            <br />
            <div className="flex justify-between">
            <button className="bg-red-600 rounded-full p-2 w-1/3 text-white" onClick={() => {logout().then(router.refresh)}}>Oui</button>
            <button className="bg-[var(--blue)] rounded-full p-2 w-1/3 text-white" onClick={() => setShowLogout(false)}>Non</button>
            </div>
            </div>
            </div>
        }
        <div className="w-3/4 mx-auto font-serif italic relative l-[50%] flex justify-center flex-col">
        
        
        <div className="flex justify-between mt-4">
        <p>Cliquer pour montrer la définition</p>
        <input type="checkbox" className="ml-2" onChange={hideDefinition} checked={statusHideDefinition}/>
        </div>
        <hr className="m-4" />
        <div className="flex justify-between">
        <p>Cacher les likes et les dislikes</p>
        <input type="checkbox" className="ml-2" onChange={hideLikesDislikes} checked={statusHideLikesDislikes}/>

        </div>
    <hr className="m-4" />
        <button className="bg-red-600 rounded-full p-2 w-1/3 mx-auto min-w-32" onClick={() => setShowLogout(true)}>Déconnexion</button>
        <hr className="m-4" />

        </div>
        <div className="w-3/4 mx-auto mt-4">
        <div className="flex justify-between">
        Mots vues : {seenWords}
        </div>
        <div className="flex justify-between mt-2">

        Mots favoris : {likedWords}
        <SeeButton newURL="/profile/mots-favoris" />
        </div>
        <div className="flex justify-between mt-2">

        Mots désapprouvés : {dislikedWords}
        <SeeButton newURL="/profile/mots-desapprouves" />
        </div>
        <div className="flex justify-between mt-2">

        {Checkbox(statusHideLikesDislikes, setStatusHideLikesDislikes)}

        <SeeButton newURL="/statistiques-generales/mots-populaires" content="Les plus populaires" className="mr-2"/>
        <SeeButton newURL="/statistiques-generales/mots-impopulaires" content="Les moins populaires" className="ml-4"/>
        </div>
        </div>
        </>
    );
    }
