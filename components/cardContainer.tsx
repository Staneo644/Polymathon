import { completeWord } from "@/utils/word/enrichWord";
import { useState, useEffect, useRef } from "react";
import { wordLimit, wordNewCall } from "@/app/rechercher/page";
import OneCard from "./oneCard";
import { useSearchParams } from "next/navigation";

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
  const hideLikesDislikes = localStorage.getItem("hideLikesDislikes") == "true";
  const hideDefinition = localStorage.getItem("hideDefinition") == "true";

  const moveUp = () => {
    setStartIndex((prevIndex) => {
      if (prevIndex > 0) {
        return prevIndex - 1;
      }
      return prevIndex;
    });
  };

  const moveDown = async () => {
    fetch(`http://localhost:3000/api/view?${new URLSearchParams({id: list[startIndex].id.toString()})}`, {
      method: "POST",
    }).catch((e: any) => {
      console.error("erreur: ", e);
    });
    setStartIndex((prevIndex) => {
      if (prevIndex + 1 < list.length) {
        if (list.length - prevIndex == wordLimit - wordNewCall && onEnd)
          onEnd();
        return prevIndex + 1;
      }
      return prevIndex;
    });
  };

  const handleMouseMove = (e: any) => {
    if (isFollowing) {
      setPosition(clickPoint - e.clientY);
    }
  };

  const handleMouseDown = (e: any) => {
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
    const handleKeyUp = (event: any) => {
      if (event.key === "ArrowDown") {
        moveDown();
      }
      if (event.key === "ArrowUp") {
        moveUp();
      }
    };

    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keyup", handleKeyUp);
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
    <div
      className="relative mt-[5px] overflow-hidden"
      style={{ height: "calc(100vh - 5px)" }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      onTouchMove={handleMouseMove}
    >
      <div
        className={`${isFollowing ? "" : "transition-transform duration-300"}`}
        style={{
          transform: `translateY(-${offset + position}px)`,
        }}
      >
        {list &&
          list.map((card, index) => (
            <OneCard
              key={index}
              word={card}
              ref={(el) => {
                cardsRefs.current[index] = el;
              }}
              hideLikesDislikes={hideLikesDislikes}
              hideDefinition={hideDefinition}
            />
          ))}
      </div>
    </div>
  );
};

export default CardContainer;
