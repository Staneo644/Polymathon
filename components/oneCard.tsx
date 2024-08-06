import React from "react";
import { note } from "./entity";
import EtymologyComponent from "./etymology";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { completeWord } from "@/app/api/word/route";
//import { noteWord } from '../communication/word';

class OneCard extends React.Component {
  constructor(props: {
    word: completeWord;
    refPosition: string;
    transition: string;
    _index: number;
    onChange: (word: completeWord) => void;
  }) {
    super(props);
    this.word = props.word;
    this.position = 0;
    this.transition = props.transition;
    this.refPosition = props.refPosition;
    this.index = props._index;
    this.onChange = props.onChange;
  }

  index: number;
  word: completeWord;
  position: number;
  transition: string;
  refPosition: string;
  onChange: (word: completeWord) => void;

  noteMyWord = async (myNote: note): Promise<void> => {
    console.log(myNote);
    /*noteWord(this.word.id, myNote).then((note_ret) => {
      console.log(this.word.personnal_note)
      if (myNote === note.positif ) {
        if (this.word.personnal_note === note.positif) {
          this.word.positive_note = this.word.positive_note - 1;
          this.word.personnal_note = note.neutre;
        }
        else {

          if (this.word.personnal_note === note.negatif) {
            this.word.negative_note = this.word.negative_note - 1;
          }
          this.word.positive_note = this.word.positive_note + 1;
        }
          
      }
      if (myNote === note.negatif) {
        if (this.word.personnal_note === note.negatif) {
          this.word.negative_note = this.word.negative_note - 1;
        }
        else {
          if (this.word.personnal_note === note.positif) {
            this.word.positive_note = this.word.positive_note - 1;
          }
          this.word.negative_note = this.word.negative_note + 1;
        }
      }
      this.word.personnal_note = note_ret;
      this.onChange(this.word);
    })*/
  };

  getIndex(): number {
    return this.index;
  }

  setPosition(position: number): void {
    this.position = position;
  }

  setRefPosition(refPosition: string): void {
    this.refPosition = refPosition;
  }

  setTransition(transition: string): void {
    this.transition = transition;
  }

  getWord(): completeWord {
    return this.word;
  }

  getCard(): any {
    return (
      <div
        className="text-black overflow-y-scroll flex flex-col"
        style={{
          width: "85vw",
          justifyContent: "center",
          alignItems: "center",
          top: `calc(58px + 5%)`,
          backgroundImage:
            "url(https://s2.qwant.com/thumbr/474x323/7/5/15e7a9bcd784af960fb05e85addd943f5f08a5259bb5803b58a1b3f39473cc/th.jpg?u=https%3A%2F%2Ftse.mm.bing.net%2Fth%3Fid%3DOIP.jytUH6XTOQ7pXAgURy6LYQHaFD%26pid%3DApi&q=0&b=1&p=0&a=0)",
          backgroundSize: "cover",
          left: `calc(${this.refPosition} + ${this.position}px)`,
          transform: "translate(-50%)",
          borderRadius: "20px",
          boxShadow: "0px 0px 10px 0px black",
          overflowY: "scroll",
          overflowX: "hidden",
          position: "fixed",
          transition: this.transition,
        }}
      >
        <div className="mt-2 ml-2 text-xl italic font-serif">
          {EtymologyComponent(this.word.etymology)}
        </div>
        <div className="flex items-center justify-center whitespace-pre">
          <h3 className="font-bold italic font-serif text-2xl">
            {this.word.name}
          </h3>
          <h4 className="text-lg text-gray-600 italic">
            {"  ("}
            {this.word.type}
            {")"}
          </h4>
        </div>
        <div className="mb-2 ml-2 text-xl italic font-serif">
          {this.word.theme && (
            <span className="text-gray-600">{this.word.theme + " : "}</span>
          )}
          {this.word.definition}
        </div>
        <div className="mb-2 ml-2 flex justify-between items-center">
          <div className="fixed left-0 ml-2 mb-3 mt-2">
            <button
              onClick={() => {
                this.noteMyWord(note.positif);
              }}
            >
              <FontAwesomeIcon className="text-green-500" icon={faThumbsUp} />
            </button>
            {/*'(' + this.word.positive_note + ')'*/}
          </div>

          <div className="fixed right-0 mr-2 mb-3 mt-2">
            <button
              onClick={() => {
                this.noteMyWord(note.negatif);
              }}
            >
              <FontAwesomeIcon className="text-red-500" icon={faThumbsDown} />
            </button>
            {/*'(' + this.word.negative_note + ')'*/}
          </div>
        </div>
      </div>
    );
  }
}

export default OneCard;
