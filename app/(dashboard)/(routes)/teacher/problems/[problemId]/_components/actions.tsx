"use client";

import axios from "axios";
import { Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirm-modal";

interface ActionsProps {
  disabled: boolean;
  problemId: string;
  isPublished: boolean;
}

export const Actions = ({
  disabled,
  problemId,
  isPublished
}: ActionsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      if (isPublished) {
        await axios.patch(`/api/problems/${problemId}/unpublish`);
        toast.success("Bài tập đã được ẩn");
      } else {
        await axios.patch(`/api/problems/${problemId}/publish`);
        toast.success("Bài tập đã được xuất bản");
      }

      router.refresh();
    } catch {
      toast.error("Đã xảy ra lỗi");
    } finally {
      setIsLoading(false);
    }
  }

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/problems/${problemId}`);
      toast.success("Bài tập đã được xóa");
      router.refresh();
      router.push(`/teacher/problems`);
    } catch {
      toast.error("Đã xảy ra lỗi");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        variant="outline"
        size="sm"
      >
        {isPublished ? "Ẩn" : "Xuất bản"}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button size="sm" disabled={isLoading}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  )
} 