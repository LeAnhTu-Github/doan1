"use client";
import React from "react";
import SectionInfo from "./SectionInfo";
import SectionBox from "./SectionBox";
interface SidebarProps {
  currentUsers?: any;
}
const Section = ({ currentUsers }: SidebarProps) => {
  return (
    <div className="w-full h-[200px] flex gap-4 ">
      <SectionInfo currentUser={currentUsers} />
      <SectionBox />
    </div>
  );
};

export default Section;
