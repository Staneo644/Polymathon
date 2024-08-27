const EtymologyComponent = (text: string) => {
  const styleForeignWords = (word: string) => {
    if (word.startsWith("<") && word.endsWith(">")) {
      return "text-red-800 font-semibold";
    }
    return "";
  };

  const changeWord = (word: string) => {
    if (word.startsWith("<") && word.endsWith(">")) {
      return word.substring(1, word.length - 1);
    }
    return word;
  };

  const renderWords = (text: string) => {
    const words = text.split(" ");

    return words.map((word, index) => (
      <span key={index} className={styleForeignWords(word)}>
        {changeWord(word)}{" "}
      </span>
    ));
  };

  return <>{renderWords(text)}</>;
};

export default EtymologyComponent;
