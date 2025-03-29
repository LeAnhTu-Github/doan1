import { Navbar } from "@/app/(dashboard)/_components/navbar";
const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <div className="h-[60px] fixed inset-y-0 w-full z-20 overflow-auto">
        <Navbar />
      </div>
      <main className="pt-[60px] h-full">{children}</main>
    </div>
  );
};

export default DashboardLayout;
