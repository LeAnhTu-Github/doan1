import React from "react";
import { BsChevronUp } from "react-icons/bs";

type EditorFooterProps = {
  handleSubmit: () => void;
  showConsole: boolean;
  setShowConsole: React.Dispatch<React.SetStateAction<boolean>>;
};

const EditorFooter: React.FC<EditorFooterProps> = ({ handleSubmit, showConsole,setShowConsole }) => {
  
  return (
    <div className="flex bg-dark-layer-1 absolute bottom-0 z-10 w-full">
      <div className="mx-5 my-[10px] flex justify-between w-full">
        <div className="mr-2 flex flex-1 flex-nowrap items-center space-x-4">
        <button
          className="px-3 py-1.5 font-medium items-center transition-all inline-flex bg-dark-fill-3 text-sm hover:bg-dark-fill-2 text-dark-label-2 rounded-lg pl-3 pr-2"
          onClick={() => setShowConsole((prev) => !prev)}
        >
          Console
          <div className="ml-1 transform transition flex items-center">
            <BsChevronUp className={`mx-1 ${showConsole ? "rotate-180" : ""}`} />
          </div>
        </button>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <button
            className="px-3 py-1.5 text-sm font-medium items-center whitespace-nowrap transition-all focus:outline-none inline-flex bg-dark-fill-3  hover:bg-dark-fill-2 text-dark-label-2 rounded-lg"
            onClick={handleSubmit}
          >
            Run
          </button>
          <button
            className="px-3 py-1.5 font-medium items-center transition-all focus:outline-none inline-flex text-sm text-white bg-dark-green-s hover:bg-green-3 rounded-lg"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};
export default EditorFooter;
