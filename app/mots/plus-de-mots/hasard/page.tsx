'use client';
import { useState } from 'react';
import '../../../globals.css';
import listCardComponent from '@/components/listCard';
import type { word_id } from '@/components/entity';
//import { getDayWord, getRandomWord } from '../../../communication/word';
import { useEffect } from 'react';

const randoWords = (): JSX.Element => {
  const [listWord, setListWord] = useState<word_id[]>([]);

  useEffect(() => {
    /*getRandomWord().then((res) => {
      if (res) setListWord(res);
    });*/
  }, []);

  const getMoreWords = () => {
    /*getRandomWord().then((res) => {
      const newList = listWord.concat(res);
      setListWord(newList);
    });*/
  };

  return <>{listCardComponent(listWord, setListWord, getMoreWords)}</>;
};
export default randoWords;
