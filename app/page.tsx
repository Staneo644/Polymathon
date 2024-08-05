"use client";

import { Button } from '@/components/button';
import './globals.css';
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();
    return (
      <main className='h-full'>
        <div className="flex flex-col items-center h-full justify-evenly ">
          <Button onClick={() => router.push('/mots/mots-du-jour')}>Mots du jour</Button>
          <Button onClick={() => router.push('/mots/plus-de-mots')}>Plus de mots</Button>
          <Button onClick={() => router.push('/chercher')}>Chercher</Button>
        </div>
      </main>
  );
}
