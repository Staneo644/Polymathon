"use client";
import { useState } from "react";
import type { ReactElement } from "react";
import listCardComponent from "@/components/listCard";
import type { word_id } from "@/components/entity";
//import { getDayWord } from '../../communication/word';
import "../../globals.css";
import { useEffect } from "react";

const Daywords = (): JSX.Element => {
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
        // setListWord(data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
  
    /*getDayWord().then((res) => {
      if (res) setListWord(res);
    });*/
  }, []);

  return <>{listCardComponent(listWord, setListWord, null)}</>;
};
export default Daywords;
