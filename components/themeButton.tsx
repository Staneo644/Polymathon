import React, { Dispatch, SetStateAction, useState } from "react";
import { ThemeRow } from "@/utils/theme/theme";

interface ThemeButtonProps {
  themes: ThemeRow[];
  selectedTheme: ThemeRow;
  setSelectedTheme: (ThemeRow: ThemeRow) => void;
}

const ThemeButton: React.FC<ThemeButtonProps> = ({
  themes,
  selectedTheme,
  setSelectedTheme,
}) => {
  const handleSelect = (theme: ThemeRow) => {
    setSelectedTheme(theme);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {themes.map((theme) => (
        <button
          key={theme.id}
          className={`px-4 py-2 rounded-full ${
            selectedTheme?.id === theme.id
              ? "bg-[var(--blue)] text-white"
              : "bg-gray-400"
          }`}
          onClick={() => handleSelect(theme)}
        >
          {theme.name}
        </button>
      ))}
    </div>
  );
};

export default ThemeButton;
