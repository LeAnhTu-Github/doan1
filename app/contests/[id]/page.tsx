"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import moment from "moment";
import Workspace from "@/components/workspace/Workspace";
import { Contest } from "@prisma/client";
import { Problem } from "@prisma/client";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";

// Define the ContestWithProblems type
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
  const [solvedProblems, setSolvedProblems] = useState<Set<string>>(new Set());
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

    return () => {
      controller.abort();
    };
  }, [id]);

  // Calculate time left
  useEffect(() => {
    if (!contest?.endTime) return;

    const updateTimeLeft = () => {
      const endTime = moment(contest.endTime);
      const now = moment();

      if (endTime.isAfter(now)) {
        const duration = moment.duration(endTime.diff(now));
        setTimeLeft(
          `${String(Math.floor(duration.asHours())).padStart(2, "0")}:${String(
            duration.minutes()
          ).padStart(2, "0")}:${String(duration.seconds()).padStart(2, "0")}`
        );
      } else {
        setTimeLeft("Contest has ended");
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
            {/* Home Button */}
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
                const isSolved = solvedProblems.has(problem.problem.id);
                return (
                  <li key={problem.problem.id} className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-all ${selectedProblemId === problem.problem.id ? "bg-blue-600 text-white" : "bg-white text-blue-600 hover:bg-gray-200"}`}
                      onClick={() => handleProblemSelect(problem.problem.id)}>
                    <span className="flex-1">{`${index + 1}. ${problem.problem.title}`}</span>
                    {isSolved && <span className="text-green-500">✔</span>}
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? "w-3/4" : "w-full"}`}>
        {selectedProblemId ? (
          <Workspace key={selectedProblemId} id={selectedProblemId} setSolvedProblems={setSolvedProblems} />
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
  );
}
