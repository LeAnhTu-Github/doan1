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

const Playground: React.FC<PlaygroundProps> = ({ ProblemId,problem, setSuccess, setProblemScores, mode }) => {
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
        // Contest mode: chạy trực tiếp code của người dùng
        const result = await executeCode({
          source_code: userCode, // Sử dụng code gốc không qua wrapper
          language_id: languageId,
          stdin: "", // Không cần stdin vì input đã nằm trong code
        });

        setOutput(result.trim());
      } else {
        // Practice mode: giữ nguyên logic cũ
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

    // Chỉ hiển thị confirm dialog trong practice mode
    if (mode === 'practice' && !window.confirm('Bạn có chắc chắn muốn nộp bài? Hành động này không thể hoàn tác.')) {
      return;
    }

    setIsSubmitting(true);
    setOutput("Submitting...");

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

        // Cập nhật state cho modal
        setSubmissionScore({
          score: data.results.score,
          totalScore: 100, // hoặc lấy từ problem.totalScore nếu có
          solvedCount: data.results.solvedCount
        });
        setShowSuccessModal(true);

      } else {
        // Contest mode logic...
        const contestId = params.id as string;
        // ... existing contest submission code ...

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

        // Cập nhật state cho modal trong contest mode
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
    }
  };

  if (isLoading) {
    return <div className="text-white">Đang tải test cases...</div>;
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
                suggestOnTriggerCharacters: true,
                fontSize: parseInt(fontSize.replace("px", "")),
              }}
            />
          </div>
          <div className="w-full px-5 overflow-auto">
            {mode === 'contest' ? (
              <div className="font-semibold my-4 text-white">
                <p className="text-sm font-medium mt-4">Đầu ra:</p>
                <div className="w-full rounded-lg border px-3 py-[10px] bg-dark-fill-3 whitespace-pre-wrap">
                  {isRunning ? "Đang chạy..." : isSubmitting ? "Đang nộp..." : (output || "Chưa có đầu ra")}
                </div>
                {submissionResult && (
                  <div className="mt-4">
                    <p className="text-sm font-medium">Kết quả bài nộp:</p>
                    <div className="w-full rounded-lg border px-3 py-[10px] bg-dark-fill-3">
                      <p>Trạng thái: {submissionResult.status}</p>
                      <p>Điểm số: {submissionResult.score}</p>
                      <p>Tổng điểm: {submissionResult.totalScore}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              showConsole ? (
                <div className="font-semibold my-4 text-white">
                  <p className="text-sm font-medium mt-4">Đầu ra:</p>
                  <div className="w-full rounded-lg border px-3 py-[10px] bg-dark-fill-3 whitespace-pre-wrap">
                    {isRunning ? "Đang chạy..." : isSubmitting ? "Đang nộp..." : (output || "Chưa có đầu ra")}
                  </div>
                  {submissionResult && (
                    <div className="mt-4">
                      <p className="text-sm font-medium">Kết quả bài nộp:</p>
                      <div className="w-full rounded-lg border px-3 py-[10px] bg-dark-fill-3">
                        <p>Trạng thái bài nộp: {submissionResult.status}</p>
                        <p>Điểm số: {submissionResult.score}</p>
                        <p>Tổng điểm: {submissionResult.totalScore}</p>
                        <div className="mt-2">
                          <p className="font-medium">Kết quả test case:</p>
                          {submissionResult.testCaseResults.map((result, index) => (
                            <div key={index} className="mt-1">
                              <p>Case {index + 1}: {result.status}</p>
                              {result.stderr && <p className="text-red-500">Lỗi: {result.stderr}</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
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
                            className={`px-4 py-1 rounded-lg cursor-pointer border ${
                              testCaseResults[ProblemId]?.[index]
                                ? "border-green-500 bg-green-500 bg-opacity-20 text-green-500"
                                : testCaseResults[ProblemId]?.[index] === false
                                ? "border-red-500 bg-red-500 bg-opacity-20 text-red-500"
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
                        <p className="text-sm font-medium mt-4">Đầu vào:</p>
                        <div className="w-full rounded-lg border px-3 py-[10px] bg-dark-fill-3">
                          {JSON.stringify(visibleTestCases[activeTestCaseId].input, null, 2)}
                        </div>
                        <p className="text-sm font-medium mt-4">Đầu ra dự kiến:</p>
                        <div className="w-full rounded-lg border px-3 py-[10px] bg-dark-fill-3">
                          {visibleTestCases[activeTestCaseId].expected}
                        </div>
                        <p className="text-sm font-medium mt-4">Đầu ra thực tế:</p>
                        <div className="w-full rounded-lg border px-3 py-[10px] bg-dark-fill-3">
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
    </>
  );
};

export default Playground;