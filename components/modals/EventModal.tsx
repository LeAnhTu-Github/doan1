"use client";
import { useCallback, useState } from "react";
import axios from "axios";
import { FieldValues, set, SubmitHandler, useForm } from "react-hook-form";
import useEventModal from "@/hooks/useEventModal";
import Modal from "./Modal";
import Heading from "../ui/Heading";
import Input from "./Input";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
const EventModal = () => {
  const router = useRouter();
  const eventModal = useEventModal();
  const [id, setId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      question: "",
      eventId: eventModal.eventId,
    },
  });
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    setId(eventModal.eventId); // Set eventId value before submitting
    data.eventId = eventModal.eventId;
    axios
      .post(`/api/eventRegis`, data)
      .then(() => {
        toast.success("Đăng kí tham gia sự kiện thành công!");
        router.refresh();
        reset();
        eventModal.onClose();
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
        title="Bạn đang muốn tham gia sự kiện?"
        subtitle="Để lại câu hỏi cho diễn giả ở đây!"
      />
      <Input
        id="question"
        label="Câu hỏi của bạn"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
    </div>
  );

  const footerContent = <></>;
  return (
    <>
      <Modal
        disabled={isLoading}
        isOpen={eventModal.isOpen}
        title="Đăng kí sự kiện"
        actionLabel="Đăng kí"
        onClose={eventModal.onClose}
        onSubmit={handleSubmit(onSubmit)}
        body={bodyContent}
        footer={footerContent}
      />
    </>
  );
};

export default EventModal;
