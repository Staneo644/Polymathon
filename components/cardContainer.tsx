
import { completeWord } from '@/app/api/word/route';
import { faThumbsDown, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect, useRef, ReactNode, ForwardRefExoticComponent } from 'react';
import React, { forwardRef } from 'react';
import EtymologyComponent from './etymology';

type Props = {
  //children: ReactNode;
  word: completeWord;
};

const OneCard = React.forwardRef<HTMLDivElement, Props>(
  (props, ref) => 
    <div
  ref={ref}
  className="bg-white shadow-md rounded-lg p-4 mb-[45px] last:mb-0 text-gray-800"
  style={{
    backgroundImage:
    "url(https://s2.qwant.com/thumbr/474x323/7/5/15e7a9bcd784af960fb05e85addd943f5f08a5259bb5803b58a1b3f39473cc/th.jpg?u=https%3A%2F%2Ftse.mm.bing.net%2Fth%3Fid%3DOIP.jytUH6XTOQ7pXAgURy6LYQHaFD%26pid%3DApi&q=0&b=1&p=0&a=0)",
    borderRadius: '20px',
    /*width: '85vw',
    justifyContent: 'center',
    alignItems: 'center',
    //top: `calc(58px + 5%)`,
    backgroundSize: "cover",
    left: `calc(${this.refPosition} + ${this.position}px)`,
    transform: 'translate(-50%)',
    boxShadow: '0px 0px 10px 0px black',
    overflowY: 'scroll',
    overflowX: 'hidden',
    position: 'absolute',
    transition: this.transition,*/
  }}
>
  <div className="mt-2 ml-2 text-xl italic font-serif">
    {EtymologyComponent(props.word.etymology)}
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
  <div className="mb-2 ml-2 text-xl italic font-serif">
    {props.word.theme && (
      <span className="text-gray-600">{props.word.theme + " : "}</span>
    )}
    {props.word.definition}
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
);

const CardContainer = (
  list: completeWord[],
  setList: (word: completeWord[]) => void,
  onEnd: null | (() => void)
) => {
  const [startIndex, setStartIndex] = useState(0);
  const cardsRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [offset, setOffset] = useState(0);

  const cards = [
    { id: 1, content: "Contenu de la première carte" },
    { id: 2, content: "Contenu de la deuxième carte" },
    { id: 3, content: "Contenu de la troisième carte" },
  ];

  useEffect(() => {
    const handleKeyUp = (event:any) => {
      if (event.key === 'a' || event.key === 'A') {
        setStartIndex((prevIndex) => {
          const newIndex = (prevIndex + 1) % cards.length;
          return newIndex;
        });
      }
    };

    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [cards.length]);

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
    <div className="relative mt-[5px] overflow-hidden" style={{ height: 'calc(100vh - 5px)' }}>
      <div
        className="transition-transform duration-300 overflow-hidden"
        style={{
          transform: `translateY(-${offset}px)`,
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