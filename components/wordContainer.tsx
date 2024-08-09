import { completeWord } from "@/utils/word/enrichWord";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { likeWordAPI } from "./oneCard";
import { faThumbsUp as faRegularThumbsUp, faThumbsDown as faRegularThumbsDown} from "@fortawesome/free-regular-svg-icons";
import { faThumbsUp as faSolidThumbsUp, faThumbsDown as faSolidThumbsDown} from "@fortawesome/free-solid-svg-icons";
const Word = (props: {word: completeWord}) => {
    const [currentLike, setCurrentLike] = useState(props.word.user_like)
    const [numberLikes, setNumberLikes] = useState(props.word.likes)
    const [numberDislikes, setNumberDislikes] = useState(props.word.dislikes)

    
    const likeWord = async (like: boolean) => {
      if (like) {
        if (currentLike == true) {
          likeWordAPI(props.word.id, null).then(() => {
            setCurrentLike(null);
            setNumberLikes(numberLikes - 1);
          });
        }
        else {
          likeWordAPI(props.word.id, true).then(() => {
            setCurrentLike(true);
            setNumberLikes(numberLikes + 1);
          })
        }
      }
      else {
        if (currentLike == false) {
          likeWordAPI(props.word.id, null).then(() => {
            setCurrentLike(null)
            setNumberDislikes(numberDislikes - 1);
          });
        }
        else {
          likeWordAPI(props.word.id, false).then(() => {
            setCurrentLike(false)
            setNumberDislikes(numberDislikes + 1);
          })
        }
      }
    }
    
    return (
        <div
      className="bg-white shadow-md rounded-lg mb-[45px] last:mb-0 text-gray-800"
      style={{
        backgroundImage:
        "url(https://s2.qwant.com/thumbr/474x323/7/5/15e7a9bcd784af960fb05e85addd943f5f08a5259bb5803b58a1b3f39473cc/th.jpg?u=https%3A%2F%2Ftse.mm.bing.net%2Fth%3Fid%3DOIP.jytUH6XTOQ7pXAgURy6LYQHaFD%26pid%3DApi&q=0&b=1&p=0&a=0)",
        borderRadius: '20px',
        backgroundSize: "cover",
      }}
    >
      <div className="mt-3 ml-2 text-xl italic font-serif">
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
      <div className="mb-2 ml-2 flex justify-between items-center">
        <div className="relative left-0 ml-2 mb-1">
          <button
          className="p-1"
            onClick={() => {
              likeWord(true);
            }}
            >
              {currentLike == true ? 
                <FontAwesomeIcon className="text-green-500 h-5" icon={faSolidThumbsUp}/> :
                <FontAwesomeIcon className="text-green-500" icon={faRegularThumbsUp}/>
              }
          </button>
            {" " + numberLikes}
        </div>
        <p className="italic text-gray-500 font-serif">
          {props.word.views} vues
        </p>
    
        <div className="relative right-0 mr-2 mb-1">
          <button
            onClick={() => {
              likeWord(false);
            }}
            >
              {currentLike == false ? 
                <FontAwesomeIcon className="text-red-500 h-5" icon={faSolidThumbsDown}/> :
                <FontAwesomeIcon className="text-red-500" icon={faRegularThumbsDown}/>
              }
            {" " + numberDislikes}
          </button>
          {/*'(' + this.word.negative_note + ')'*/}
        </div>
      </div>
    </div>
        )

}

export default function WordContainer(listWord: completeWord[], onEnd: () => void) {
  return (
    <div className="h-[calc(100vh-92px)] overflow-scroll">
        <br />
    <div className="flex flex-col justify-center  relative">
      {listWord.map((word, index) => (
        <Word key={index} word={word} />
    ))}
    </div>
    <br />
    </div>
  );
}