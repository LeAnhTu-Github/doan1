"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import moment from "moment";
import Workspace from "@/components/workspace/Workspace";
import { Contest } from "@prisma/client";
import { Problem } from "@prisma/client";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";

type ContestWithProblems = Contest & {
  problems: { problem: Problem }[];
};

export default function ContestDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [contest, setContest] = useState<ContestWithProblems | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(null);
  const [problemScores, setProblemScores] = useState<Record<string, number>>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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

  // Calculate time left
  useEffect(() => {
    if (!contest?.startTime || !contest?.endTime) return;

    const updateTimeLeft = () => {
      const startTime = moment(contest.startTime);
      const endTime = moment(contest.endTime);
      const now = moment();

      // Calculate total duration of the contest
      const totalDuration = moment.duration(endTime.diff(startTime));
      
      // Calculate time elapsed since contest start
      const timeElapsed = moment.duration(now.diff(startTime));
      
      // Calculate remaining time
      const remainingTime = moment.duration(totalDuration.asMilliseconds() - timeElapsed.asMilliseconds());

      if (remainingTime.asMilliseconds() > 0) {
        const hours = Math.floor(remainingTime.asHours());
        const minutes = remainingTime.minutes();
        const seconds = remainingTime.seconds();
        
        setTimeLeft(
          `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
        );
      } else {
        setTimeLeft("00:00:00");
        handleEnd();
      }
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 1000);
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
  const handleEnd = () => {
    // TODO: Implement end contest logic
    if (window.confirm('Bạn có chắc chắn muốn kết thúc bài thi? Hành động này không thể hoàn tác.')) {
      // Add your end contest logic here
      router.push('/'); // Redirect to home page or results page
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!contest) return <div className="text-center py-10">No contest found</div>;

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
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
          >
            Kết thúc bài thi
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