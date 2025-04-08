"use client";

import { Course } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { CourseProgress } from "@/components/course-progress";

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
type CourseWithProgressWithCategory = {
  courseRegister: courseRegister;
  progress: number | null;
  userProgress: UserProgress;
};
export const columns: ColumnDef<CourseWithProgressWithCategory>[] = [
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
      const progress = row.original.progress || 0;
      return (
        <CourseProgress
          variant={progress === 100 ? "success" : "default"}
          size="sm"
          value={progress}
        />
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
    cell: ({ row }) => {
      const id = row.original.courseRegister?.userId;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-4 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <Link href={`/teacher/events/${id}`}>
              <DropdownMenuItem>
                <Trash2 className="h-4 w-4 mr-2" />
                Xoá sinh viên
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
