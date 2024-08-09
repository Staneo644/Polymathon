"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";



export default function Profile() {
    const router = useRouter();
    const [showLogout, setShowLogout] = useState(false);

    const SeeButton = ({ newURL }: {newURL: string}) => (
      <button className="bg-[var(--blue)] rounded-full px-2 py-1" onClick={() => router.push(newURL)}>
        Voir
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
            <button className="bg-red-600 rounded-full p-2 w-1/3 text-white">Oui</button>
            <button className="bg-[var(--blue)] rounded-full p-2 w-1/3 text-white" onClick={() => setShowLogout(false)}>Non</button>
            </div>
            </div>
            </div>
        }
        <div className="w-3/4 mx-auto font-serif italic relative l-[50%] flex justify-center flex-col">
        
        
        <div className="flex justify-between mt-4">
        <p>Cliquer pour montrer la définition</p>
        <input type="checkbox" className="ml-2"/>
        </div>
        <hr className="m-4" />
        <div className="flex justify-between">
        <p>Cacher les likes et les dislikes</p>
        <input type="checkbox" className="ml-2" />

        </div>
    <hr className="m-4" />
        <button className="bg-red-600 rounded-full p-2 w-1/3 mx-auto min-w-32" onClick={() => setShowLogout(true)}>Déconnexion</button>
        <hr className="m-4" />

        </div>
        <div className="w-3/4 mx-auto mt-4">
        <div className="flex justify-between">
        Mots vues : {0}
        <SeeButton newURL="/profile/mots-vus" />
        </div>
        <div className="flex justify-between mt-2">

        Mots likés : {0}
        <SeeButton newURL="/profile/mots-likes" />
        </div>
        <div className="flex justify-between mt-2">

        Mots dislikés : {0}
        <SeeButton newURL="/profile/mots-dislikes" />
        </div>
        </div>
        </>
    );
    }