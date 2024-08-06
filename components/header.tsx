'use client';
import React, { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './button';
import { faCog, faUser, faSearch, faPlus, faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Header({ children }: { children: React.ReactNode }): JSX.Element {

  const router = useRouter();
  const [isList, setIsList] = useState(false);
  const [token, setToken] = useState(false);
  const buttonRef: RefObject<HTMLDivElement> = useRef(null);
  const optionRef: RefObject<HTMLButtonElement> = useRef(null);

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

  const connectionClick = (): void => {
    router.push('/options/connexion');
    setIsList(false);
  };

  const setOptionVisible = (): void => {
    setIsList(!isList);
  };

  const goBackClick = (): void => {
    router.back();
  };

  const parametreClick = (): void => {
    router.push('/options/parametre');
    setIsList(false);
  }

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
        <button onClick={goBackClick}>
          <FontAwesomeIcon icon={faUser} className="text-gray-800 text-2xl ml-2" />
        </button>
        <button
          className="text-gray-800 text-2xl font-bold"
          onClick={handleTitleClick}
        >
          Polymathon
        </button>
        <button onClick={setOptionVisible} ref={optionRef}>
          <FontAwesomeIcon icon={faCog} className="text-gray-800 text-2xl mr-1" />
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
      <footer className="bg-gray-100 p-2 flex justify-evenly items-center p-3">
        <button onClick={() => router.push('/')}>

      <FontAwesomeIcon icon={faHome} className="text-gray-800 text-2xl" />
        </button>
        <button onClick={() => router.push('/search')}>

      <FontAwesomeIcon icon={faSearch} className="text-gray-800 text-2xl" />
        </button>
        <button onClick={() => router.push('/more-worlds')}>
      <FontAwesomeIcon icon={faPlus} className="text-gray-800 text-2xl" />
        </button>
      </footer>
    </>
  );
}

export default Header;
