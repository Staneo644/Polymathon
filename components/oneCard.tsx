import { forwardRef, useEffect, useState } from "react";
import EtymologyComponent from "./etymology";
import { faThumbsUp as faSolidThumbsUp, faThumbsDown as faSolidThumbsDown, faGreaterThan, faLessThan, faSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp as faRegularThumbsUp, faThumbsDown as faRegularThumbsDown} from "@fortawesome/free-regular-svg-icons";
import { completeWord } from "@/utils/word/enrichWord";

type Props = {
  text: string | null, theme: string | null, isDefinition: boolean, index:number, isVisible: boolean
};


const Explanation = (props: Props) =>
  <div className="w-100 absolute transition-transform duration-300 mr-2"
style={{
  
  opacity: `${props.isVisible ? 100 : 0}`,
  transform: `translateX(${(props.index == 0 ? '-100' : props.index == 2 ? '100' : '0')}vw)`,
}}>
    {props.theme && props.isDefinition && (
      <span className="text-gray-600">{props.theme + " : "}</span>
    )} 
    {EtymologyComponent(props.text ?? "")}
  </div>

export const likeWordAPI = (id: number, like: boolean | null) =>
  fetch("http://localhost:3000/api/like?id=" + id + "&like=" + like, {method: 'POST'})

const OneCard = forwardRef<HTMLDivElement, {word: completeWord, hideLikesDislikes: boolean, hideDefinition: boolean}>(
  (props, ref) => {
    const listItems = [props.word.example, props.word.definition, props.word.etymology];
    const [biggerItem, setBiggerItem] = useState("")
    const [oldIndex, setOldIndex] = useState(1);
    const [currentIndex, setCurrentIndex] = useState(1);
    const [visibleText, setVisibleText] = useState(!props.hideDefinition)
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

    useEffect(() => {
      const definition = props.word.theme ? props.word.theme + ' : ' + props.word.definition : props.word.definition
      if (props.word.etymology.length > (props.word.example?.length ?? 0) )
      {
        if (props.word.etymology.length > definition.length)
          setBiggerItem(props.word.etymology)
        else
        setBiggerItem(definition)
      }
      else {
        if ((props.word.example?.length ?? 0) > (props.word.definition.length + (props.word.theme?.length ?? 0)))
          setBiggerItem(props.word.example ?? "")
        else
        setBiggerItem(definition)
      }    
    })

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
    });
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
  <button className={"mb-2 ml-2 text-xl italic font-serif text-left" + ((visibleText) ? " cursor-default" : "")} onClick={() => (setVisibleText(true))}>
  <div className={`duration-300 transition-transform ${ (visibleText ? " " : " invisible")}`}
    >
    <Explanation
      text={listItems[0]} 
      theme={props.word.theme} 
      isDefinition={currentIndex == 1}
      index={currentIndex == 0 ? 2 : currentIndex - 1}
      isVisible={currentIndex == 2 || oldIndex == 2}
    />
    <Explanation
      text={listItems[1]} 
      theme={props.word.theme} 
      isDefinition={currentIndex == 1}
      index={currentIndex}
      isVisible={currentIndex == 1 || oldIndex == 1}
    />
    <Explanation
      text={listItems[2]} 
      theme={props.word.theme} 
      isDefinition={currentIndex == 1}
      index={currentIndex == 2 ? 0 : currentIndex + 1}
      isVisible={currentIndex == 0 || oldIndex == 0}
      />
  </div>
    <div className='invisible'>

  {biggerItem}
    </div>
  <FontAwesomeIcon icon={faSlash} className="cursor-pointer -rotate-90" onClick={handleLeft}/>
    <FontAwesomeIcon icon={faSlash} className="cursor-pointer -rotate-90 -scale-100 skew-y-12" onClick={handleRigth}/>
  </button>
  {
    props.hideLikesDislikes ? null :
  <div className="mb-2 ml-2 flex justify-between items-center">
    <div className="relative left-0 ml-2 mb-2 mt-2">
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

    <div className="relative right-0 mr-2 mb-2 mt-2">
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
  }
</div>
    )
}
);

export default OneCard;
