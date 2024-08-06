import { useState, useRef, useEffect } from "react";
import oneCard from "./oneCard";
//import type { word_id } from './entity';
import { completeWord } from "@/app/api/word/route";
//import { seeWord } from '../communication/word';
// import '../globals.css'

let wordIndex = -1;
let cardIndex = 0;
let oldWordIndex = -1;
function listCardComponent(
  liste: completeWord[],
  setList: (word: completeWord[]) => void,
  onEnd: null | (() => void)
) {
  const containerRefMiddle = useRef<HTMLDivElement | null>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [yMouseDown, setYMouseDown] = useState(0);
  const [yCoord, setYCoord] = useState(0);
  const [listCard, setListCard] = useState<oneCard[]>([]);
  const login =
    typeof localStorage !== "undefined"
      ? localStorage.getItem("access_token")
      : "";

  const onChangeWord = (word: completeWord) => {
    liste[wordIndex] = word;
    console.log(liste);
    setYCoord(yCoord + 1);
    setList(liste);
  };

  const checked = (): boolean => {
    return liste && liste.length > 0;
  };

  const seeingWord = (word: completeWord) => {
    //seeWord(word.id) TODO
    oldWordIndex = wordIndex;
  };

  useEffect(() => {
    if (
      login &&
      login !== "" &&
      oldWordIndex < wordIndex &&
      listCard[cardIndex]
    ) {
      seeingWord(listCard[cardIndex].getWord());
    }
  }, [wordIndex]);

  const rebootListCard = () => {
    listCard.forEach((oneCard: oneCard) => {
      oneCard.setTransition("0.5s");
      oneCard.setPosition(0);
      setYCoord(yCoord + 1);
    });
  };

  const moveToRight = (): void => {
    if (checked() && wordIndex < liste.length - 1) {
      if (wordIndex === liste.length - 3) {
        if (onEnd) onEnd();
      }
      if (wordIndex === 0) {
        cardIndex = cardIndex + 1;
      } else {
        removeElementAtStart();
      }
      wordIndex = wordIndex + 1;
      if (wordIndex !== liste.length - 1) {
        addElementAtEnd(
          new oneCard({
            word: liste[wordIndex + 1],
            refPosition: "150%",
            transition: "0.5s",
            _index: wordIndex + 1,
            onChange: onChangeWord,
          })
        );
      }
      setRefPosition();
    }
  };

  const moveToLeft = (): void => {
    if (checked() && wordIndex > 0) {
      if (wordIndex !== liste.length - 1) {
        removeElementAtEnd();
      }
      wordIndex = wordIndex - 1;
      if (wordIndex === 0) {
        cardIndex = cardIndex - 1;
      } else {
        addElementAtStart(
          new oneCard({
            word: liste[wordIndex - 1],
            refPosition: "-50%",
            transition: "0.5s",
            _index: wordIndex - 1,
            onChange: onChangeWord,
          })
        );
      }
      setRefPosition();
    }
  };

  useEffect(() => {
    const ret: oneCard[] = listCard;
    if (liste && liste.length > 0) {
      if (listCard.length === 0) {
        ret.push(
          new oneCard({
            word: liste[0],
            refPosition: "50%",
            transition: "0",
            _index: 0,
            onChange: onChangeWord,
          })
        );
        if (liste.length > 1) {
          ret.push(
            new oneCard({
              word: liste[1],
              refPosition: "150%",
              transition: "0",
              _index: 1,
              onChange: onChangeWord,
            })
          );
        }
      }
      if (wordIndex === -1) {
        wordIndex = 0;
        seeingWord(liste[0]);
      }
    }
    setListCard(ret);
  }, [liste]);

  const setRefPosition = (): void => {
    listCard[cardIndex].setRefPosition("50%");
    if (cardIndex < listCard.length - 1) {
      listCard[cardIndex + 1].setRefPosition("150%");
    }
    if (cardIndex > 0) {
      listCard[cardIndex - 1].setRefPosition("-50%");
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: any) => {
      if (e.key === "ArrowLeft") {
        rebootListCard();
        moveToLeft();
      } else if (e.key === "ArrowRight") {
        rebootListCard();
        moveToRight();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [moveToLeft, moveToRight]);

  const addElementAtEnd = (element: oneCard): void => {
    const list = listCard;
    list.push(element);
    setListCard(list);
  };

  const addElementAtStart = (element: oneCard): void => {
    const list = listCard;
    list.unshift(element);
    setListCard(list);
  };

  const removeElementAtEnd = (): void => {
    const list = listCard;
    list.pop();
    setListCard(list);
  };

  const removeElementAtStart = (): void => {
    const list = listCard;
    listCard.shift();
    setListCard(list);
  };

  const handleMouseDown = (event: any): void => {
    listCard.forEach((oneCard: any) => {
      oneCard.setTransition("0s");
    });
    setYMouseDown(event.clientX);
    setIsMouseDown(true);
  };

  const handleMouseUp = (event: any): void => {
    rebootListCard();
    const px = event.clientX - yMouseDown;
    if (px > 150) {
      moveToLeft();
    } else if (px < -150) {
      moveToRight();
    }
    setIsMouseDown(false);
  };

  const handleMouseMove = (event: any): void => {
    if (isMouseDown && containerRefMiddle.current) {
      const px = event.clientX - yMouseDown;
      listCard.forEach((oneCard: any) => {
        oneCard.setPosition(px);
      });
      setYCoord(event.clientX);
    }
  };

  return (
    <>
      {" "}
      {!checked() && (
        <div className="text-white">
          Liste de mots vide, vérifiez votre connexion
        </div>
      )}
      {checked() && (
        <div
          ref={containerRefMiddle}
          className="w-full h-full"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
          onTouchMove={handleMouseMove}
        >
          {listCard &&
            listCard.length > 0 &&
            listCard.map((element) => (
              <div key={element.getIndex()}>{element.getCard()}</div>
            ))}
        </div>
      )}
    </>
  );
}

export default listCardComponent;
