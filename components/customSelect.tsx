import { FC, useEffect, useState } from "react";
import { ThemeRow } from "@/utils/theme/theme";
import { getParentThemes, getChildrenThemes, hasChildren } from "@/utils/theme/convert-theme";
import {faChevronDown, faChevronUp} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export const CustomSelect: FC<{setCurrent: (option: ThemeRow) => void, current?: ThemeRow}> = ({setCurrent, current}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedParentOptionId, setSelectedParentOptionId] = useState<number>();
    const [parentThemes, setParentThemes] = useState<ThemeRow[]>();
    const [themes, setThemes] = useState<ThemeRow[]>();
  
    const toggleOpen = () => setIsOpen(!isOpen);
  
    useEffect(() => {
        fetch('http://localhost:3000/api/theme', { method: 'GET' })
          .then((response) => {
            if (response.ok) {
              response.json().then((data) => {
                setThemes(data.data);
                setParentThemes(getParentThemes(data.data));
              });
            }
          })
          .catch((e) => {
            console.error('erreur: ', e);
          });
      }, []);
  
    return (
      <div className="custom-select-container">
        <button onClick={toggleOpen} className="bg-gray-100 p-2 rounded-md  w-60 flex justify-between">
          {current ? current.name : 'Sélectionner une option'}
            <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} className="mx-2"/>
        </button>
        {isOpen && (
          <ul className="custom-select-options absolute z-10 bg-gray-100 rounded-md cursor-pointer">
            {parentThemes && parentThemes.map((option, index) => (
                hasChildren(themes ?? [], option.id) ?
                <>
                <li
                        key={index}
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
                                    
                                    key={index}
                                    onClick={() => {setCurrent(option) ; setIsOpen(false); setSelectedParentOptionId(0)}}
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
                        key={index}
                        onClick={() => {setCurrent(option) ; setIsOpen(false); setSelectedParentOptionId(0)}}
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