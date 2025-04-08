"use client";

import React from "react";
// import Workspace from "@/components/workspace/Workspace";
import { Problem } from "@prisma/client"; // Import the Problem type
import Workspace from "@/components/workspace/Workspace";

const Page = ({ params }: { params: { ProblemId: string } }) => {
  // Define the function here
  const handleSetProblemScores = (problemId: string, score: number) => {
    // Add your score handling logic here
    console.log(`Problem ${problemId} score: ${score}`);
  };

  return (
    <>
      <div className=" text-black">
        <Workspace 
          id={params.ProblemId}
          mode="practice"
          setProblemScores={handleSetProblemScores}
        />
      </div>
    </>
  );
};

export default Page;
