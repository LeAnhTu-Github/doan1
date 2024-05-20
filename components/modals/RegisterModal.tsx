"use client";
import { useCallback, useState } from "react";
import axios from "axios";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import useRegisterModal from "@/hooks/useRegisterModal";
import Modal from "./Modal";
import Heading from "../ui/Heading";
import Input from "./Input";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
const RegisterModal = () => {
  const router = useRouter();
  const registerModal = useRegisterModal();
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
    setIsLoading(true);

    axios

      .post("/api/register", data)
      .then(() => {
        toast.success("Đăng kí thông tin thành công!");
        router.refresh();
        reset();
        registerModal.onClose();
      })
      .catch(() => {
        toast.error("Đăng kí thất bại.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading
        title="Chào mừng đến với Website"
        subtitle="Đăng kí thông tin của bạn tại đây!"
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
      title="Đăng kí thông tin"
      actionLabel="Đăng kí"
      onClose={registerModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default RegisterModal;
