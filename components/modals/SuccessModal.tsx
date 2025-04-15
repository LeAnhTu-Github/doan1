import React from 'react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  score: number;
  totalScore: number;
  solvedCount?: number; // optional cho practice mode
}

const SuccessModal = ({ isOpen, onClose, score, totalScore, solvedCount }: SuccessModalProps) => {
  if (!isOpen) return null;

  const isFailure = score === 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-dark-layer-1 rounded-lg p-8 max-w-md w-full mx-4 relative">
        <div className="text-center">
          {/* Icon thay đổi theo điểm */}
          <div className="mb-4">
            {isFailure ? (
              <svg
                className="mx-auto h-16 w-16 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            ) : (
              <svg
                className="mx-auto h-16 w-16 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
          </div>

          {/* Tiêu đề thay đổi theo điểm */}
          <h3 className={`text-2xl font-bold text-white mb-4 ${isFailure ? 'text-red-500' : 'text-green-500'}`}>
            {isFailure ? 'Cần cải thiện!' : 'Chúc mừng!'}
          </h3>

          {/* Nội dung thay đổi theo điểm */}
          <div className="text-gray-300 mb-6">
            <p className="text-lg mb-2">
              {isFailure 
                ? 'Bài làm của bạn chưa đạt. Hãy xem lại và thử lại nhé!' 
                : 'Bạn đã hoàn thành bài tập!'}
            </p>
            <p className={`text-xl font-semibold ${isFailure ? 'text-red-500' : 'text-green-500'}`}>
              Điểm số: {score}/{totalScore}
            </p>
            {solvedCount !== undefined && (
              <p className="text-sm mt-2 text-gray-400">
                Số bài đã giải: {solvedCount}
              </p>
            )}
          </div>

          {/* Nút đóng thay đổi màu theo điểm */}
          <button
            onClick={onClose}
            className={`${
              isFailure 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-green-500 hover:bg-green-600'
            } text-white font-bold py-2 px-6 rounded-lg transition-colors`}
          >
            {isFailure ? 'Thử lại' : 'Đóng'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;