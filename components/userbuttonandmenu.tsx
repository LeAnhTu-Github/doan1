"use client";
import Avatar from "./Avatar";
import MenuItem from "./ui/MenuItem";
import { useUser, useClerk, SignInButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import useRegisterModal from "@/hooks/useRegisterModal";

// Create a new UserButtonandMenu component and move the old return into this
const UserButtonAndMenu = () => {
  const registerModal = useRegisterModal();
  const { signOut, openUserProfile } = useClerk();
  const router = useRouter();
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  return (
    <div className="relative">
      <div className="flex flex-row items-center gap-3">
        <div
          onClick={() => router.push("/")}
          className="hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer"
        >
          {user?.fullName || "Đi tới trang chủ"}
        </div>
        <div
          onClick={toggleOpen}
          className="p-4
                md:py-1
                md:px-2
                border-[1px] 
                border-neutral-200 
                flex 
                flex-row 
                items-center 
                gap-3 
                rounded-full 
                cursor-pointer 
                hover:shadow-md 
                transition"
        >
          <AiOutlineMenu />
          <div className="hidden md:block">
            <Avatar src={user?.imageUrl} />
          </div>
        </div>
      </div>
      {isOpen && (
        <div
          className="
                    absolute 
                    rounded-xl 
                    shadow-md 
                    w-[40vw] 
                    md:w-3/4 
                    bg-white
                    overflow-hidden
                    right-0
                    top-12
                    text-sm 
                    z-50
                "
        >
          <div className="flex flex-col cursor-pointer ">
            {user?.id === "user_2eEWIgkJ7qW6Xwm3JdsVBp07gRI" ? (
              <>
                <MenuItem
                  onCLick={() => {
                    router.push("/"), toggleOpen();
                  }}
                  label="Về trang chủ"
                />
                <MenuItem
                  onCLick={() => {
                    router.push("/teacher/courses"), toggleOpen();
                  }}
                  label="Trang quản lý"
                />
                <MenuItem
                  onCLick={() => {
                    registerModal.onOpen(), toggleOpen();
                  }}
                  label="Thông tin cá nhân"
                />
                <hr />
                <MenuItem onCLick={() => signOut()} label="Đăng xuất" />
              </>
            ) : (
              <>
                <MenuItem
                  onCLick={() => router.push("/")}
                  label="Về trang chủ"
                />
                <MenuItem
                  onCLick={() => {
                    registerModal.onOpen(), toggleOpen();
                  }}
                  label="Thông tin cá nhân"
                />

                <hr />
                <MenuItem onCLick={() => signOut()} label="Đăng xuất" />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Refactor to show the default <SignInButton /> if the user is logged out
// Show the UserButtonAndMenu if the user is logged in
import React from "react";

const UserButton = () => {
  const { isLoaded, user } = useUser();

  if (!isLoaded) return null;

  if (!user?.id) return <SignInButton />;

  return <UserButtonAndMenu />;
};

export default UserButton;
