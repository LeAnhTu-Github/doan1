'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ContestUpdaterProps {
  contestId: string;
}

export const ContestUpdater = ({ contestId }: ContestUpdaterProps) => {
  const router = useRouter();

  useEffect(() => {
    const eventSource = new EventSource(`/api/contests/${contestId}/events`);

    eventSource.onmessage = () => {
      router.refresh(); // Refresh the page to update server components
    };

    eventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [contestId, router]);

  return null;
}; 