'use client';
//import { checkboxTheme } from '@/app/components/theme';
import { useState } from 'react';
import '../../../globals.css';
import { useRouter } from 'next/navigation';

export default function SearchByTheme() {
  const [selectedTheme, setSelectedTheme] = useState<string[]>([]);
  const router = useRouter();

  return (<>
    <div className="absolute top-20 left-1/2 transform -translate-x-1/2">
        {/* De quels thèmes voules-vous voir les mots ?   */}
        {/*checkboxTheme(selectedTheme, setSelectedTheme)*/}
        <button className='' onClick={() => router.push('/mots/plus-de-mots/themes/mots?themes=' + selectedTheme)}>
          Valider
        </button>
    </div>

    <div className="absolute top-20 left-1/2 transform -translate-y-1/2">
    </div>
  </>
  );
}
