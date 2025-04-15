"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Contest, Problem } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  ChevronsUpDown,
  Check,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileUpload } from "@/components/file-upload";
import Image from "next/image";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Tiêu đề là bắt buộc",
  }),
  imageUrl: z.string().optional(),
  description: z.string().optional(),
  startTime: z.string().min(1, {
    message: "Thời gian bắt đầu là bắt buộc",
  }),
  duration: z.number().min(1, {
    message: "Thời lượng là bắt buộc",
  }),
  status: z.enum(["upcoming", "ongoing", "ended"]),
  isPublic: z.boolean(),
  joinCode: z.string().optional(),
  problems: z.array(z.string()),
});

interface ContestFormProps {
  initialData: Contest & {
    problems?: { problemId: string }[];
  };
}

export const ContestForm = ({
  initialData
}: ContestFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [availableProblems, setAvailableProblems] = useState<Problem[]>([]);
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData.title || "",
      imageUrl: initialData.imageUrl || "",
      description: initialData.description || "",
      startTime: initialData.startTime 
        ? new Date(initialData.startTime).toLocaleString('sv-SE').slice(0, 16) 
        : "",
      duration: initialData.duration || 60,
      status: initialData.status as "upcoming" | "ongoing" | "ended",
      isPublic: initialData.isPublic,
      joinCode: initialData.joinCode || "",
      problems: initialData.problems ? initialData.problems.map(p => p.problemId) : [],
    },
  });
  useEffect(() => {
    const fetchAvailableProblems = async () => {
      try {
        const response = await fetch('/api/contests/available-problems');
        if (!response.ok) {
          throw new Error("Failed to fetch problems");
        }
        const data = await response.json();
        console.log("Available problems:", data);
        setAvailableProblems(data);
      } catch (error) {
        toast.error("Không thể tải danh sách bài tập");
      }
    };

    fetchAvailableProblems();
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      
      const startTimeUTC = new Date(values.startTime);
      
      const response = await fetch(`/api/contests/${initialData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          imageUrl: values.imageUrl,
          startTime: startTimeUTC.toISOString(),
          duration: values.duration,
          problemIds: values.problems,
        }),
      });

      if (!response.ok) {
        throw new Error("Cập nhật thất bại");
      }

      router.refresh();
      router.push(`/teacher/contests/${initialData.id}/edit`);
      toast.success("Cập nhật thành công");
    } catch (error) {
      console.error("Error updating contest:", error);
      toast.error("Đã xảy ra lỗi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tiêu đề</FormLabel>
              <FormControl>
                <Input
                  disabled={isLoading}
                  placeholder="Nhập tiêu đề cuộc thi"
                  {...field}
                />
              </FormControl>
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
                  disabled={isLoading}
                  placeholder="Nhập mô tả cuộc thi"
                  {...field}
                />
              </FormControl>
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
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thời lượng (phút)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    disabled={isLoading}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
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
                disabled={isLoading}
                onValueChange={field.onChange}
                value={field.value}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue defaultValue={field.value} placeholder="Chọn trạng thái" />
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
                  disabled={isLoading}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Công khai
                </FormLabel>
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
                  disabled={isLoading}
                  placeholder="Nhập mã tham gia"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="problems"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bài tập</FormLabel>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between"
                    >
                      {field.value?.length > 0
                        ? `Đã chọn ${field.value.length} bài tập`
                        : "Chọn bài tập"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Tìm bài tập..." />
                    <CommandEmpty>Không tìm thấy bài tập</CommandEmpty>
                    <CommandGroup>
                      {availableProblems.map((problem) => (
                        <CommandItem
                          key={problem.id}
                          onSelect={() => {
                            const currentValues = new Set(field.value);
                            if (currentValues.has(problem.id)) {
                              currentValues.delete(problem.id);
                            } else {
                              currentValues.add(problem.id);
                            }
                            field.onChange(Array.from(currentValues));
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              field.value?.includes(problem.id) 
                                ? "opacity-100" 
                                : "opacity-0"
                            )}
                          />
                          <div className="flex flex-col">
                            <span>{problem.title}</span>
                            <span className="text-sm text-muted-foreground">
                              {problem.category} • {problem.difficulty}
                            </span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center gap-x-2">
          <Button
            disabled={isLoading}
            variant="outline"
            type="button"
            onClick={() => router.back()}
          >
            Hủy
          </Button>
          <Button
            disabled={isLoading}
            type="submit"
          >
            Lưu thay đổi
          </Button>
          <Button
            disabled={isLoading}
            variant={initialData.isActive ? "destructive" : "default"}
            type="button"
            onClick={async () => {
              try {
                setIsLoading(true);
                const response = await fetch(`/api/contests/${initialData.id}`, {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    isActive: !initialData.isActive,
                  }),
                });

                if (!response.ok) throw new Error("Không thể cập nhật trạng thái");
                
                toast.success(initialData.isActive ? 
                  "Đã dừng kích hoạt cuộc thi" : 
                  "Đã kích hoạt cuộc thi"
                );
                router.refresh();
              } catch (error) {
                toast.error("Không thể cập nhật trạng thái cuộc thi");
              } finally {
                setIsLoading(false);
              }
            }}
          >
            {initialData.isActive ? "Dừng kích hoạt" : "Kích hoạt"}
          </Button>
        </div>
      </form>
    </Form>
  );
}; 