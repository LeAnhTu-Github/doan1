// components/ContestSection.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Carousel, List, Spin, Typography } from 'antd';
import ContestCard from '../ContestCard';
import MainContest from './MainContest';
import { Contest } from '@prisma/client';
import { useSession } from 'next-auth/react';

const { Text } = Typography;

interface ContestWithDetails extends Contest {
  problems: any[];
  participants: {
    userId: string;
  }[];
  submissions: any[];
}

const ContestSection = () => {
  const [contests, setContests] = useState<ContestWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef<any>(null);
  const { data: session } = useSession();
  const userId = session?.user?.id;

  // Fetch contests từ API
  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await fetch('/api/contests');
        const data = await response.json();
        setContests(data.publicContests || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching contests:', error);
        setContests([]);
        setLoading(false);
      }
    };

    fetchContests();
  }, []);

  const handleContestClick = (index: number) => {
    if (carouselRef.current) {
      carouselRef.current.goTo(index);
    }
  };

  // Kiểm tra xem người dùng đã đăng ký cuộc thi chưa
  const isContestRegistered = (contest: ContestWithDetails) => {
    if (!userId) return false;
    return contest.participants.some(participant => participant.userId === userId);
  };

  if (loading) {
    return <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />;
  }

  if (contests.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <Text type="secondary" style={{ fontSize: '18px' }}>
          Hiện tại không có cuộc thi nào
        </Text>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <Carousel
        autoplay
        dots
        ref={carouselRef}
        style={{ marginBottom: '40px' }}
      >
        {contests.map((contest) => (
          <div key={contest.id}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <MainContest 
                contest={contest}
                isRegistered={isContestRegistered(contest)}
                userId={userId}
              />
            </div>
          </div>
        ))}
      </Carousel>

      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={contests}
        renderItem={(contest, index) => (
          <List.Item>
            <div
              style={{ cursor: 'pointer' }}
              onClick={() => handleContestClick(index)}
            >
              <ContestCard 
                contest={contest}
                isRegistered={isContestRegistered(contest)}
                userId={userId}
              />
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};

export default ContestSection;