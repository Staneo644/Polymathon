"use client";

import "./globals.css";
import { useEffect, useState } from "react";
import { completeWord } from "@/utils/word/enrichWord";
import CardContainer from "@/components/cardContainer";

export default function Home() {
  const [listWord, setListWord] = useState<completeWord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/word/day");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        setIsLoading(false);
        const data = await response.json();
        setListWord(data.data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="overflow-hidden">
      {isLoading && <div>Chargement en cours...</div>}
      {!isLoading && listWord.length === 0 && <div>Aucun mot à afficher</div>}

      {CardContainer(listWord, setListWord, () => {})}
    </div>
  );
  //return <>{listCardComponent(listWord, setListWord, null)}</>;
}
