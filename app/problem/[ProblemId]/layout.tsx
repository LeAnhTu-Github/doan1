import { Navbar } from "@/app/(dashboard)/_components/navbar";
import { Sidebar } from "@/app/(dashboard)/_components/sidebar";
import { clerkClient, currentUser } from "@clerk/nextjs";
const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-56 fixed inset-y-0 w-full z-20">
        <Navbar />
      </div>
      {/* <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-20">
        <Sidebar />
      </div> */}
      <main className="pt-[80px] h-full">{children}</main>
    </div>
  );
};

export default DashboardLayout;
