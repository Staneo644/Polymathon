"use client";

import { Button } from '@/components/button';
import './globals.css';
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import listCardComponent from '@/components/listCard';
import { word_id } from '@/components/entity';

export default function Home() {
    const [listWord, setListWord] = useState<word_id[]>([]);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(
            "http://localhost:3000/api/word_of_the_day"
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          console.log(data);
          setListWord(data);
        } catch (error) {
          console.error("Fetch error:", error);
        }
      };
  
      fetchData();
    }, []);

    return <>{listCardComponent(listWord, setListWord, null)}</>;
  
}
