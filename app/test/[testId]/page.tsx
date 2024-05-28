import React from "react";
// import Workspace from "@/components/workspace/Workspace";
import { problemss } from "@/lib/problem";
import { Problem } from "@prisma/client"; // Import the Problem type
import Workspace from "@/components/workspace/Workspace";
const page = ({ params }: { params: { testId: string } }) => {
  return (
    <>
      <div className=" text-black">
        <Workspace id={params.testId} />
      </div>
    </>
  );
};

export default page;
