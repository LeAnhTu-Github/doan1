"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
  targetDate: string | Date | undefined | null;
}

const CountdownTimer = ({ targetDate }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!targetDate) return;

    const calculateTimeLeft = () => {
      const targetDateTime = typeof targetDate === 'string' ? new Date(targetDate) : targetDate;
      const difference = targetDateTime.getTime() - new Date().getTime();
      
      if (difference <= 0) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    };

    // Update immediately
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      const timeLeft = calculateTimeLeft();
      setTimeLeft(timeLeft);

      // Clear interval if we've reached the target date
      if (Object.values(timeLeft).every(v => v === 0)) {
        clearInterval(timer);
      }
    }, 1000);

    // Cleanup on unmount
    return () => clearInterval(timer);
  }, [targetDate]);

  const formatNumber = (num: number) => String(num).padStart(2, '0');

  if (!targetDate) {
    return (
      <div className="text-center">
        <p className="text-gray-600 text-sm uppercase tracking-wide">
          Chưa có thời gian
        </p>
      </div>
    );
  }

  const targetDateTime = typeof targetDate === 'string' ? new Date(targetDate) : targetDate;
  if (targetDateTime <= new Date()) {
    return (
      <div className="text-center">
        <p className="text-gray-600 text-sm uppercase tracking-wide">
          Sự kiện đã diễn ra
        </p>
      </div>
    );
  }

  return (
    <div className="text-center space-y-2">
      <p className="text-gray-600 text-sm uppercase tracking-wide">
        Thời gian còn lại
      </p>
      <div className="flex justify-center items-center gap-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-700">{formatNumber(timeLeft.days)}</div>
          <div className="text-xs text-gray-500 uppercase">Ngày</div>
        </div>
        <div className="text-2xl font-bold text-gray-400">:</div>
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-700">{formatNumber(timeLeft.hours)}</div>
          <div className="text-xs text-gray-500 uppercase">Giờ</div>
        </div>
        <div className="text-2xl font-bold text-gray-400">:</div>
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-700">{formatNumber(timeLeft.minutes)}</div>
          <div className="text-xs text-gray-500 uppercase">Phút</div>
        </div>
        <div className="text-2xl font-bold text-gray-400">:</div>
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-700">{formatNumber(timeLeft.seconds)}</div>
          <div className="text-xs text-gray-500 uppercase">Giây</div>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
