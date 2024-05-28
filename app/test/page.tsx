import React from "react";
import { Navbar } from "../(dashboard)/_components/navbar";
import { Sidebar } from "../(dashboard)/_components/sidebar";
import ProblemTable from "@/components/problem/ProblemTable";
const page = () => {
  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-56 fixed inset-y-0 w-full z-20">
        <Navbar />
      </div>
      <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-20">
        <Sidebar />
      </div>
      <main className="md:pl-56 pt-[80px] h-full">
        <ProblemTable />
      </main>
    </div>
  );
};

export default page;
