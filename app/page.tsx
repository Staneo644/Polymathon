"use client";

import './globals.css';
import { useEffect, useState } from 'react';
import listCardComponent from '@/components/listCard';
import { completeWord } from './api/word/route';
import CardContainer from '@/components/cardContainer';

export default function Home() {
    const [listWord, setListWord] = useState<completeWord[]>([]);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(
            "http://localhost:3000/api/word/day"
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          console.log(data);
          setListWord(data.data);
          console.log(listWord);
        } catch (error) {
          console.error("Fetch error:", error);
        }
      };
  
      fetchData();
    }, []);

    return <div className="overflow-hidden">{CardContainer(listWord, setListWord, () => {})}</div>;
    //return <>{listCardComponent(listWord, setListWord, null)}</>;  
}
