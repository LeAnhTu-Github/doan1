"use client";
import { useState, useEffect, useRef } from "react";
import Split from "react-split";
import EditorFooter from "./EditorFooter";
import { Problem } from "@/utils/types/problem";
import useLocalStorage from "@/hooks/useLocalStorage";
import Editor from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import PreferenceNav from "./PreferenceNav/PreferenceNav";
type PlaygroundProps = {
  pid: string;
  problem: Problem;
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setSolved: React.Dispatch<React.SetStateAction<boolean>>;
};

const Playground: React.FC<PlaygroundProps> = ({ pid, problem, setSuccess, setSolved }) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [activeTestCaseId, setActiveTestCaseId] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showConsole, setShowConsole] = useState(false);
  const [output, setOutput] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [fontSize] = useLocalStorage("lcc-fontSize", "16px");

  useEffect(() => {
    const storedCode = localStorage.getItem(`code-${pid}`);
    if (storedCode) editorRef.current?.setValue(JSON.parse(storedCode));
  }, [pid]);

  const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
  };
  const languageMap = {
    javascript: 63,
    python: 71,
    cpp: 54,
    java: 62,
    csharp: 51,
  };

  const handleSubmit = async () => {
    if (!editorRef.current) return;
    setIsLoading(true);
    setOutput("");
  
    const code = editorRef.current.getValue();
    const languageId = languageMap[selectedLanguage as keyof typeof languageMap];
  
    try {
      const submissionRes = await fetch("https://judge0-ce.p.rapidapi.com/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": "f7449f873emsheb1b3cbf84504a2p1245d0jsn6d020d932ea1",
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
        body: JSON.stringify({
          source_code: code,
          language_id: languageId,
          stdin: problem.examples[activeTestCaseId].inputText,
        }),
      });
  
      if (!submissionRes.ok) throw new Error("Failed to submit code");
      const { token } = await submissionRes.json();
  
      let resultRes;
      do {
        resultRes = await fetch(`https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=false`, {
          headers: {
            "X-RapidAPI-Key": "f7449f873emsheb1b3cbf84504a2p1245d0jsn6d020d932ea1",
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          },
        });
      } while (!resultRes.ok);
  
      const result = await resultRes.json();
      const outputMessage = result.stdout || result.stderr || result.compile_output || "Unknown error occurred";
      setOutput(outputMessage);
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <>
      <PreferenceNav setLanguage={setSelectedLanguage} />
      <div className="flex flex-col bg-dark-layer-1 relative overflow-x-hidden">
        <Split className="h-[calc(100vh-94px)]" direction="vertical" sizes={[60, 40]} minSize={60}>
          <div className="w-full overflow-auto">
            <Editor height="90vh" defaultLanguage="javascript" defaultValue="// Start coding..." onMount={handleEditorDidMount} />
          </div>
          <div className="w-full px-5 overflow-auto">
            {showConsole ? (
              <div className="font-semibold my-4 text-white">
                <p className="text-sm font-medium mt-4">Output:</p>
                <div className="w-full rounded-lg border px-3 py-[10px] bg-dark-fill-3 whitespace-pre-wrap">
                  {output || ""}
                </div>
              </div>
            ) : (
              <>
                <div className="flex h-10 items-center space-x-6">
                  <div className="text-sm font-medium text-white">Testcases</div>
                </div>
                <div className="flex">
                  {problem.examples.map((example, index) => (
                    <div key={example.id} className="mr-2 mt-2" onClick={() => setActiveTestCaseId(index)}>
                      <div className={`px-4 py-1 rounded-lg cursor-pointer ${activeTestCaseId === index ? "text-white" : "text-gray-500"}`}>
                        Case {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="font-semibold my-4 text-white">
                  <p className="text-sm font-medium mt-4">Input:</p>
                  <div className="w-full rounded-lg border px-3 py-[10px] bg-dark-fill-3">
                    {problem.examples[activeTestCaseId].inputText}
                  </div>
                </div>
              </>
            )}
          </div>
        </Split>
        <EditorFooter handleSubmit={handleSubmit} setShowConsole={setShowConsole} showConsole={showConsole} />
      </div></>
  );
};
export default Playground;
