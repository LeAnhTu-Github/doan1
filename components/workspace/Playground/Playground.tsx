"use client";
import { useState, useEffect } from "react";
import PreferenceNav from "./PreferenceNav/PreferenceNav";
import Split from "react-split";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { javascript } from "@codemirror/lang-javascript";
import EditorFooter from "./EditorFooter";
import { Problem } from "@/utils/types/problem";
import toast from "react-hot-toast";
// import { problems } from "@/utils/problems";
import useLocalStorage from "@/hooks/useLocalStorage";
import { pid } from "process";
import axios from "axios";
import { problems } from "@/utils/problems";
import { useRouter } from "next/navigation";
type PlaygroundProps = {
  pid: string;
  problem: Problem;
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setSolved: React.Dispatch<React.SetStateAction<boolean>>;
};

export interface ISettings {
  fontSize: string;
  settingsModalIsOpen: boolean;
  dropdownIsOpen: boolean;
}

const Playground: React.FC<PlaygroundProps> = ({
  pid,
  problem,
  setSuccess,
  setSolved,
}) => {
  const [activeTestCaseId, setActiveTestCaseId] = useState<number>(0);
  let [userCode, setUserCode] = useState<string>(problem.starterCode);

  const [fontSize, setFontSize] = useLocalStorage("lcc-fontSize", "16px");
  const router = useRouter();
  const [settings, setSettings] = useState<ISettings>({
    fontSize: fontSize,
    settingsModalIsOpen: false,
    dropdownIsOpen: false,
  });

  //   const {
  //     query: { pid },
  //   } = useRouter();

  const handleSubmit = async () => {
    try {
      userCode = userCode.slice(userCode.indexOf(problem.starterFunctionName));
      const cb = new Function(`return ${userCode}`)();
      const handler = problem.handlerFunction;
      if (typeof handler === "function") {
        const success = handler(cb);
        if (typeof success === "number" && success > 0) {
          await axios
            .post(`/api/test`, {
              testId: pid,
              score: success,
            })
            .then(() => {
              toast.success(
                "Chúc mừng! Bạn đã giải đúng bài toán này! với điểm số là: " +
                  success
              );
              router.refresh();
              router.push("/");
            })
            .catch((error) => {
              toast.error("Đăng kí thất bại." + error.message);
            })
            .finally(() => {});
          setSuccess(true);
          setTimeout(() => {
            setSuccess(false);
          }, 4000);
          setSolved(true);
        } else if (success === true) {
          toast.success("Chúc mừng! Bạn đã giải đúng bài toán này!");
          setSuccess(true);
          setTimeout(() => {
            setSuccess(false);
          }, 4000);
          setSolved(true);
        } else {
          toast.error("Một hoặc nhiều trường hợp thử nghiệm không thành công!");
        }
      }
    } catch (error: any) {
      toast.error("Có một lỗi xảy ra: " + error.message);
      if (
        error.message.startsWith(
          "AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:"
        )
      ) {
        toast.error("Một hoặc nhiều trường hợp thử nghiệm không thành công!");
      } else {
        toast.error(error.message);
      }
    }
  };

  useEffect(() => {
    const code = localStorage.getItem(`code-${pid}`);
    setUserCode(code ? JSON.parse(code) : problem.starterCode);
  }, [pid, problem.starterCode]);

  const onChange = (value: string) => {
    setUserCode(value);
    localStorage.setItem(`code-${pid}`, JSON.stringify(value));
  };

  return (
    <div className="flex flex-col bg-dark-layer-1 relative overflow-x-hidden">
      <PreferenceNav settings={settings} setSettings={setSettings} />

      <Split
        className="h-[calc(100vh-94px)]"
        direction="vertical"
        sizes={[60, 40]}
        minSize={60}
      >
        <div className="w-full overflow-auto">
          <CodeMirror
            value={userCode}
            theme={vscodeDark}
            onChange={onChange}
            extensions={[javascript()]}
            style={{ fontSize: settings.fontSize }}
          />
        </div>
        <div className="w-full px-5 overflow-auto">
          {/* testcase heading */}
          <div className="flex h-10 items-center space-x-6">
            <div className="relative flex h-full flex-col justify-center cursor-pointer">
              <div className="text-sm font-medium leading-5 text-white">
                Testcases
              </div>
              <hr className="absolute bottom-0 h-0.5 w-full rounded-full border-none bg-white" />
            </div>
          </div>

          <div className="flex">
            {problem.examples.map((example, index) => (
              <div
                className="mr-2 items-start mt-2 "
                key={example.id}
                onClick={() => setActiveTestCaseId(index)}
              >
                <div className="flex flex-wrap items-center gap-y-4">
                  <div
                    className={`font-medium items-center transition-all focus:outline-none inline-flex bg-dark-fill-3 hover:bg-dark-fill-2 relative rounded-lg px-4 py-1 cursor-pointer whitespace-nowrap
										${activeTestCaseId === index ? "text-white" : "text-gray-500"}
									`}
                  >
                    Case {index + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="font-semibold my-4">
            <p className="text-sm font-medium mt-4 text-white">Input:</p>
            <div className="w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2">
              {problem.examples[activeTestCaseId].inputText}
            </div>
            <p className="text-sm font-medium mt-4 text-white">Output:</p>
            <div className="w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2">
              {problem.examples[activeTestCaseId].outputText}
            </div>
          </div>
        </div>
      </Split>
      <EditorFooter handleSubmit={handleSubmit} />
    </div>
  );
};
export default Playground;
