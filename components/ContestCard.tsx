"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Contest } from "@prisma/client";
import moment from "moment";
import { message } from "antd";

interface ContestCardProps {
  contest: Contest;
  isRegistered?: boolean;
  userId?: string;
}

const ContestCard = ({
  contest,
  isRegistered: initialIsRegistered = false,
  userId,
}: ContestCardProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(initialIsRegistered);

  const handleRegister = async () => {
    if (!userId) {
      router.push("/sign-in");
      return;
    }
    try {
      setIsLoading(true);
      const response = await fetch(`/api/contests/${contest.id}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Đăng ký thất bại");
      message.success("Đăng ký thành công!");
      setIsRegistered(true);
    } catch {
      message.error("Có lỗi xảy ra khi đăng ký");
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinContest = () => {
    router.push(`/contests/${contest.id}`);
  };

  return (
    <div className="group hover:shadow-lg transition overflow-hidden border rounded-xl p-0 h-full bg-white flex flex-col">
      <div className="relative w-full aspect-video rounded-t-xl overflow-hidden">
        <Image
          fill
          className="object-cover"
          alt={contest.title}
          src={contest.imageUrl || "/default-contest-image.webp"}
          sizes="(max-width: 400px) 100vw, 300px"
          quality={80}
          loading="lazy"
        />
      </div>
      <div className="flex flex-col flex-1 px-4 py-4">
        <div
          className="text-base font-semibold text-center group-hover:text-sky-700 transition line-clamp-2 mb-2"
          title={contest.title}
        >
          {contest.title}
        </div>
        <div className="flex justify-center mb-4">
          <span className="inline-block text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium shadow-sm">
            {contest.startTime
              ? moment(contest.startTime).format("DD/MM/YYYY HH:mm")
              : "Chưa có ngày"}
          </span>
        </div>
        <div className="flex justify-center gap-3 mt-auto">
          <button
            className="w-[90px] h-[34px] rounded-md border border-sky-500 text-sky-700 bg-white hover:bg-sky-50 font-medium text-sm transition"
            onClick={() => router.push(`/eventPage/67fe5ad5bf702d3cf2323cba`)}
          >
            Xem
          </button>
          {isRegistered ? (
            <button
              className="w-[90px] h-[34px] rounded-md border border-blue-500 text-blue-700 bg-white hover:bg-blue-50 font-medium text-sm transition"
              onClick={handleJoinContest}
            >
              Tham gia
            </button>
          ) : (
            <button
              className="w-[90px] h-[34px] rounded-md border border-green-500 text-green-700 bg-white hover:bg-green-50 font-medium text-sm transition"
              onClick={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? "Đang ký..." : "Đăng ký"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContestCard;