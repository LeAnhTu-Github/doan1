"use client";
import { useState, useEffect } from "react";
import Split from "react-split";
import ProblemDescription from "./ProblemDescription";
import { Problem } from "@/utils/types/problem";
import Confetti from "react-confetti";
import useWindowSize from "@/hooks/useWindowSize";
import Playground from "./Playground/Playground";

type WorkspaceProps = {
  id: string;
  setProblemScores: (problemId: string, score: number) => void;
};

const Workspace = ({ id, setProblemScores }: WorkspaceProps) => {
  const { width, height } = useWindowSize();
  const [success, setSuccess] = useState(false);
  const [solved, setSolved] = useState(false);
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Reset states khi id thay đổi
  useEffect(() => {
    setSuccess(false);
    setSolved(false);
    setShowConfetti(false);
    setProblem(null); // Reset problem state
  }, [id]);

  // Tách riêng effect cho việc fetch problem
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchProblem = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/problems/${id}`, { signal });
        if (!response.ok) {
          throw new Error("Failed to fetch problem");
        }
        const data = await response.json();
        setProblem(data);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
        console.error("Error fetching problem:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProblem();
    }

    return () => {
      controller.abort();
    };
  }, [id]);

  // Tách riêng effect cho việc xử lý success
  useEffect(() => {
    if (success && setProblemScores && id) {
      setProblemScores(id, 100); // Assuming a score of 100 for now
    }
  }, [success, id, setProblemScores]);

  // Effect cho confetti
  useEffect(() => {
    if (success) {
      setShowConfetti(true);
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <Split className="split" minSize={0} sizes={[30, 70]}>
      <ProblemDescription ProblemId={id} />
      <div className="bg-dark-fill-2">
        {problem && (
          <Playground
            key={id} // Thêm key để force re-render khi id thay đổi
            ProblemId={id}
            problem={problem}
            setSuccess={setSuccess}
            setProblemScores={setProblemScores}
          />
        )}
        
        {showConfetti && (
          <Confetti
            gravity={0.3}
            tweenDuration={4000}
            width={width - 1}
            height={height - 1}
            recycle={false}
            numberOfPieces={200}
          />
        )}
      </div>
    </Split>
  );
};

export default Workspace;