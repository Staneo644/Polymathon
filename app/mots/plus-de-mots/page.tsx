'use client';
import '../../globals.css';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/button';

function Home(): JSX.Element {
  const router = useRouter();
  return (
    <div className="flex flex-col space-y-0 items-center h-100 justify-evenly ">
      <Button onClick={() => router.push('/mots/plus-de-mots/hasard')}>Mots au hasard</Button>
      <Button onClick={() => router.push('/mots/plus-de-mots/themes')}>Par thèmes</Button>
    </div>
  );
}

export default Home;
