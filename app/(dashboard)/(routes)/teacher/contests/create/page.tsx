"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { FileUpload } from "@/components/file-upload";
import Image from "next/image";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ProblemSelect } from "./_components/problem-select";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Tiêu đề là bắt buộc",
  }),
  imageUrl: z.string().optional(),
  description: z.string().optional(),
  startTime: z.string().min(1, {
    message: "Thời gian bắt đầu là bắt buộc",
  }),
  endTime: z.string().min(1, {
    message: "Thời gian kết thúc là bắt buộc",
  }),
  status: z.enum(["upcoming", "ongoing", "ended"]).default("upcoming"),
  isPublic: z.boolean().default(false),
  joinCode: z.string().optional(),
  problemIds: z.array(z.string()).default([]),
});

const CreatePage = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      imageUrl: "",
      description: "",
      startTime: "",
      endTime: "",
      status: "upcoming",
      isPublic: false,
      joinCode: "",
      problemIds: [],
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post("/api/contests", {
        ...values,
        startTime: new Date(values.startTime).toISOString(),
        endTime: new Date(values.endTime).toISOString(),
      });
      router.push(`/teacher/contests/${response.data.id}`);
      toast.success("Cuộc thi đã được tạo thành công");
    } catch {
      toast.error("Đã xảy ra lỗi khi tạo cuộc thi");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="w-full">
        <h1 className="text-2xl font-bold mb-4">Tạo cuộc thi mới</h1>
        <p className="text-sm text-slate-600 mb-8">
          Điền thông tin chi tiết về cuộc thi của bạn. Bạn có thể thay đổi các thông tin này sau.
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu đề cuộc thi</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'Cuộc thi lập trình tuần 1'"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Tên cuộc thi sẽ hiển thị cho người tham gia
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ảnh cuộc thi</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-4">
                      {field.value ? (
                        <div className="relative aspect-video mt-2 max-h-[200px]">
                          <Image
                            alt="Contest thumbnail"
                            fill
                            className="object-cover rounded-md"
                            src={field.value}
                          />
                          <Button
                            onClick={() => field.onChange("")}
                            variant="destructive"
                            type="button"
                            size="sm"
                            className="absolute top-2 right-2"
                          >
                            Xóa ảnh
                          </Button>
                        </div>
                      ) : (
                        <FileUpload
                          endpoint="courseImage"
                          onChange={(url) => {
                            if (url) {
                              field.onChange(url);
                            }
                          }}
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Tải lên ảnh đại diện cho cuộc thi (tỷ lệ khuyến nghị 16:9)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={isSubmitting}
                      placeholder="Mô tả chi tiết về cuộc thi..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Cung cấp thông tin chi tiết về cuộc thi
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thời gian bắt đầu</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thời gian kết thúc</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trạng thái</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="upcoming">Sắp diễn ra</SelectItem>
                      <SelectItem value="ongoing">Đang diễn ra</SelectItem>
                      <SelectItem value="ended">Đã kết thúc</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Cuộc thi công khai
                    </FormLabel>
                    <FormDescription>
                      Cho phép tất cả người dùng tham gia cuộc thi
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="joinCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã tham gia</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'CONTEST-2024'"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Mã này sẽ được sử dụng để người tham gia đăng ký vào cuộc thi
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="problemIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bài tập</FormLabel>
                  <FormControl>
                    <ProblemSelect
                      disabled={isSubmitting}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    Chọn các bài tập cho cuộc thi
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2">
              <Link href="/teacher/contests">
                <Button type="button" variant="ghost">
                  Hủy
                </Button>
              </Link>
              <Button type="submit" disabled={!isValid || isSubmitting}>
                Tiếp tục
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreatePage; 