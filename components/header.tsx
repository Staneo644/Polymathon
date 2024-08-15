'use client';
import { useRouter, usePathname } from 'next/navigation';
import { faUser, faSearch, faPlus, faHome, faMessage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode } from 'react';

function Header({ children }: { children: ReactNode }): JSX.Element {
  const router = useRouter();
  const buttonTexture = "text-gray-800 text-2xl cursor-pointer "
  const buttonTextureDown = buttonTexture + "w-1/3 pt-2 pb-3 hover:bg-gray-200 active:bg-gray-300 duration-300"
  const buttonTextureDownActived = buttonTexture + "w-1/3 pt-1.5 pb-1.5 bg-gray-300 duration-300 text-3xl"
  const actualPage = usePathname();

  return (
    <>
      <header className="relative w-full bg-gray-100 p-2 flex justify-between items-center">  
          <FontAwesomeIcon icon={faMessage} className={actualPage == '/contacte' ? (buttonTexture + "mr-1 text-3xl") : (buttonTexture + "mr-1")} onClick={() => router.push('/contacte')}/>
        <button
          className={buttonTexture + " font-bold font-serif italic"}
          onClick={() => router.push('/')}
        >
          Polymathon
        </button>
        <FontAwesomeIcon icon={faUser} className={actualPage == '/profile' ? (buttonTexture + "ml-2 text-3xl") : (buttonTexture + "ml-2")} onClick={() => router.push('/profile')}/>
      </header>
      {children}
      <footer className="relative w-full b-0 bg-gray-100 flex justify-evenly items-center">
        <FontAwesomeIcon icon={faHome} className={actualPage == '/' ? buttonTextureDownActived : buttonTextureDown} onClick={() => router.push('/')}/>
        <FontAwesomeIcon icon={faSearch} className={actualPage == '/rechercher' ? buttonTextureDownActived : buttonTextureDown} onClick={() => router.push('/rechercher')} />
        <FontAwesomeIcon icon={faPlus} className={actualPage == '/plus-de-mots' ? buttonTextureDownActived : buttonTextureDown} onClick={() => router.push('/plus-de-mots')} />
      </footer>
    </>
  );
}

export default Header;
