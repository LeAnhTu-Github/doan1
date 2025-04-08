import { db } from "@/lib/db";

export const getAnalytics = async (userId: string) => {
  try {
    // Lấy tất cả các submission của user
    const submissions = await db.practiceSubmission.findMany({
      where: {
        clerkUserId: userId
      },
      include: {
        problem: true // Include thông tin về problem để group theo category nếu cần
      }
    });

    // Lấy thông tin ranking của user
    const userRanking = await db.userRanking.findUnique({
      where: {
        clerkUserId: userId
      }
    });

    // Tính toán các chỉ số
    const totalProblemsAttempted = submissions.length;
    const totalProblemsSolved = submissions.filter(sub => sub.status === 'Accepted').length;
    const averageScore = submissions.length > 0
      ? submissions.reduce((acc, curr) => acc + (curr.score || 0), 0) / submissions.length
      : 0;

    // Group submissions theo trạng thái
    const submissionsByStatus = submissions.reduce((acc, curr) => {
      const status = curr.status || 'Unknown';
      if (!acc[status]) {
        acc[status] = 0;
      }
      acc[status]++;
      return acc;
    }, {} as { [key: string]: number });

    // Chuyển đổi thành format phù hợp cho biểu đồ
    const data = Object.entries(submissionsByStatus).map(([status, count]) => ({
      name: status,
      total: count,
    }));

    return {
      data,
      totalProblemsAttempted,
      totalProblemsSolved,
      averageScore: Math.round(averageScore),
      ranking: {
        totalScore: userRanking?.totalScore || 0,
        solvedCount: userRanking?.solvedCount || 0,
      }
    };
  } catch (error) {
    console.log("[GET_ANALYTICS]", error);
    return {
      data: [],
      totalProblemsAttempted: 0,
      totalProblemsSolved: 0,
      averageScore: 0,
      ranking: {
        totalScore: 0,
        solvedCount: 0,
      }
    };
  }
}