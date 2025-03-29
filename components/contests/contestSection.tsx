// components/ContestSection.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Carousel, List, Spin, Typography } from 'antd';
import ContestCard from '../ContestCard';
import MainContest from './MainContest';
import { Contest } from '@prisma/client';

const { Text } = Typography;

interface ContestWithDetails extends Contest {
  problems: any[];
  participants: any[];
  submissions: any[];
}

const ContestSection = () => {
  const [contests, setContests] = useState<ContestWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef<any>(null); // Sử dụng useRef thay vì useState

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

  // Hàm xử lý khi click vào item trong list
  const handleContestClick = (index: number) => {
    if (carouselRef.current) {
      carouselRef.current.goTo(index); // Truy cập ref bằng .current
    }
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
      {/* Carousel */}
      <Carousel
        autoplay
        dots
        ref={carouselRef} // Gán ref trực tiếp
        style={{ marginBottom: '40px' }}
      >
        {contests.map((contest) => (
          <div key={contest.id}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <MainContest contest={contest} />
            </div>
          </div>
        ))}
      </Carousel>

      {/* List các contest */}
      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={contests}
        renderItem={(contest, index) => (
          <List.Item>
            <div
              style={{ cursor: 'pointer' }}
              onClick={() => handleContestClick(index)}
            >
              <ContestCard contest={contest} />
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};

export default ContestSection;