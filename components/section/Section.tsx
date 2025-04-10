import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SectionInfo from "./SectionInfo";
import SectionBox from "./SectionBox";

const Section = async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  return (
    <div className="w-full h-[200px] flex gap-4">
      <SectionInfo currentUser={user} />
      <SectionBox  />
    </div>
  );
};

export default Section;
