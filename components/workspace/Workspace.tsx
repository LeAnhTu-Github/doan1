"use client";
import { useState, useEffect } from "react";
import Split from "react-split";
import ProblemDescription from "./ProblemDescription";
import { Problem } from "@/utils/types/problem";
import Confetti from "react-confetti";
import useWindowSize from "@/hooks/useWindowSize";
import Playground from "./Playground/Playground";
interface WorkspaceProps {
  id: string;
}
const Workspace = ({ id }: WorkspaceProps) => {
  const { width, height } = useWindowSize();
  const [success, setSuccess] = useState(false);
  const [solved, setSolved] = useState(false);
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/problems/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch problem");
        }
        const data = await response.json();
        setProblem(data);
      } catch (error) {
        console.error("Error fetching problem:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProblem();
    }
  }, [id]);


  return (
    <Split className="split" minSize={0}>
      <ProblemDescription ProblemId={id} />
      <div className="bg-dark-fill-2">
        {problem && (
          <Playground
            ProblemId={id}
            problem={problem}
            setSuccess={setSuccess}
            setSolved={setSolved}
          />
        )}
        {success && (
          <Confetti
            gravity={0.3}
            tweenDuration={4000}
            width={width - 1}
            height={height - 1}
          />
        )}
      </div>
    </Split>
  );
};
export default Workspace;
