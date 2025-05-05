"use client";
import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { FieldValues, set, SubmitHandler, useForm } from "react-hook-form";
import { IconBadge } from "@/components/icon-badge";
import { formatPrice } from "@/lib/format";
import { CourseProgress } from "@/components/course-progress";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { User } from "@prisma/client";
import { courseRegister } from "@prisma/client";

interface CourseCardProps {
  user: User;
  regis: courseRegister | undefined;
  id: string;
  title: string;
  imageUrl: string;
  chaptersLength: number;
  price: number;
  progress: number | null;
  category: string;
}

// Mapping category English -> Vietnamese
const categoryViMap: Record<string, string> = {
  "Music": "Âm nhạc",
  "Photography": "Nhiếp ảnh",
  "Fitness": "Thể thao",
  "Accounting": "Kế toán",
  "Computer Science": "Tin học",
  "Filming": "Điện ảnh",
  "Engineering": "Kỹ thuật",
  // Thêm các category khác nếu có
};

export const CourseCard = ({
  user,
  regis,
  id,
  title,
  imageUrl,
  chaptersLength,
  progress,
  category,
}: CourseCardProps) => {
  const router = useRouter();
  const {
    register,
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      courseId: "",
      userId: "",
      masv: "",
      name: "",
      email: "",
      class: "",
    },
  });

  // Lấy tên tiếng Việt cho category
  const categoryVi = categoryViMap[category] || category;

  // Kiểm tra đã đăng ký thành công
  const isRegistered = !!regis?.isRegister;

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    data.courseId = id;
    data.userId = user?.id;
    data.masv = user?.masv;
    data.name = user?.name;
    data.email = user?.email;
    data.class = user?.class;
    axios
      .post(`/api/courseRegis`, data)
      .then(() => {
        toast.success("Đăng kí khoá học thành công!");
        router.refresh();
        router.push(`/courses/${id}`);
        reset();
      })
      .catch(() => {
        toast.error("Đăng kí thất bại.");
      });
  };

  // Xử lý khi bấm "Xem"
  const handleView = () => {
    if (!isRegistered) {
      toast.error("Bạn cần đăng ký khoá học để có thể tham gia");
      return;
    }
    router.push(`/courses/${id}`);
  };

  return (
    <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
      <div className="relative w-full aspect-video rounded-md overflow-hidden">
        <Image fill className="object-cover" alt={title} src={imageUrl} />
      </div>
      <div className="flex flex-col pt-2">
        <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
          {title}
        </div>
        <p className="text-xs text-muted-foreground">{categoryVi}</p>
        <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
          <div className="flex items-center gap-x-1 text-slate-500">
            <IconBadge size="sm" icon={BookOpen} />
            <span>
              {chaptersLength} {chaptersLength === 1 ? "Bài" : "Chương"}
            </span>
          </div>
        </div>
        {progress !== null && isRegistered ? (
          <>
            <CourseProgress
              variant={progress === 100 ? "success" : "default"}
              size="sm"
              value={progress}
            />
            <div className="flex justify-between mt-2">
              <button
                className="btn btn-outline btn-info btn-sm"
                onClick={handleView}
              >
                Tham gia
              </button>
            </div>
          </>
        ) : (
          <div className="flex justify-between">
            <button
              className="btn btn-outline btn-success btn-sm"
              onClick={handleSubmit(onSubmit)}
            >
              Đăng kí
            </button>
            <button
              className="btn btn-outline btn-info btn-sm"
              onClick={handleView}
            >
              Xem
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
