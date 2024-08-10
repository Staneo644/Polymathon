"use client";

import { YellowButton } from "@/components/button";
import { useState, useEffect } from "react";

export default function MoreWorld () {
    const [inputValue, setInputValue] = useState('');
    const [debouncedValue, setDebouncedValue] = useState(inputValue);
  
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
        //TO COMPLETE
      }
    }, [debouncedValue]);
    
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
          <YellowButton onClick={() => {}} inactive={inputValue.length == 0} className={"font-bold py-2 px-4 rounded-full mt-4"}>
            Ajouter
            </YellowButton>

        </div>
        </>
    )
}