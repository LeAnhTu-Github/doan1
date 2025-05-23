"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Định nghĩa interface dựa trên schema Prisma
interface TitleFormProps {
  initialData: {
    title: string;
  } | null;
  problemId: string;
}

// Schema validation cho form
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

export const TitleForm = ({
  initialData,
  problemId,
}: TitleFormProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`/api/problems/${problemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      toast.success("Cập nhật thành công");
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      toast.error("Đã xảy ra lỗi");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleEdit = () => setIsEditing((current) => !current);

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Tiêu đề bài tập
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Hủy</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Chỉnh sửa tiêu đề
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p className="text-sm mt-2">
          {initialData?.title}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="e.g. Two Sum"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button
                disabled={!isValid || isSubmitting}
                type="submit"
              >
                Lưu
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}; 