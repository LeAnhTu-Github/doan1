import { Metadata } from "next";
import Link from "next/link";
import { SignUpForm } from "@/components/auth/SignUpForm";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Đăng ký",
  description: "Tạo tài khoản mới",
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-sky-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md relative">
        {/* Decorative elements - màu xanh nhẹ nhàng hơn */}
        <div className="absolute -top-8 -left-8 w-32 h-32 bg-gradient-to-br from-sky-400 to-blue-300 rounded-full blur-2xl opacity-20" />
        <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br from-blue-400 to-cyan-300 rounded-full blur-2xl opacity-20" />
        
        {/* Main card */}
        <div className="relative backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-8">
          {/* Logo section */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-sky-500 to-blue-500 rounded-full flex items-center justify-center mb-4 overflow-hidden">
              <Image
                src="/images/logomain.png"
                alt="Logo"
                width={60}
                height={60}
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-400 to-blue-400 bg-clip-text text-transparent">
              Tạo tài khoản mới
            </h1>
            <p className="text-gray-300 mt-2 text-center">
              Tham gia cùng chúng tôi để trải nghiệm môi trường học lập trình trực tuyến hiện đại.
            </p>
          </div>

          {/* Form section */}
          <SignUpForm />

          {/* Footer links */}
          <div className="mt-8 text-center">
            <Link
              href="/sign-in"
              className="text-sm text-gray-300 hover:text-white transition-colors duration-200 flex items-center justify-center gap-2 group"
            >
              Đã có tài khoản?{" "}
              <span className="bg-gradient-to-r from-sky-400 to-blue-400 bg-clip-text text-transparent font-semibold group-hover:underline underline-offset-4">
                Đăng nhập
              </span>
              <svg
                className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 