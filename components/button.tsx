import { FC, ReactNode } from "react";


export const YellowButton: FC<{ onClick: () => void; children: ReactNode; inactive?:boolean; className?:string }> = ({ children, onClick, inactive, className }) => 
    <button
      className={`text-white bg-${inactive ?  "gray-400 cursor-default" :"[var(--yellow)] hover:bg-[var(--light-yellow)] active:bg-[var(--dark-yellow)]"} font-bold py-2 px-4 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>

