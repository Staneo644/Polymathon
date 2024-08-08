
import { completeWord } from '@/app/api/word/route';
import { faThumbsDown, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect, useRef, ReactNode, ForwardRefExoticComponent } from 'react';
import React, { forwardRef } from 'react';
import EtymologyComponent from './etymology';
import { wordLimit, wordNewCall } from '@/app/search/page';
import { faLessThan, faGreaterThan } from '@fortawesome/free-solid-svg-icons';

type Props = {
  //children: ReactNode;
  word: completeWord;
};

export const position = (index:number):string => index == 0 ? "-150" : index == 2 ? '15' : '0'

const Explanation = (text: string | null, theme: string | null, isDefinition: boolean, index:number, isVisible: boolean) =>
  <div className="w-100 absolute transition-transform duration-300"
    style={{

      opacity: `${isVisible ? 100 : 0}`,
      transform: `translateX(${(index == 0 ? '-100' : index == 2 ? '100' : '0')}vw)`,
    }}>
    {theme && isDefinition && (
      <span className="text-gray-600">{theme + " : "}</span>
    )} 
    {EtymologyComponent(text ?? "")}
  </div>

const OneCard = React.forwardRef<HTMLDivElement, Props>(
  (props, ref) => {
    const listItems = [props.word.example, props.word.definition, props.word.etymology];
    const [oldIndex, setOldIndex] = useState(1);
    const [currentIndex, setCurrentIndex] = useState(1);

    const handleLeft= () => {
      setOldIndex(currentIndex)
      setCurrentIndex((prevIndex) => {
        if (prevIndex === 2) {
          return 0;
        }
        return prevIndex + 1;
      }
    )
  };
  
  const handleRigth = () => {
    setOldIndex(currentIndex)
    setCurrentIndex((prevIndex) => {
      if (prevIndex === 0) {
        return 2;
      }
      return prevIndex - 1;
    }
  );
    };

    return (
    <div
    ref={ref}
  className="bg-white shadow-md rounded-lg p-4 mb-[45px] last:mb-0 text-gray-800"
  style={{
    backgroundImage:
    "url(https://s2.qwant.com/thumbr/474x323/7/5/15e7a9bcd784af960fb05e85addd943f5f08a5259bb5803b58a1b3f39473cc/th.jpg?u=https%3A%2F%2Ftse.mm.bing.net%2Fth%3Fid%3DOIP.jytUH6XTOQ7pXAgURy6LYQHaFD%26pid%3DApi&q=0&b=1&p=0&a=0)",
    borderRadius: '20px',
    backgroundSize: "cover",
  }}
>
  <div className="mt-2 ml-2 text-xl italic font-serif">
  </div>
  <div className="flex items-center justify-center whitespace-pre">
    <h3 className="font-bold italic font-serif text-2xl">
      {props.word.name}
    </h3>
    <h4 className="text-lg text-gray-600 italic">
      {"  ("}
      {props.word.type}
      {")"}
    </h4>
  </div>
  <div className="mb-2 ml-2 flex text-xl italic font-serif items-center">
  <FontAwesomeIcon icon={faLessThan} className="cursor-pointer w-auto" onClick={handleLeft}/>
  <div className="flex duration-300 transition-transform">
    {Explanation(listItems[0], props.word.theme, currentIndex == 1, currentIndex == 0 ? 2 : currentIndex - 1, currentIndex == 2 || oldIndex == 2)}
    {Explanation(listItems[1], props.word.theme, currentIndex == 1, currentIndex, currentIndex == 1 || oldIndex == 1)}
    {Explanation(listItems[2], props.word.theme, currentIndex == 1, currentIndex == 2 ? 0 : currentIndex + 1, currentIndex == 0 || oldIndex == 0 )}  
  </div>
    <FontAwesomeIcon icon={faGreaterThan} className="cursor-pointer" onClick={handleRigth}/>
  </div>
  <div className="mb-2 ml-2 flex justify-between items-center">
    <div className="relative left-0 ml-2 mb-3 mt-2">
      <button
        onClick={() => {
          //this.noteMyWord(note.positif);
        }}
      >
        <FontAwesomeIcon className="text-green-500" icon={faThumbsUp} />
      </button>
      {/*'(' + this.word.positive_note + ')'*/}
    </div>

    <div className="relative right-0 mr-2 mb-3 mt-2">
      <button
        onClick={() => {
          //this.noteMyWord(note.negatif);
        }}
      >
        <FontAwesomeIcon className="text-red-500" icon={faThumbsDown} />
      </button>
      {/*'(' + this.word.negative_note + ')'*/}
    </div>
  </div>
</div>
    )
}
);

const CardContainer = (
  list: completeWord[],
  setList: (word: completeWord[]) => void,
  onEnd: null | (() => void)
) => {
  const [startIndex, setStartIndex] = useState(0);
  const cardsRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [offset, setOffset] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [clickPoint, setClickPoint] = useState(0);
  const [position, setPosition] = useState(0);
  
  const moveUp = () => {
    setStartIndex((prevIndex) => {
      if (prevIndex > 0) {
        return (prevIndex - 1);
      }
      return prevIndex;
    });
  }
  
  const moveDown = () => {
    setStartIndex((prevIndex) => {
      if (prevIndex + 1 < list.length) {
        if (list.length - prevIndex  == wordLimit - wordNewCall && onEnd)
          onEnd();
        return (prevIndex + 1);
      }
      return prevIndex;
    });
  }
  
    const handleMouseMove = (e:any) => {
      if (isFollowing) {
        setPosition( clickPoint - e.clientY);
      }
    };
  
    const handleMouseDown = (e:any) => {
      setClickPoint(e.clientY);
      setIsFollowing(true);
    };
  
    const handleMouseUp = () => {
      if (position < -50) {
        moveUp();
      }
      if (position > 50) {
        moveDown();
      }
      setIsFollowing(false);
      setPosition(0);
    };
    
  useEffect(() => {
    const handleKeyUp = (event:any) => {
      if (event.key === "ArrowDown") {
        moveDown();
      }
      if (event.key === 'ArrowUp') {
        moveUp();
      }
    };

    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [list.length]);

  useEffect(() => {
    if (startIndex > 0) {
      const newOffset = cardsRefs.current
        .slice(0, startIndex)
        .reduce((total, ref) => total + (ref?.offsetHeight || 0) + 45, 0);
      setOffset(newOffset);
    } else {
      setOffset(0);
    }
  }, [startIndex]);

  return (
    <div className="relative mt-[5px] overflow-hidden" style={{ height: 'calc(100vh - 5px)' }}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
          onTouchMove={handleMouseMove} >
      <div
        className={`${isFollowing ? "" : "transition-transform duration-300"}`}
        style={{
          transform: `translateY(-${offset + position}px)`,
        }}
      >
        {list && list.map((card, index) => (
          <OneCard
            key={index}
            word={card}
            ref={(el) => {cardsRefs.current[index] = el}}
          />
        ))}
      </div>
    </div>
  );
};

export default CardContainer;