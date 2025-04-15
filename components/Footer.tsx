import React from "react";
import Link from "next/link";
import { Github, Twitter, Linkedin, Mail, Code2, Brain, Cpu, Network, BookOpen, Users } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-slate-900 to-slate-800 text-slate-200">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Code2 className="h-6 w-6 text-blue-400" />
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                IT-Elearning
              </h3>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Nền tảng học tập thuật toán hàng đầu, giúp bạn nâng cao kỹ năng lập trình và tư duy giải quyết vấn đề.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Resources Section */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-blue-400" />
              Tài Nguyên
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/algorithms" className="hover:text-blue-400 transition-colors flex items-center">
                  <Brain className="h-4 w-4 mr-2" />
                  Thư Viện Thuật Toán
                </Link>
              </li>
              <li>
                <Link href="/problems" className="hover:text-blue-400 transition-colors flex items-center">
                  <Cpu className="h-4 w-4 mr-2" />
                  Bài Tập Luyện Tập
                </Link>
              </li>
              <li>
                <Link href="/contests" className="hover:text-blue-400 transition-colors flex items-center">
                  <Network className="h-4 w-4 mr-2" />
                  Cuộc Thi
                </Link>
              </li>
            </ul>
          </div>

          {/* Community Section */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-400" />
              Cộng Đồng
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/forum" className="hover:text-blue-400 transition-colors">
                  Diễn Đàn Thảo Luận
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-blue-400 transition-colors">
                  Blog Kỹ Thuật
                </Link>
              </li>
              <li>
                <Link href="/contribute" className="hover:text-blue-400 transition-colors">
                  Đóng Góp Bài Giải
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Đăng Ký Nhận Tin</h4>
            <p className="text-sm text-slate-400">
              Nhận thông báo về các cuộc thi và bài tập mới nhất.
            </p>
            <form className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Email của bạn"
                className="px-4 py-2 bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors text-sm font-medium"
              >
                Đăng Ký
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-slate-400">
              © {new Date().getFullYear()} AlgoLearn. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm text-slate-400">
              <Link href="/privacy" className="hover:text-blue-400 transition-colors">
                Chính Sách Bảo Mật
              </Link>
              <Link href="/terms" className="hover:text-blue-400 transition-colors">
                Điều Khoản Sử Dụng
              </Link>
              <Link href="/contact" className="hover:text-blue-400 transition-colors">
                Liên Hệ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
