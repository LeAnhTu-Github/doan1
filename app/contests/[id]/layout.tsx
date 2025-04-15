"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/app/(dashboard)/_components/navbar";
import { Sidebar } from "@/app/(dashboard)/_components/sidebar";
import { useParams } from "next/navigation";
import moment from "moment";

// Reuse the same enum from your page component
enum ContestStatus {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  ENDED = "ENDED",
}

const ContestLayout = ({ children }: { children: React.ReactNode }) => {
  const { id } = useParams();
  const [contestStatus, setContestStatus] = useState<ContestStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContestStatus = async () => {
      try {
        const response = await fetch(`/api/contests/${id}`);
        const contest = await response.json();
        
        const now = moment();
        const startTime = moment(contest.startTime);
        const endTime = moment(contest.startTime).add(contest.duration, 'minutes');

        if (!contest.isActive || now.isBefore(startTime)) {
          setContestStatus(ContestStatus.NOT_STARTED);
        } else if (now.isAfter(endTime)) {
          setContestStatus(ContestStatus.ENDED);
        } else {
          setContestStatus(ContestStatus.IN_PROGRESS);
        }
      } catch (error) {
        console.error("Error fetching contest status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContestStatus();
  }, [id]);

  if (loading) {
    return <div>{children}</div>;
  }

  // During the contest (IN_PROGRESS), render without layout
  if (contestStatus === ContestStatus.IN_PROGRESS) {
    return <div className="h-full">{children}</div>;
  }

  // For other states (NOT_STARTED, ENDED), render with layout
  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-56 fixed inset-y-0 w-full z-20">
        <Navbar />
      </div>
      <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-20">
        <Sidebar />
      </div>
      <main className="md:pl-56 pt-[80px] h-full">{children}</main>
    </div>
  );
};

export default ContestLayout;
