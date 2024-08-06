'use client';
import { useState } from 'react';
import type { ReactElement } from 'react';
import listCardComponent from '@/components/listCard';
import type { word_id } from '@/components/entity';
//import { getDayWord } from '../../communication/word';
import '../../globals.css';
import { useEffect } from 'react';

const Daywords = (): JSX.Element => {
  const [listWord, setListWord] = useState<word_id[]>([]);

  useEffect(() => {
    fetch('/api/word_of_the_day').then((res) => {
      if (res.ok) {
        return res.json();
      }
    }).then((res) => {
      if (res) setListWord(res);
    });
    /*getDayWord().then((res) => {
      if (res) setListWord(res);
    });*/
  }, []);


  return <>{listCardComponent(listWord, setListWord, null)}</>;
};
export default Daywords;
