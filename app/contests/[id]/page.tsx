"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import moment from "moment";
import Workspace from "@/components/workspace/Workspace";
import { Contest } from "@prisma/client";
import { Problem } from "@prisma/client";
import { ChevronLeft, ChevronRight, Home, Timer, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

// Định nghĩa các trạng thái của cuộc thi
enum ContestStatus {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  ENDED = "ENDED",
}

type ContestWithProblems = Contest & {
  problems: { problem: Problem }[];
};

// Component hiển thị khi cuộc thi chưa bắt đầu
const ContestNotStarted = ({
  contest,
  timeToStart,
  onStartContest,
  router,
}: {
  contest: ContestWithProblems;
  timeToStart: string;
  onStartContest: () => void;
  router: any;
}) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <Card className="w-full max-w-2xl p-8 space-y-6 text-center">
      <h1 className="text-3xl font-bold text-blue-600">{contest.title}</h1>
      <div className="space-y-4">
        <div className="flex items-center justify-center space-x-3 text-2xl font-semibold">
          <Timer className="w-8 h-8 text-blue-600" />
          <span>Cuộc thi sắp diễn ra trong:</span>
        </div>
        <div className="text-4xl font-bold text-blue-600">{timeToStart}</div>
      </div>
      <div className="space-y-2">
        <p className="text-gray-600">
          Thời gian bắt đầu: {moment(contest.startTime).format("HH:mm DD/MM/YYYY")}
        </p>
        <p className="text-gray-600">
          Thời gian kết thúc: {moment(contest.endTime).format("HH:mm DD/MM/YYYY")}
        </p>
      </div>
      <div className="flex justify-center space-x-4">
        <Button
          onClick={() => router.push("/")}
          variant="outline"
          className="px-8 py-3 rounded-lg text-lg"
        >
          Về trang chủ
        </Button>
        {moment().isAfter(moment(contest.startTime)) && (
          <Button
            onClick={onStartContest}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg"
          >
            Bắt đầu làm bài
          </Button>
        )}
      </div>
    </Card>
  </div>
);

// Component hiển thị khi cuộc thi đã kết thúc
const ContestEnded = ({ contest }: { contest: ContestWithProblems }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <Card className="w-full max-w-2xl p-8 space-y-6 text-center">
      <Trophy className="w-16 h-16 text-yellow-500 mx-auto" />
      <h1 className="text-3xl font-bold text-gray-800">Cuộc thi đã kết thúc</h1>
      <p className="text-xl text-gray-600">{contest.title}</p>
      <div className="space-y-2">
        <p className="text-gray-600">
          Cảm ơn bạn đã tham gia cuộc thi. Hẹn gặp lại bạn trong các cuộc thi khác!
        </p>
      </div>
      <Button
        onClick={() => window.location.href = '/'}
        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg"
      >
        Xem các cuộc thi khác
      </Button>
    </Card>
  </div>
);

