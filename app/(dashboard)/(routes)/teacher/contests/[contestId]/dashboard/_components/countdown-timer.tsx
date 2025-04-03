'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const CountdownTimer = () => {
  const router = useRouter();
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          // When countdown reaches 0, refresh data and reset countdown
          router.refresh();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="flex items-center gap-x-2 text-sm text-muted-foreground">
      <div className="flex items-center gap-x-1">
        <span>Cập nhật sau:</span>
        <span className="font-medium">{seconds}s</span>
      </div>
      <div className="h-4 w-4 relative">
        <svg
          className="absolute inset-0 h-full w-full rotate-90 transform"
          viewBox="0 0 100 100"
        >
          <circle
            className="text-muted stroke-current"
            strokeWidth="10"
            fill="none"
            r="40"
            cx="50"
            cy="50"
          />
          <circle
            className="text-sky-600 stroke-current"
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
            r="40"
            cx="50"
            cy="50"
            style={{
              strokeDasharray: 251.2,
              strokeDashoffset: 251.2 * (1 - seconds / 60),
              transition: 'stroke-dashoffset 1s linear'
            }}
          />
        </svg>
      </div>
    </div>
  );
};