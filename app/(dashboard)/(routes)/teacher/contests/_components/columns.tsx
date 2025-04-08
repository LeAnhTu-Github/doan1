"use client";

import { Contest } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil, BarChart, Code } from "lucide-react";
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

type ContestWithCount = Contest & {
  _count: {
    participants: number;
    problems: number;
  };
};

export const columns: ColumnDef<ContestWithCount>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tên cuộc thi
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "startTime",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Thời gian bắt đầu
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const startTime = row.getValue("startTime");
      return startTime ? new Date(startTime as string).toLocaleString("vi-VN") : "Chưa có";
    }
  },
  {
    accessorKey: "endTime",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Thời gian kết thúc
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const endTime = row.getValue("endTime");
      return endTime ? new Date(endTime as string).toLocaleString("vi-VN") : "Chưa có";
    }
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Trạng thái cuộc thi
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      const statusConfig = {
        upcoming: {
          label: "Sắp diễn ra",
          className: "bg-yellow-500 hover:bg-yellow-600"
        },
        ongoing: {
          label: "Đang diễn ra",
          className: "bg-green-500 hover:bg-green-600"
        },
        ended: {
          label: "Đã kết thúc",
          className: "bg-gray-500 hover:bg-gray-600"
        }
      };

      const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.upcoming;

      return (
        <Badge className={config.className}>
          {config.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "participantCount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Số thí sinh
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const count = row.original._count.participants;
      return <div className="text-center">{count}</div>;
    }
  },
  {
    accessorKey: "problemCount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Số bài tập
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const count = row.original._count.problems;
      return <div className="text-center">{count}</div>;
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id } = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-4 w-8 p-0">
              <span className="sr-only">Mở menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
          <Link href={`/teacher/contests/${id}/dashboard`}>
              <DropdownMenuItem>
                <BarChart className="h-4 w-4 mr-2" />
                Dashboard
              </DropdownMenuItem>
            </Link>
            <Link href={`/teacher/contests/${id}/edit`}>
              <DropdownMenuItem>
                <Pencil className="h-4 w-4 mr-2" />
                Chỉnh sửa
              </DropdownMenuItem>
            </Link>
            <Link href={`/teacher/contests/${id}/participants`}>
              <DropdownMenuItem>
                <Pencil className="h-4 w-4 mr-2" />
                Danh sách thí sinh
              </DropdownMenuItem>
            </Link>
            <Link href={`/teacher/contests/${id}/submissions/coding`}>
              <DropdownMenuItem>
                <Code className="h-4 w-4 mr-2" />
                Bài nộp
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
