
import ContestSection from './contestSection'
export default async function ContestPage() {
    return (
        <div className="max-w-[2520px] mx-auto">
            <div className="w-full h-auto bg-white p-7 rounded-3xl flex flex-col gap-4">
                <div className="flex gap-4 items-center">
                    <div className="w-5 h-9 rounded-md bg-[#4ebc7f]"></div>
                    <p className="text-[#06080F] text-2xl font-semibold">
                        Cuộc thi
                    </p>
                </div>
                <ContestSection />
            </div>
        </div>
    );
}