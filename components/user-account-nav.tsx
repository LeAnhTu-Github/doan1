"use client";
import Avatar from "./Avatar";
import MenuItem from "./ui/MenuItem";
import { useSession, signOut, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import useRegisterModal from "@/hooks/useRegisterModal";

const UserButtonAndMenu = () => {
  const registerModal = useRegisterModal();
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user; // Lấy thông tin user từ session
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  // Hàm xử lý mở profile (giả định chuyển hướng đến trang profile)
  const handleOpenProfile = () => {
    router.push("/profile");
    toggleOpen();
  };

  // Hàm xử lý chuyển hướng đến trang cài đặt
  const handleSettings = () => {
    router.push("/settings");
    toggleOpen();
  };

  // Hàm xử lý chuyển hướng đến trang lịch sử
  const handleHistory = () => {
    router.push("/history");
    toggleOpen();
  };

  return (
    <div className="relative">
      <div className="flex flex-row items-center gap-3">
        <div
          onClick={() => router.push("/")}
          className="hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer"
        >
           {`Xin chào ${user?.name}` || "Đi tới trang chủ"}
        </div>
        <div
          onClick={toggleOpen}
          className="
            p-4 md:py-1 md:px-2 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition"
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
            absolute rounded-xl shadow-md w-[40vw] md:w-3/4 bg-white overflow-hidden right-0 top-12 text-sm z-50"
        >
          <div className="flex flex-col cursor-pointer">
            {user?.role === "MANAGER" || user?.role === "ADMIN" ? (
              <>
                <MenuItem
                  onCLick={() => {
                    router.push("/"), toggleOpen();
                  }}
                  label="Về trang chủ"
                />
                <MenuItem
                  onCLick={() => {
                    router.push("/teacher/contests"), toggleOpen();
                  }}
                  label="Quản lý chung"
                />
                {/* <MenuItem
                  onCLick={handleOpenProfile}
                  label="Xem hồ sơ"
                />
                <MenuItem
                  onCLick={handleSettings}
                  label="Cài đặt"
                />
                <MenuItem
                  onCLick={handleHistory}
                  label="Lịch sử hoạt động"
                /> */}
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
                {/* <MenuItem
                  onCLick={handleOpenProfile}
                  label="Xem hồ sơ"
                />
                <MenuItem
                  onCLick={handleSettings}
                  label="Cài đặt"
                />
                <MenuItem
                  onCLick={handleHistory}
                  label="Lịch sử hoạt động"
                /> */}
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

const UserButton = () => {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  if (!session?.user) {
    return (
      <button
        onClick={() => signIn()}
        className="text-sm font-semibold py-2 px-4 rounded-full bg-neutral-100 hover:bg-neutral-200 transition cursor-pointer"
      >
        Đăng nhập
      </button>
    );
  }

  return <UserButtonAndMenu />;
};

export default UserButton;