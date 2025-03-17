import { useState, useEffect } from "react";
import { Select } from "antd";
import {
  AiOutlineFullscreen,
  AiOutlineFullscreenExit,
  AiOutlineSetting,
} from "react-icons/ai";

type PreferenceNavProps = {
  setLanguage: (language: string) => void;
};

const PreferenceNav: React.FC<PreferenceNavProps> = ({ setLanguage }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");

  const handleFullScreen = () => {
    if (isFullScreen) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
    setIsFullScreen(!isFullScreen);
  };

  const handleChangeLanguage = (value: string) => {
    setSelectedLanguage(value);
    setLanguage(value); // Cập nhật state ngôn ngữ ở Playground
  };

  useEffect(() => {
    function exitHandler() {
      if (!document.fullscreenElement) {
        setIsFullScreen(false);
      }
    }

    document.addEventListener("fullscreenchange", exitHandler);
    return () => {
      document.removeEventListener("fullscreenchange", exitHandler);
    };
  }, []);

  return (
    <div className="flex items-center justify-between bg-dark-layer-2 h-11 w-full px-4">
      <Select
        className="w-40"
        value={selectedLanguage}
        onChange={handleChangeLanguage}
        options={[
          { value: "javascript", label: "JavaScript" },
          { value: "python", label: "Python" },
          { value: "cpp", label: "C++" },
          { value: "java", label: "Java" },
          { value: "csharp", label: "C#" },
        ]}
      />

      <div className="flex items-center space-x-3">
        <button className="preferenceBtn group">
          <AiOutlineSetting className="h-5 w-5 text-gray-400" />
        </button>

        <button className="preferenceBtn group" onClick={handleFullScreen}>
          {isFullScreen ? (
            <AiOutlineFullscreenExit className="h-5 w-5 text-gray-400" />
          ) : (
            <AiOutlineFullscreen className="h-5 w-5 text-gray-400" />
          )}
        </button>
      </div>
    </div>
  );
};

export default PreferenceNav;
