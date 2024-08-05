'use client';
import { useState } from 'react';
import '../../../../globals.css';
import listCardComponent from '@/app/components/listCard';
import type { word_id } from '@/app/communication/entity';
import { getWordsByThemes } from '@/app/communication/word';
import { useEffect } from 'react';
import shuffle from 'shuffle-array';
import { useSearchParams } from 'next/navigation';

export default function WordTheme(){
    const searchParam = useSearchParams();
    const [word, setWord] = useState<word_id[]>([]);

    useEffect(() => {
        const id = searchParam?.get('themes') ?? '';
        if (id === '') return;
        getWordsByThemes(id.split(',')).then((res) => {
            if (res) setWord(shuffle(res));
        });
    }, []);

    return <>{listCardComponent(word, setWord, null)}</>;
}