

export const Button: React.FC<{ onClick: () => void; children: React.ReactNode; category : "Menu" | "Header"}> = ({ children, onClick, category }) => {
  const menuClassname = "bg-amber-700 w-1/3 min-w-[200px] max-w-[900px] shadow-2xl h-12 lg:h-16 rounded-lg hover:bg-amber-600 active:bg-amber-800 duration-300 text-2xl lg:text-3xl border-2 border-gray-600";
  const headerClassname = "p-4 hover:bg-gray-700 cursor-pointer";

  return (
    <button
      className={category === "Menu" ? menuClassname : headerClassname}
      onClick={onClick}
    >
      {children}
    </button>
  );
}