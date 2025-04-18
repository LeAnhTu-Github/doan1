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
import { useParams } from 'next/navigation';
import SuccessModal from '@/components/modals/SuccessModal';
import AutoSubmitWarningModal from '@/components/modals/AutoSubmitWarningModal';

type PlaygroundProps = {
  ProblemId: string;
  problem: Problem;
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setProblemScores: (problemId: string, score: number) => void;
  mode: 'contest' | 'practice';
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

const Playground: React.FC<PlaygroundProps> = ({ ProblemId, problem, setSuccess, setProblemScores, mode }) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [activeTestCaseId, setActiveTestCaseId] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConsole, setShowConsole] = useState(false);
  const [output, setOutput] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [fontSize] = useLocalStorage("lcc-fontSize", "16px");
  const [submissionResult, setSubmissionResult] = useState<{
    status: string;
    score: number;
    totalScore: number;
    testCaseResults: Array<{
      status: string;
      stdout: string;
      stderr: string;
      expected: string;
    }>;
  } | null>(null);
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
  const [testCaseOutputs, setTestCaseOutputs] = useState<Record<string, string[]>>({});
  const [testCaseResults, setTestCaseResults] = useState<Record<string, boolean[]>>({});
  const params = useParams();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submissionScore, setSubmissionScore] = useState({ score: 0, totalScore: 0, solvedCount: 0 });
  const hasSubmittedRef = useRef(false);
  const [showWarningModal, setShowWarningModal] = useState(false);

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
  }, [ProblemId]);

  useEffect(() => {
    if (hasSubmittedRef.current) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && !hasSubmittedRef.current && !showWarningModal) {
        console.log("Tab switched, showing warning modal...");
        setShowWarningModal(true);
      }
    };

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasSubmittedRef.current && !showWarningModal) {
        console.log("Page leaving, showing warning modal...");
        setShowWarningModal(true);
        event.preventDefault();
        event.returnValue = '';
      }
    };

    if (mode === 'contest') {
      document.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [mode, ProblemId, selectedLanguage, showWarningModal]);

  const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    editor.setValue(code);
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
      localStorage.setItem(`code-${ProblemId}-${selectedLanguage}`, JSON.stringify(value));
    }
  };

  const handleRun = async () => {
    if (!editorRef.current) {
      setOutput("Editor not initialized");
      return;
    }
  
    setIsRunning(true);
    setOutput("Running...");

    const userCode = editorRef.current.getValue();
    const languageId = languageMap[selectedLanguage as keyof typeof languageMap];
  
    try {
      if (mode === 'contest') {
        const result = await executeCode({
          source_code: userCode,
          language_id: languageId,
          stdin: "",
        });

        setOutput(result.trim());
      } else {
        if (!testCases.length || !testCases[activeTestCaseId]) {
          setOutput("No valid test case available");
          setIsRunning(false);
          return;
        }

        const metadata = typeof problem.metadata === 'string'
          ? JSON.parse(problem.metadata)
          : problem.metadata;

        const wrappedCode = CodeWrapperService.generateWrapper(
          userCode,
          selectedLanguage,
          metadata,
          problem.functionName
        );

        const executionResults = await Promise.all(
          testCases.map(async (testCase) => {
            const inputJson = JSON.stringify(testCase.input);
            const result = await executeCode({
              source_code: wrappedCode,
              language_id: languageId,
              stdin: inputJson,
            });

            const parsedOutput = result.trim();
            return {
              output: parsedOutput,
              passed: parsedOutput === testCase.expected.trim()
            };
          })
        );

        const results = executionResults.map(result => result.passed);
        const outputs = executionResults.map(result => result.output);
  
        setTestCaseResults(prev => ({
          ...prev,
          [ProblemId]: results
        }));
        
        setTestCaseOutputs(prev => ({
          ...prev,
          [ProblemId]: outputs
        }));
  
        setOutput(outputs[activeTestCaseId] || "No output");
      }
    } catch (error) {
      console.error("Execution error:", error);
      setOutput(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!editorRef.current) {
      setOutput("Editor not initialized");
      return;
    }

    if (mode === 'practice' && !hasSubmittedRef.current && !window.confirm('Bạn có chắc chắn muốn nộp bài? Hành động này không thể hoàn tác.')) {
      return;
    }

    setIsSubmitting(true);
    setOutput("Submitting...");
    setShowWarningModal(false);

    try {
      const userCode = editorRef.current.getValue();

      if (mode === 'practice') {
        const response = await fetch(`/api/problems/${ProblemId}/practice-submissions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: userCode,
            language: selectedLanguage,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to submit code');
        }

        const data = await response.json();
        setSubmissionResult(data.results);
        setSuccess(data.results.status === 'Accepted');
        setProblemScores(ProblemId, data.results.score);

        setSubmissionScore({
          score: data.results.score,
          totalScore: 100,
          solvedCount: data.results.solvedCount
        });
        setShowSuccessModal(true);
      } else {
        const contestId = params.id as string;
        const response = await fetch(`/api/contests/${contestId}/submissions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            problemId: ProblemId,
            code: userCode,
            language: selectedLanguage,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to submit code');
        }

        const data = await response.json();
        setSubmissionResult(data.results);
        setSuccess(data.results.status === 'Accepted');
        setProblemScores(ProblemId, data.results.score);

        setSubmissionScore({
          score: data.results.score,
          totalScore: 10,
          solvedCount: 0
        });
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error("Submission error:", error);
      setOutput(`Error: ${error instanceof Error ? error.message : "Failed to submit code"}`);
      setSuccess(false);
      setProblemScores(ProblemId, 0);
    } finally {
      setIsSubmitting(false);
      hasSubmittedRef.current = true;
    }
  };

  const handleCancelAutoSubmit = () => {
    setShowWarningModal(false);
  };

  if (isLoading) {
    return <div className="text-white dark:text-gray-800">Đang tải test cases...</div>;
  }

  const visibleTestCases = testCases.filter((testCase) => !testCase.isHidden);

  return (
    <>
      <PreferenceNav setLanguage={setSelectedLanguage} />
      <div className="flex flex-col bg-dark-layer-1 dark:bg-gray-100 relative overflow-x-hidden">
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
                suggestOnTriggerCharacters: true,
                fontSize: parseInt(fontSize.replace("px", "")),
              }}
            />
          </div>
          <div className="w-full px-4 overflow-auto">
            {mode === 'contest' ? (
              <div className="font-semibold my-2 text-white dark:text-gray-800">
                <p className="text-xs font-medium mt-3">Đầu ra:</p>
                <div className="w-full rounded-lg border px-2 py-1.5 bg-dark-fill-3 dark:bg-gray-200 whitespace-pre-wrap text-sm text-white dark:text-gray-800">
                  {isRunning ? "Đang chạy..." : isSubmitting ? "Đang nộp..." : (output || "Chưa có đầu ra")}
                </div>
                {submissionResult && (
                  <div className="mt-2">
                    <p className="text-xs font-medium">Kết quả bài nộp:</p>
                    <div className="w-full rounded-lg border px-2 py-1.5 bg-dark-fill-3 dark:bg-gray-200 text-sm text-white dark:text-gray-800">
                      <p>Trạng thái: {submissionResult.status}</p>
                      <p>Điểm số: {submissionResult.score}</p>
                      <p>Tổng điểm: {submissionResult.totalScore}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              showConsole ? (
                <div className="font-semibold my-2 text-white dark:text-gray-800">
                  <p className="text-xs font-medium mt-3">Đầu ra:</p>
                  <div className="w-full rounded-lg border px-2 py-1.5 bg-dark-fill-3 dark:bg-gray-200 whitespace-pre-wrap text-sm text-white dark:text-gray-800">
                    {isRunning ? "Đang chạy..." : isSubmitting ? "Đang nộp..." : (output || "Chưa có đầu ra")}
                  </div>
                  {submissionResult && (
                    <div className="mt-2">
                      <p className="text-xs font-medium">Kết quả bài nộp:</p>
                      <div className="w-full rounded-lg border px-2 py-1.5 bg-dark-fill-3 dark:bg-gray-200 text-sm text-white dark:text-gray-800">
                        <p>Trạng thái bài nộp: {submissionResult.status}</p>
                        <p>Điểm số: {submissionResult.score}</p>
                        <p>Tổng điểm: {submissionResult.totalScore}</p>
                        <div className="mt-1">
                          <p className="font-medium text-xs">Kết quả test case:</p>
                          {submissionResult.testCaseResults.map((result, index) => (
                            <div key={index} className="mt-0.5">
                              <p>Case {index + 1}: {result.status}</p>
                              {result.stderr && <p className="text-red-500 dark:text-red-600 text-sm">Lỗi: {result.stderr}</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div className="flex h-8 items-center space-x-4">
                    <div className="text-xs font-medium text-white dark:text-gray-800">Testcases</div>
                  </div>
                  <div className="flex">
                    {visibleTestCases.map((testCase, index) => (
                      <div
                        key={testCase.id}
                        className="mr-1.5 mt-1.5"
                        onClick={() => setActiveTestCaseId(index)}
                      >
                        <div
                          className={`px-3 py-0.5 rounded-md cursor-pointer border text-xs ${
                            testCaseResults[ProblemId]?.[index]
                              ? "border-green-500 bg-green-500 bg-opacity-20 text-green-500 dark:border-green-600 dark:bg-green-600 dark:bg-opacity-20 dark:text-green-600"
                              : testCaseResults[ProblemId]?.[index] === false
                              ? "border-red-500 bg-red-500 bg-opacity-20 text-red-500 dark:border-red-600 dark:bg-red-600 dark:bg-opacity-20 dark:text-red-600"
                              : activeTestCaseId === index
                              ? "border-white text-white dark:border-gray-800 dark:text-gray-800"
                              : "border-white text-gray-500 dark:border-gray-400 dark:text-gray-400"
                          }`}
                        >
                          Case {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                  {visibleTestCases.length > 0 && visibleTestCases[activeTestCaseId] && (
                    <div className="font-semibold my-2 text-white dark:text-gray-800">
                      <p className="text-xs font-medium mt-3">Đầu vào:</p>
                      <div className="w-full rounded-lg border px-2 py-1.5 bg-dark-fill-3 dark:bg-gray-200 text-sm text-white dark:text-gray-800">
                        {JSON.stringify(visibleTestCases[activeTestCaseId].input, null, 2)}
                      </div>
                      <p className="text-xs font-medium mt-3">Đầu ra dự kiến:</p>
                      <div className="w-full rounded-lg border px-2 py-1.5 bg-dark-fill-3 dark:bg-gray-200 text-sm text-white dark:text-gray-800">
                        {visibleTestCases[activeTestCaseId].expected}
                      </div>
                      <p className="text-xs font-medium mt-3">Đầu ra thực tế:</p>
                      <div className="w-full rounded-lg border px-2 py-1.5 bg-dark-fill-3 dark:bg-gray-200 text-sm text-white dark:text-gray-800">
                        {testCaseOutputs[ProblemId]?.[activeTestCaseId] || "Chưa chạy"}
                      </div>
                    </div>
                  )}
                </>
              )
            )}
          </div>
        </Split>
        <EditorFooter
          handleRun={handleRun}
          handleSubmit={handleSubmit}
          setShowConsole={setShowConsole}
          showConsole={showConsole}
          mode={mode}
        />
      </div>
      
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        score={submissionScore.score}
        totalScore={submissionScore.totalScore}
        solvedCount={mode === 'practice' ? submissionScore.solvedCount : undefined}
      />
      <AutoSubmitWarningModal
        isOpen={showWarningModal}
        onConfirm={handleSubmit}
        onCancel={handleCancelAutoSubmit}
      />
    </>
  );
};

export default Playground;