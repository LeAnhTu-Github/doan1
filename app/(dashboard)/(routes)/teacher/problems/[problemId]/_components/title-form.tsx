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
    title: string | null;  // Phù hợp với schema Prisma
  } | null;
  problemId: string;
}

// Schema validation cho form
const formSchema = z.object({
  title: z.string().min(1, {
    message: "Tiêu đề là bắt buộc",
  }),
});

export const TitleForm = ({ initialData, problemId }: TitleFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",  // Xử lý null safety
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (problemId === "new") {
        const response = await axios.post("/api/problems", {
          title: values.title,
        });
        toast.success("Bài tập đã được tạo");
        router.push(`/teacher/problems/${response.data.id}`);
      } else {
        await axios.patch(`/api/problems/${problemId}`, {
          title: values.title,
        });
        toast.success("Tiêu đề đã được cập nhật");
        toggleEdit();
      }
      router.refresh();
    } catch (error) {
      toast.error("Đã xảy ra lỗi");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Tiêu đề bài tập
        {problemId !== "new" && (
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
        )}
      </div>
      {!isEditing && initialData?.title && (
        <p className="text-sm mt-2">{initialData.title}</p>
      )}
      {(isEditing || problemId === "new") && (
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
                      disabled={isSubmitting}
                      placeholder="Ví dụ: 'Tìm phần tử xuất hiện một lần'"
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
                {problemId === "new" ? "Tạo bài tập" : "Lưu thay đổi"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}; 