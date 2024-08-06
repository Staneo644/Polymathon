'use client';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { faCog, faUser, faSearch, faPlus, faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Header({ children }: { children: React.ReactNode }): JSX.Element {
  const router = useRouter();
  const buttonTexture = "text-gray-800 text-2xl cursor-pointer "
  const buttonTextureDown = buttonTexture + "w-1/3 pt-2 pb-3 hover:bg-gray-200 active:bg-gray-300 duration-300"
  const buttonTextureDownActived = buttonTexture + "w-1/3 pt-1.5 pb-1.5 bg-gray-300 duration-300 text-3xl"
  const actualPage = usePathname();

  return (
    <>
      <header className="bg-gray-100 p-2 flex justify-between items-center z-10">  
        <FontAwesomeIcon icon={faUser} className={buttonTexture + "ml-2"} onClick={() => router.push('/profile')}/>
        <button
          className={buttonTexture + " font-bold"}
          onClick={() => router.push('/')}
        >
          Polymathon
        </button>
        <FontAwesomeIcon icon={faCog} className={buttonTexture + "mr-1"} onClick={() => router.push('/option')}/>
      </header>
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
