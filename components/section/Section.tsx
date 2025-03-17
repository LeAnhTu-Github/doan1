import { currentUser } from "@clerk/nextjs";
import SectionInfo from "./SectionInfo";
import SectionBox from "./SectionBox";

const Section = async () => {
  const user = await currentUser();
  return (
    <div className="w-full h-[200px] flex gap-4">
      <SectionInfo currentUser={user} />
      <SectionBox />
    </div>
  );
};

export default Section;
