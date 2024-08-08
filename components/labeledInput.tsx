import React, { FC } from "react";

interface LabeledInputProps {
  id: string;
  name: string;
  type: string;
  label: string;
  required?: boolean;
}

const LabeledInput: FC<LabeledInputProps> = ({
  id,
  name,
  type,
  label,
  required = false,
}) => {
  return (
    <div className="flex flex-col items-center">
      <label htmlFor={id} className="block text-sm font-medium text-white">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        className="w-4/5 mt-1 block px-3 py-2 bg-gray-800 text-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
    </div>
  );
};

export default LabeledInput;
