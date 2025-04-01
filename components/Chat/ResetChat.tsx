import { FC } from "react";
import { useDarkMode } from "../Contexts/DarkModeContext";

interface Props {
  onReset: () => void;
}

export const ResetChat: FC<Props> = ({ onReset }) => {
  const { darkMode } = useDarkMode();
  
  return (
    <div className="flex flex-row items-center">
      <button
        className={`text-sm sm:text-base ${darkMode ? 'text-white bg-gray-700 hover:bg-gray-600 focus:ring-gray-500' : 'text-neutral-900 bg-neutral-200 hover:bg-neutral-300 focus:ring-neutral-300'} font-semibold rounded-lg px-4 py-2 focus:outline-none focus:ring-1`}
        onClick={() => onReset()}
      >
        Reset
      </button>
    </div>
  );
};