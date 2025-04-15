"use client";
import { Button, Card, message } from "antd";
import Image from "next/image";
import { Contest } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EyeOutlined } from '@ant-design/icons';
interface MainContestProps {
  contest: Contest;
  isRegistered?: boolean;
  userId?: string;
}

const MainContest = ({ contest, isRegistered: initialIsRegistered = false, userId }: MainContestProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(initialIsRegistered);

  const handleRegister = async () => {
    if (!userId) {
      router.push('/login');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/contests/${contest.id}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Đăng ký thất bại');
      }

      message.success('Đăng ký thành công!');
      setIsRegistered(true);
    } catch (error) {
      message.error('Có lỗi xảy ra khi đăng ký');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinContest = () => {
    router.push(`/contests/${contest.id}`);
  };

  const primaryButtonStyle = {
    width: "90px",
    height: "40px",
    backgroundColor: "#1677ff",
    borderColor: "#1677ff",
    color: "#fff",
  };
  const viewButtonStyle = {
    width: "120px",
    height: "40px",
    backgroundColor: "#1677ff",
    borderColor: "#1677ff",
    color: "#fff",
  };

  const joinButtonStyle = {
    width: "120px",
    height: "40px",
    backgroundColor: "#fff",
    borderColor: "#d9d9d9",
    color: "#000",
  };

  return (
    <Card
      hoverable
      style={{ width: "100%", maxWidth: "100%", padding: 0 }}
      bodyStyle={{ padding: 0 }}
    >
      <div style={{ position: "relative" }}>
        <Image
          src={contest.imageUrl || "/default-contest-image.jpg"}
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

        <div
          style={{
            position: "absolute",
            bottom: "30px",
            width: "100%",
            textAlign: "center",
          }}
        >
          <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
            <Button
              style={primaryButtonStyle}
              onClick={() => router.push(`/contests/${contest.id}/details`)}
            >
              Xem thêm
            </Button>
            {isRegistered ? (
              <Button
                size="large"
                style={joinButtonStyle}
                onClick={handleJoinContest}
              >
                Tham gia
              </Button>
            ) : (
              <Button
                size="large"
                style={joinButtonStyle}
                onClick={handleRegister}
                loading={isLoading}
              >
                Đăng ký
              </Button>
              
            )}
            <Button
                size="large"
                icon={<EyeOutlined />}
                style={viewButtonStyle}
                onClick={() => router.push(`/contests/${contest.id}/view`)}
              >
                Theo dõi
              </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MainContest;
