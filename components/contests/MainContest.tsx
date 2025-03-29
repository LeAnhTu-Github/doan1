"use client";
import { Button, Card } from "antd";
import Image from "next/image";
import { Contest } from "@prisma/client";
import { useRouter } from "next/navigation";
interface MainContestProps {
  contest: Contest;
}

const MainContest = ({ contest }: MainContestProps) => {
  const router = useRouter();
  return (
    <Card
      hoverable
      style={{ width: "100%", maxWidth: "100%", padding: 0 }} // Đảm bảo card full width, không padding
      bodyStyle={{ padding: 0 }} // Xóa padding mặc định của body Card
    >
      <div style={{ position: "relative" }}>
        <Image
          src={
            contest.imageUrl ||
            ""
          }
          alt={contest.title}
          width={1920} 
          height={1280} 
          quality={100}
          style={{ width: "100%", height: "600px", objectFit: "cover" }} 
        />
        
        <h2
          style={{
            position: "absolute", 
            top: "20px", 
            left: "30px",
            fontSize: "32px",
            fontWeight: "bold",
            color: "#fff", 
            textAlign: "right", 
            margin: 0, 
          }}
        >
          {contest.title}
        </h2>
        {/* Div chứa nút, giữ ở giữa */}
        <div
          style={{
            position: "absolute",
            bottom: "30px",
            width: "100%",
            textAlign: "center",
          }}
        >
          <div
            style={{ display: "flex", justifyContent: "center", gap: "16px" }}
          >
            <Button
              style={{
                width: "90px",
                height: "40px",
                backgroundColor: "#1677ff",
                borderColor: "#1677ff",
                color: "#fff",
              }}
              onClick={() => router.push(`/contests/${contest.id}`)}
            >
              Xem
            </Button>
            {contest.status === "upcoming" ? (
              <Button
                size="large"
                style={{ backgroundColor: "#fff", borderColor: "#d9d9d9" }}
              >
                Đăng ký
              </Button>
            ) : (
              <Button
                size="large"
                style={{ backgroundColor: "#fff", borderColor: "#d9d9d9" }}
                onClick={() => router.push(`/contests/${contest.id}`)}
              >
                Tham gia
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MainContest;
