"use client";

import { Course } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { CourseProgress } from "@/components/course-progress";
import { useRouter } from "next/navigation";
import {
  ArrowUpDown,
  MoreHorizontal,
  Pencil,
  BarChartHorizontal,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { UserProgress } from "@prisma/client";
import { courseRegister } from "@prisma/client";
import { Category } from "@prisma/client";
import { toast } from "react-hot-toast";

type CourseWithProgress = courseRegister & {
  progress: number;
};

const ActionCell = ({ row }: { row: any }) => {
  const { courseId, userId } = row.original;
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-4 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem
          onClick={async (e) => {
            e.preventDefault();
            if (!userId || !courseId) {
              toast.error("Thiếu thông tin sinh viên hoặc khoá học");
              return;
            }
            const res = await fetch(`/api/courseRegis/${userId}/${courseId}`, {
              method: "DELETE",
            });
            if (res.ok) {
              toast.success("Đã xoá sinh viên khỏi khoá học");
              router.refresh();
            } else {
              toast.error("Xoá thất bại");
            }
          }}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Xoá sinh viên
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<CourseWithProgress>[] = [

  {
    accessorKey: "masv",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Mã sinh viên
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Họ tên
        </Button>
      );
    },
  },
  {
    accessorKey: "class",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Lớp
        </Button>
      );
    },
  },
  {
    accessorKey: "progress",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tiến trình
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const progress = row.original.progress ?? 0;
      return (
        <div>
          <CourseProgress
            variant={progress === 100 ? "success" : "default"}
            size="sm"
            value={progress}
          />
          <div className="text-xs text-muted-foreground mt-1 text-right">
            {Math.round(progress)}%
          </div>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Action
        </Button>
      );
    },
    cell: (cellProps) => <ActionCell {...cellProps} />,
  },
];
