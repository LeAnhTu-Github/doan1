"use client";
import { useState } from "react";
import Split from "react-split";
import ProblemDescription from "./ProblemDescription";
// import Playground from "./Playground/Playground";
import { Problem } from "@/utils/types/problem";
import Confetti from "react-confetti";
import useWindowSize from "@/hooks/useWindowSize";
import { twoSum } from "@/utils/problems/two-sum";
import Playground from "./Playground/Playground";
interface WorkspaceProps {
  id: string;
}
const Workspace = ({ id }: WorkspaceProps) => {
  const { width, height } = useWindowSize();
  const [success, setSuccess] = useState(false);
  const [solved, setSolved] = useState(false);

  return (
    <Split className="split" minSize={0}>
      <ProblemDescription />
      <div className="bg-dark-fill-2">
        <Playground
          pid={id}
          problem={twoSum}
          setSuccess={setSuccess}
          setSolved={setSolved}
        />
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
