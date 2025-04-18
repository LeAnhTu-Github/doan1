// app/(dashboard)/(routes)/teacher/problems/_components/create-problem-button.tsx
'use client';

import axios from "axios";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export const CreateProblemButton = () => {
  const router = useRouter();

  const onCreate = async () => {
    try {
      const response = await axios.post("/api/problems");
      router.push(`/teacher/problems/${response.data.id}`);
      toast.success("Đã tạo bài tập mới");
    } catch {
      toast.error("Đã xảy ra lỗi");
    }
  };

  return (
    <Button onClick={onCreate}>
      <Plus className="h-4 w-4 mr-2" />
      Tạo bài tập mới
    </Button>
  );
};