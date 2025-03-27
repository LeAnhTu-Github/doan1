"use client";
import { useState, useEffect, useRef } from "react";
import Split from "react-split";
import EditorFooter from "./EditorFooter";
import useLocalStorage from "@/hooks/useLocalStorage";
import Editor from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import PreferenceNav from "./PreferenceNav/PreferenceNav";
import { executeCode, languageMap } from "@/lib/judge0";
import { Problem } from "@prisma/client";
import { CodeWrapperService } from "@/lib/codeWrapper";

type PlaygroundProps = {
  ProblemId: string;
  problem: Problem;
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setSolved: React.Dispatch<React.SetStateAction<boolean>>;
};

interface TestCase {
  id: string;
  problemId: string;
  input: Record<string, any> | any;
  expected: string;
  isHidden: boolean;
  createdAt: string;
  updatedAt: string;
}

const Playground: React.FC<PlaygroundProps> = ({ ProblemId,problem, setSuccess, setSolved }) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [activeTestCaseId, setActiveTestCaseId] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [showConsole, setShowConsole] = useState(false);
  const [output, setOutput] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [fontSize] = useLocalStorage("lcc-fontSize", "16px");
  const [code, setCode] = useState<string>(() => {
    try {
      const templates = typeof problem.codeTemplate === 'string' 
        ? JSON.parse(problem.codeTemplate) 
        : problem.codeTemplate;
      return templates[selectedLanguage] || "// Start coding...";
    } catch (error) {
      console.error("Error parsing codeTemplate:", error);
      return "// Start coding...";
    }
  });
  const [testCaseOutputs, setTestCaseOutputs] = useState<string[]>([]);
  const [testCaseResults, setTestCaseResults] = useState<boolean[]>([]);

  useEffect(() => {
    const storedCode = localStorage.getItem(`code-${ProblemId}-${selectedLanguage}`);
    if (storedCode) {
      const parsedCode = JSON.parse(storedCode);
      setCode(parsedCode);
      if (editorRef.current) {
        editorRef.current.setValue(parsedCode);
      }
    } else {
      try {
        const templates = typeof problem.codeTemplate === 'string' 
          ? JSON.parse(problem.codeTemplate) 
          : problem.codeTemplate;
        const newTemplate = templates[selectedLanguage] || "// Start coding...";
        setCode(newTemplate);
        if (editorRef.current) {
          editorRef.current.setValue(newTemplate);
        }
      } catch (error) {
        console.error("Error parsing codeTemplate:", error);
        setCode("// Start coding...");
      }
    }
  }, [selectedLanguage, ProblemId, problem.codeTemplate]);
  useEffect(() => {
    const fetchTestCases = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/testCases?problemId=${ProblemId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch test cases");
        }
        const data = await response.json();
        setTestCases(data || []);
      } catch (error) {
        console.error("Error fetching test cases:", error);
        setTestCases([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (ProblemId) {
      fetchTestCases();
    }

    // Load code từ localStorage khi mount
    const storedCode = localStorage.getItem(`code-${ProblemId}`);
    if (storedCode) {
      setCode(JSON.parse(storedCode));
    }
  }, [ProblemId]);

  const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    // Đồng bộ code từ state vào editor khi mount
    editor.setValue(code);
  };

  // Hàm xử lý khi code trong editor thay đổi
  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
      localStorage.setItem(`code-${ProblemId}-${selectedLanguage}`, JSON.stringify(value));
    }
  };

  // Sửa lại hàm handleSubmit
  const handleSubmit = async () => {
    if (!editorRef.current) {
      setOutput("Editor not initialized");
      return;
    }
  
    setIsRunning(true);
    setOutput("Running...");

    const userCode = editorRef.current.getValue();
    const languageId = languageMap[selectedLanguage as keyof typeof languageMap];
  
    if (!testCases.length || !testCases[activeTestCaseId]) {
      setOutput("No valid test case available");
      setIsRunning(false);
      return;
    }

    try {
      // Parse metadata từ problem
      const metadata = typeof problem.metadata === 'string' 
        ? JSON.parse(problem.metadata) 
        : problem.metadata;

      // Wrap code người dùng với CodeWrapper
      const wrappedCode = CodeWrapperService.generateWrapper(
        userCode,
        selectedLanguage,
        metadata,
        problem.functionName
      );

      const executionResults = await Promise.all(
        testCases.map(async (testCase) => {
          const inputJson = JSON.stringify(testCase.input);
          console.log(1111, wrappedCode);
          console.log(2222, inputJson);
          const result = await executeCode({
            source_code: wrappedCode,
            language_id: languageId,
            stdin: inputJson,
          });

          // Parse output và so sánh với kết quả mong đợi
          const parsedOutput = result.trim();
          return {
            output: parsedOutput,
            passed: parsedOutput === testCase.expected.trim()
          };
        })
      );

      // Tách riêng results và outputs
      const results = executionResults.map(result => result.passed);
      const outputs = executionResults.map(result => result.output);
  
      setTestCaseResults(results);
      setTestCaseOutputs(outputs);
  
      // Hiển thị output cho test case đang active
      setOutput(outputs[activeTestCaseId] || "No output");
  
      if (results.every(r => r)) {
        setSuccess(true);
        setSolved(true);
      } else {
        setSuccess(false);
      }
    } catch (error) {
      console.error("Execution error:", error);
      setOutput(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
      setSuccess(false);
    } finally {
      setIsRunning(false);
    }
  };
  if (isLoading) {
    return <div className="text-white">Loading test cases...</div>;
  }

  const visibleTestCases = testCases.filter((testCase) => !testCase.isHidden);

  return (
    <>
      <PreferenceNav setLanguage={setSelectedLanguage} />
      <div className="flex flex-col bg-dark-layer-1 relative overflow-x-hidden">
        <Split className="h-[calc(100vh-94px)]" direction="vertical" sizes={[60, 40]} minSize={60}>
          <div className="w-full overflow-auto">
            <Editor
              height="90vh"
              defaultLanguage="javascript"
              value={code}
              onMount={handleEditorDidMount}
              onChange={handleEditorChange}
              options={{
                renderValidationDecorations: "off",
                fontSize: parseInt(fontSize.replace("px", "")),
              }}
            />
          </div>
          <div className="w-full px-5 overflow-auto">
            {showConsole ? (
              <div className="font-semibold my-4 text-white">
                <p className="text-sm font-medium mt-4">Output:</p>
                <div className="w-full rounded-lg border px-3 py-[10px] bg-dark-fill-3 whitespace-pre-wrap">
                  {isRunning ? "Running..." : (output || "No output yet")}
                </div>
              </div>
            ) : (
              <>
                <div className="flex h-10 items-center space-x-6">
                  <div className="text-sm font-medium text-white">Testcases</div>
                </div>
                <div className="flex">
                    {visibleTestCases.map((testCase, index) => (
                      <div
                        key={testCase.id}
                        className="mr-2 mt-2"
                        onClick={() => setActiveTestCaseId(index)}
                      >
                        <div
                          className={`px-4 py-1 rounded-lg cursor-pointer border ${testCaseResults[index]
                              ? "border-green-500 bg-green-500 bg-opacity-20 text-green-500"
                              : activeTestCaseId === index
                                ? "border-white text-white"
                                : "border-white text-gray-500"
                            }`}
                        >
                        Case {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
                  {visibleTestCases.length > 0 && visibleTestCases[activeTestCaseId] && (
                    <div className="font-semibold my-4 text-white">
                      <p className="text-sm font-medium mt-4">Input:</p>
                      <div className="w-full rounded-lg border px-3 py-[10px] bg-dark-fill-3">
                        {JSON.stringify(visibleTestCases[activeTestCaseId].input, null, 2)}
                      </div>
                      <p className="text-sm font-medium mt-4">Expected Output:</p>
                      <div className="w-full rounded-lg border px-3 py-[10px] bg-dark-fill-3">
                        {visibleTestCases[activeTestCaseId].expected}
                      </div>
                      <p className="text-sm font-medium mt-4">Actual Output:</p>
                      <div className="w-full rounded-lg border px-3 py-[10px] bg-dark-fill-3">
                        {testCaseOutputs[activeTestCaseId] || "Not executed yet"}
                      </div>
                    </div>
                  )}
              </>
            )}
          </div>
        </Split>
        <EditorFooter
          handleSubmit={handleSubmit}
          setShowConsole={setShowConsole}
          showConsole={showConsole}
        />
      </div>
    </>
  );
};

export default Playground;