import React from "react";
// import Workspace from "@/components/workspace/Workspace";
import { Problem } from "@prisma/client"; // Import the Problem type
import Workspace from "@/components/workspace/Workspace";
const page = ({ params }: { params: { ProblemId: string } }) => {
  return (
    <>
      <div className=" text-black">
        <Workspace id={params.ProblemId} />
      </div>
    </>
  );
};

export default page;
