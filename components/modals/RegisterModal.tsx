"use client";

import { useState } from "react";
import axios from "axios";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import useRegisterModal from "@/hooks/useRegisterModal";
import Modal from "./Modal";
import Heading from "../ui/Heading";
import Input from "./Input";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react"; // Nếu dùng NextAuth

const RegisterModal = () => {
  const router = useRouter();
  const registerModal = useRegisterModal();
  const { data: session } = useSession(); // Lấy session từ NextAuth
  const email = session?.user?.email || ""; // Lấy email từ session
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      masv: "",
      name: "",
      class: "",
      department: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (!email) {
      toast.error("Bạn cần đăng nhập để cập nhật thông tin!");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    axios
      .put(`/api/register/create`, { ...data, email }) // Gửi email cùng dữ liệu
      .then(() => {
        toast.success("Cập nhật thông tin thành công!");
        router.refresh();
        reset();
        registerModal.onClose();
      })
      .catch((error) => {
        console.error("Error from server:", error.response?.data); // Log lỗi
        toast.error("Cập nhật thất bại.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading
        title="Bổ sung thông tin"
        subtitle="Cập nhật thông tin cá nhân của bạn tại đây!"
      />
      <Input
        id="masv"
        label="Mã sinh viên"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="name"
        label="Tên sinh viên"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="class"
        label="Lớp"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="department"
        label="Khoa"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
    </div>
  );

  const footerContent = <></>;
  return (
    <Modal
      disabled={isLoading}
      isOpen={registerModal.isOpen}
      title="Bổ sung thông tin"
      actionLabel="Cập nhật"
      onClose={registerModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default RegisterModal;