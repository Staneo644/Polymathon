import { FC, useEffect, useState } from "react";
import { ThemeRow } from "@/utils/theme/theme";
import { getParentThemes, getChildrenThemes, hasChildren, getNameById } from "@/utils/theme/convert-theme";
import {faChevronDown, faChevronUp} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export const CustomSelect: FC<{setCurrent: (option: number) => void, themes:ThemeRow[], current?: number}> = ({setCurrent, themes, current}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedParentOptionId, setSelectedParentOptionId] = useState<number>();
    const [parentThemes, setParentThemes] = useState<ThemeRow[]>();
    const [currentTheme, setCurrentTheme] = useState("");
    
    const toggleOpen = () => setIsOpen(!isOpen);

    useEffect(() => {
        setParentThemes(getParentThemes(themes ?? []));
    }, [themes]);

    useEffect(() => {
        if (current) {
            setCurrentTheme(getNameById(themes ?? [], current));
        }
    }, [current, themes]);
  
    return (
      <div className="custom-select-container">
        <button onClick={toggleOpen} className="bg-gray-100 p-2 rounded-md  w-60 flex justify-between">
          {currentTheme ? currentTheme : 'Sélectionner une option'}
            <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} className="mx-2"/>
        </button>
        {isOpen && (
          <ul className="custom-select-options absolute z-10 bg-gray-100 rounded-md cursor-pointer">
            {parentThemes && parentThemes.map((option, index) => (
                hasChildren(themes ?? [], option.id) ?
                <>
                <li
                        key={option.id}
                        onClick={() => {selectedParentOptionId == option.id ? setSelectedParentOptionId(0) : setSelectedParentOptionId(option.id)}}
                        className="custom-select-option flex justify-between p-2 cursor-button"
                        >
                        {option.name}
                        {option.id === selectedParentOptionId ?
                            <FontAwesomeIcon icon={faChevronDown} className="mx-2"/> :
                            <FontAwesomeIcon icon={faChevronUp} className="mx-2"/>
                        }
                        
                        </li>
                        {option.id === selectedParentOptionId &&
                            <ul className="custom-select-options absolute translate-x-32 -translate-y-10 z-10 bg-white rounded-md shadow-xl cursor-pointer">
                                {getChildrenThemes(themes ?? [], option.id).map((option, index) => (
                                    <>
                                    <li
                                    
                                    key={option.id}
                                    onClick={() => {setCurrent(option.id) ; setIsOpen(false); setSelectedParentOptionId(0)}}
                                    className="custom-select-option flex justify-between p-2 bg-gray-100 rounded-md pointer"
                                    >
                                    {option.name}
                                    </li>
                                    
                                    {index !== getChildrenThemes(themes ?? [], option.id).length - 1 && <hr/>}
                                    </>
                                ))}
                            </ul>
                        }
                        {index !== parentThemes.length - 1 && <hr/>}
                    </>
                    :
                    <li
                        key={option.id}
                        onClick={() => {setCurrent(option.id) ; setIsOpen(false); setSelectedParentOptionId(0)}}
                        className="custom-select-option flex justify-between p-2"
                        >
                    {option.name}
                    </li>
            ))}
          </ul>
        )}
      </div>
    );
  }