export default function ContestDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [contest, setContest] = useState<ContestWithProblems | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [timeToStart, setTimeToStart] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(null);
  const [problemScores, setProblemScores] = useState<Record<string, number>>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [contestStatus, setContestStatus] = useState<ContestStatus>(ContestStatus.NOT_STARTED);
  const [isSubmittingAll, setIsSubmittingAll] = useState(false);
  const [submissionProgress, setSubmissionProgress] = useState({ current: 0, total: 0 });
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);

  // Fetch contest data
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchContest = async () => {
      try {
        const response = await fetch(`/api/contests/${id}`, { signal });
        if (!response.ok) throw new Error("Contest not found");

        const data = await response.json();
        setContest(data);
        if (data.problems.length > 0) {
          setSelectedProblemId(data.problems[0].problem.id);
        }
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
        setError(error instanceof Error ? error.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchContest();

    return () => controller.abort();
  }, [id]);

  // Calculate contest status and time
  useEffect(() => {
    if (!contest?.startTime || !contest?.endTime) return;

    const updateTime = () => {
      const now = moment();
      const startTime = moment(contest.startTime);
      const endTime = moment(contest.endTime);

      // Xác định trạng thái cuộc thi
      if (now.isBefore(startTime)) {
        setContestStatus(ContestStatus.NOT_STARTED);
        const duration = moment.duration(startTime.diff(now));
        setTimeToStart(
          `${String(Math.floor(duration.asHours())).padStart(2, "0")}:${String(duration.minutes()).padStart(2, "0")}:${String(duration.seconds()).padStart(2, "0")}`
        );
      } else if (now.isAfter(endTime)) {
        setContestStatus(ContestStatus.ENDED);
      } else {
        setContestStatus(ContestStatus.IN_PROGRESS);
        const duration = moment.duration(endTime.diff(now));
        setTimeLeft(
          `${String(Math.floor(duration.asHours())).padStart(2, "0")}:${String(duration.minutes()).padStart(2, "0")}:${String(duration.seconds()).padStart(2, "0")}`
        );
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [contest]);

  // Handle problem selection
  const handleProblemSelect = (problemId: string) => {
    setSelectedProblemId(problemId);
  };

  // Stabilize handleUpdateScore with useCallback and prevent unnecessary updates Establishing stable reference to prevent infinite loop
  const handleUpdateScore = useCallback((problemId: string, score: number) => {
    setProblemScores((prev) => {
      // Only update if the score has actually changed
      if (prev[problemId] === score) return prev;
      return { ...prev, [problemId]: score };
    });
  }, []); // Empty dependency array since it doesn't depend on any external values

  // Sửa hàm tính tổng điểm
  const calculateTotalScore = () => {
    const currentTotal = Object.values(problemScores).reduce((sum, score) => sum + score, 0);
    const maxPossibleScore = contest?.problems.length ? contest.problems.length * 100 : 0;
    return `${currentTotal}/${maxPossibleScore}`;
  };

  // Thêm hàm xử lý kết thúc bài thi
  const handleEnd = async () => {
    if (!contest) return;
    
    // Hiển thị thông báo xác nhận một lần duy nhất
    if (!window.confirm('Bạn có chắc chắn muốn kết thúc bài thi? Tất cả các bài chưa nộp sẽ được tự động nộp. Hành động này không thể hoàn tác.')) {
      return;
    }
    
    setIsSubmittingAll(true);
    
    // Lấy tất cả các problem trong contest
    const problems = contest.problems.map(p => p.problem.id);
    setSubmissionProgress({ current: 0, total: problems.length });
    
    // Tạo một mảng các promise để submit tất cả các problem
    const submissionPromises = problems.map(async (problemId, index) => {
      try {
        // Lấy code từ localStorage
        const storedCode = localStorage.getItem(`code-${problemId}-javascript`);
        if (!storedCode) {
          setSubmissionProgress(prev => ({ ...prev, current: prev.current + 1 }));
          return; // Bỏ qua nếu không có code
        }
        
        const userCode = JSON.parse(storedCode);
        
        // Submit code
        const response = await fetch(`/api/contests/${id}/submissions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            problemId: problemId,
            code: userCode,
            language: 'javascript', // Sử dụng ngôn ngữ mặc định
          }),
        });
        
        if (!response.ok) {
          console.error(`Failed to submit problem ${problemId}`);
          setSubmissionProgress(prev => ({ ...prev, current: prev.current + 1 }));
          return;
        }
        
        const data = await response.json();
        // Cập nhật điểm số
        handleUpdateScore(problemId, data.results.score);
        
      } catch (error) {
        console.error(`Error submitting problem ${problemId}:`, error);
      } finally {
        // Cập nhật tiến trình
        setSubmissionProgress(prev => ({ ...prev, current: prev.current + 1 }));
      }
    });
    
    // Chờ tất cả các submission hoàn thành
    await Promise.all(submissionPromises);
    
    // Hiển thị thông báo hoàn thành
    setShowCompletionMessage(true);
    
    // Tính toán điểm cuối cùng
    const finalScore = Object.values(problemScores).reduce((sum, score) => sum + score, 0);
    const maxPossibleScore = contest.problems.length * 100;
    
    // Hiển thị toast thông báo
    toast.success(`Đã nộp xong tất cả bài thi! Điểm của bạn: ${finalScore}/${maxPossibleScore}`, {
      duration: 3000,
    });
    
    // Đợi 2 giây trước khi chuyển hướng
    setTimeout(() => {
      setIsSubmittingAll(false);
      setShowCompletionMessage(false);
      router.push('/');
    }, 2000);
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!contest) return <div className="text-center py-10">No contest found</div>;

  // Render based on contest status
  switch (contestStatus) {
    case ContestStatus.NOT_STARTED:
      return (
        <ContestNotStarted
          contest={contest}
          timeToStart={timeToStart}
          onStartContest={() => setContestStatus(ContestStatus.IN_PROGRESS)}
          router={router}
        />
      );

    case ContestStatus.ENDED:
      return <ContestEnded contest={contest} />;

    case ContestStatus.IN_PROGRESS:
      return (
        <div className="flex min-h-screen bg-gray-100 relative">
          {/* Toggle Sidebar Button */}
          <button
            className="absolute left-2 top-4 bg-blue-600 text-white p-2 rounded-full shadow-md z-50"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
          </button>

          {/* Sidebar */}
          <div className={`bg-white shadow-lg p-6 transition-all duration-300 ${isSidebarOpen ? "w-1/4" : "w-16"}`}>
            {isSidebarOpen && (
              <>
                <button
                  className="mb-4 flex items-center space-x-2 text-blue-600 hover:underline"
                  onClick={() => router.push("/")}
                >
                  <Home size={20} />
                  <span>Trang chủ</span>
                </button>
                <h1 className="text-2xl font-bold mb-4">{contest.title}</h1>
                <div className="mb-6">
                  <p className="text-gray-600">
                    Thời gian còn lại: <span className="font-semibold">{timeLeft}</span>
                  </p>
                </div>
                <hr />
                <h2 className="text-xl font-semibold my-3">Bài thi</h2>
                <ul className="space-y-2">
                  {contest.problems.map((problem, index) => {
                    const score = problemScores[problem.problem.id];
                    return (
                      <li
                        key={problem.problem.id}
                        className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-all ${
                          selectedProblemId === problem.problem.id
                            ? "bg-blue-600 text-white"
                            : "bg-white text-blue-600 hover:bg-gray-200"
                        }`}
                        onClick={() => handleProblemSelect(problem.problem.id)}
                      >
                        <span className="flex-1">{`${index + 1}. ${problem.problem.title}`}</span>
                        {score !== undefined && (
                          <span
                            className={`font-semibold ${
                              selectedProblemId === problem.problem.id 
                                ? "text-white" 
                                : score === 0 
                                  ? "text-red-600" 
                                  : "text-green-600"
                            }`}
                          >
                            {score}/100
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </div>

          {/* Main Content */}
          <div className={`h-screen transition-all duration-300 ${isSidebarOpen ? "w-3/4" : "w-full"} flex flex-col`}>
            {/* Score Summary and End Button */}
            <div className="bg-white shadow-md p-4 h-14 flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <span className="text-lg font-semibold">Tổng điểm:</span>
                <span className="text-2xl font-bold text-blue-600">{calculateTotalScore()}</span>
              </div>
              <button
                onClick={handleEnd}
                disabled={isSubmittingAll}
                className={`${
                  isSubmittingAll 
                    ? "bg-gray-500 cursor-not-allowed" 
                    : "bg-red-600 hover:bg-red-700"
                } text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 flex items-center`}
              >
                {isSubmittingAll ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {showCompletionMessage ? "Đã nộp xong! Đang chuyển hướng..." : `Đang nộp bài... (${submissionProgress.current}/${submissionProgress.total})`}
                  </>
                ) : (
                  "Kết thúc bài thi"
                )}
              </button>
            </div>

            {/* Workspace */}
            <div className="flex-1">
              {selectedProblemId ? (
                <Workspace
                  mode="contest"
                  key={selectedProblemId}
                  id={selectedProblemId}
                  setProblemScores={handleUpdateScore}
                  score={problemScores[selectedProblemId]}
                />
              ) : (
                <div className="p-8">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <p className="text-gray-500">
                      {contest.problems.length > 0 ? "Chọn một bài thi để bắt đầu" : "Không có bài thi nào để hiển thị"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
  }
}