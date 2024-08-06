'use client';
import React, { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { Button } from './button';
import { faCog, faUser, faSearch, faPlus, faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Header({ children }: { children: React.ReactNode }): JSX.Element {

  const router = useRouter();
  const [isList, setIsList] = useState(false);
  const [token, setToken] = useState(false);
  const buttonRef: RefObject<HTMLDivElement> = useRef(null);
  const optionRef: RefObject<HTMLButtonElement> = useRef(null);
  const pages = ['/', '/search', '/more-worlds'];
  const buttonTexture = "text-gray-800 text-2xl "
  const buttonTextureDown =buttonTexture + "w-1/3 pt-2 pb-3 hover:bg-gray-200 active:bg-gray-300 duration-300"
  const buttonTextureDownActived = buttonTexture + "w-1/3 pt-1.5 pb-1.5 bg-gray-300 duration-300 text-3xl"
  const actualPage = usePathname();
  console.log(actualPage);

  const handleTitleClick = (): void => {
    router.push('/');
    setIsList(false);
  };

  const contactClick = (): void => {
    router.push('/options/contact');
    setIsList(false);
  };

  
  const profilClick = (): void => {
    router.push('/options/profil');
    setIsList(false);
  };

  const logoutClick = (): void => {
    localStorage.removeItem('access_token');
    setToken(false);
    router.push('/');
    setIsList(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        buttonRef.current?.contains(event.target as Node) === false &&
        optionRef.current?.contains(event.target as Node) === false
      ) {
        setIsList(false);
      }
    };

    document.addEventListener('mouseup', handleClickOutside);

    if (localStorage.getItem('access_token') !== null) {
      setToken(true);
      console.log('Connecté');
    } else {
      console.log('Déconnecté');
    }

    return () => {
      document.removeEventListener('mouseup', handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className="bg-gray-100 p-2 flex justify-between items-center z-10">
        <button onClick={() => router.push('/profile')}>
          <FontAwesomeIcon icon={faUser} className={buttonTexture + "ml-2"}/>
        </button>
        <button
          className={buttonTexture + " font-bold"}
          onClick={handleTitleClick}
        >
          Polymathon
        </button>
        <button onClick={() => router.push('/option')} ref={optionRef}>
          <FontAwesomeIcon icon={faCog} className={buttonTexture + "mr-1"} />
        </button>
      </header>
      {isList && (
  <div
    ref={buttonRef}
    className="absolute top-12 right-0 z-10 bg-gray-200 text-gray-600 rounded-lg shadow-lg flex flex-col"
  >
    {/*!token && (
      <div
        className="p-4 hover:bg-gray-700 cursor-pointer"
        onClick={connectionClick}
      >
        <h4>connexion</h4>
      </div>
    )*/}
    {/*token*/ true && (
      <>
        <Button onClick={logoutClick} category="Header">
          déconnexion
        </Button>
        <Button onClick={profilClick} category="Header">
          profil
        </Button>
      </>
    )}
    <Button onClick={contactClick} category="Header">
      contact
    </Button>
  </div>
)}
      {children}
      <footer className="bg-gray-100 flex justify-evenly items-center">
      <FontAwesomeIcon icon={faHome} className={actualPage == '/' ? buttonTextureDownActived : buttonTextureDown} onClick={() => router.push('/')}/>
     <FontAwesomeIcon icon={faSearch} className={actualPage == '/search' ? buttonTextureDownActived : buttonTextureDown} onClick={() => router.push('/search')} />
      <FontAwesomeIcon icon={faPlus} className={actualPage == '/more-worlds' ? buttonTextureDownActived : buttonTextureDown} onClick={() => router.push('/more-worlds')} />
      
      </footer>
    </>
  );
}

export default Header;
