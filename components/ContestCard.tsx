import { Button, Card } from 'antd';
import Image from 'next/image';
import { Contest } from '@prisma/client';
// Định nghĩa interface cho props


interface ContestCardProps {
  contest: Contest;
}

const ContestCard = ({ contest }: ContestCardProps) => {
  return (
    <Card
      hoverable
      style={{ width: 300 }}
      cover={
        <Image
        src={contest.imageUrl || ''}
          alt={contest.title}
          width={300}
          height={200}
          style={{ objectFit: 'cover' }} // Thay thế className bằng style
        />
      }
    >
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
          {contest.title}
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          {
            contest.status === 'upcoming' ? (
              <Button size="middle" style={{backgroundColor: "#1677ff",
                borderColor: "#1677ff",
                color: "#fff",}}>Đăng ký</Button>
            ):(
              <Button size="middle" type="primary">Bắt đầu</Button>
            )
          }
          <Button size="middle">
            Xem thêm
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ContestCard;