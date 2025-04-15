"use client";

import { Button, Card, message } from 'antd';
import Image from 'next/image';
import { Contest } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';


// Định nghĩa interface cho props


interface ContestCardProps {
  contest: Contest;
  isRegistered?: boolean;
  userId?: string;
}

const ContestCard = ({ contest, isRegistered: initialIsRegistered = false, userId }: ContestCardProps) => {
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
      setIsRegistered(true); // Cập nhật state local
    } catch (error) {
      message.error('Có lỗi xảy ra khi đăng ký');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinContest = () => {
    router.push(`/contests/${contest.id}`);
  };

  const buttonStyle = {
    backgroundColor: "#1677ff",
    borderColor: "#1677ff",
    color: "#fff",
  };

  return (
    <Card
      hoverable
      style={{ width: 300 }}
      cover={
        <Image
          src={contest.imageUrl || '/default-contest-image.jpg'}
          alt={contest.title}
          width={300}
          height={200}
          style={{ objectFit: 'cover' }}
        />
      }
    >
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
          {contest.title}
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          {isRegistered ? (
            <Button 
              size="middle" 
              style={buttonStyle}
              onClick={handleJoinContest}
            >
              Tham gia
            </Button>
          ) : (
            <>
              <Button
                size="middle"
                style={buttonStyle}
                onClick={handleRegister}
                loading={isLoading}
              >
                Đăng ký
              </Button>
            </>
          )}
          <Button 
            size="middle"
            onClick={() => router.push(`/contests/${contest.id}/details`)}
          >
            Xem thêm
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ContestCard;