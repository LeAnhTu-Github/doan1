import React from "react";
import { BsChevronUp } from "react-icons/bs";

type EditorFooterProps = {
  handleSubmit: () => void;
  handleRun: () => void;
  showConsole: boolean;
  setShowConsole: React.Dispatch<React.SetStateAction<boolean>>;
  mode: 'contest' | 'practice';
  score?: number;
};

const EditorFooter: React.FC<EditorFooterProps> = ({ score, handleSubmit, handleRun, showConsole, setShowConsole, mode }) => {
  return (
    <div className="flex bg-dark-layer-1 dark:bg-gray-100 absolute bottom-0 z-10 w-full">
      <div className="mx-5 my-[10px] flex justify-between w-full">
        <div className="mr-2 flex flex-1 flex-nowrap items-center space-x-4">
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <button
            className="px-3 py-1.5 text-sm font-medium items-center whitespace-nowrap transition-all focus:outline-none inline-flex bg-dark-fill-3 dark:bg-gray-200 hover:bg-dark-fill-2 dark:hover:bg-gray-300 text-dark-label-2 dark:text-gray-800 rounded-lg"
            onClick={handleRun}
          >
            Chạy
          </button>
          {score === undefined && (
            <button
              className="px-3 py-1.5 font-medium items-center transition-all focus:outline-none inline-flex text-sm text-white dark:text-gray-800 bg-dark-green-s dark:bg-green-500 hover:bg-green-3 dark:hover:bg-green-600 rounded-lg"
              onClick={handleSubmit}
            >
              Nộp bài
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditorFooter;