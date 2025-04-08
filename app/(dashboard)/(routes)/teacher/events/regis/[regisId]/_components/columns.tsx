"use client";

import { Course } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
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
import { userRegister } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
interface DataProps {
  row: {
    original: userRegister;
  };
}
const CeilData = ({ row }: DataProps) => {
  const { id, eventId } = row.original;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const onDelete = async () => {
    try {
      setIsLoading(true);

      await axios.delete(`/api/eventRegis/${id}`);

      toast.success("Xoá sinh viên thành công");
      router.refresh();
      router.push(`/teacher/events/regis/${eventId}`);
    } catch {
      toast.error("Xoá sinh viên thất bại");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-4 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem>
          <Trash2 className="h-4 w-4 mr-2" />
          <button onClick={onDelete}>Xoá sinh viên</button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export const columns: ColumnDef<userRegister>[] = [
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
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
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
    accessorKey: "question",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Câu hỏi
        </Button>
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
          Hành động
        </Button>
      );
    },
    cell: CeilData,
  },
];
