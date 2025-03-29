const { PrismaClient } = require("@prisma/client");
const database = new PrismaClient();

async function main() {
  try {
    const contests = await database.contest.createMany({
      data: [
        // {
        //   title: "Weekly Coding Challenge #1",
        //   description: "A weekly contest to test your coding skills",
        //   startTime: new Date("2025-04-01T09:00:00Z"),
        //   endTime: new Date("2025-04-01T12:00:00Z"),
        //   joinCode: "WCC1-2025",
        //   isPublic: true,
        //   status: "upcoming",
        // },
        // {
        //   title: "Algorithm Mastery Contest",
        //   description: "Advanced algorithm problems",
        //   startTime: new Date("2025-04-15T10:00:00Z"),
        //   endTime: new Date("2025-04-15T14:00:00Z"),
        //   joinCode: "AMC-2025",
        //   isPublic: false,
        //   status: "upcoming",
        // },
        {
          title: "ReactJS Challenge 2025",
          description: "Thử thách xây dựng ứng dụng React với các khái niệm nâng cao như Hooks, Context API, và Performance Optimization",
          imageUrl: "https://5j0ahd1rzh.ufs.sh/f/17W55FzlJ4FK5tp6PEbIBb7T3rORWchP4CzyXmi6ZIEf0ldJ",
          startTime: new Date("2025-05-01T09:00:00Z"),
          endTime: new Date("2025-05-01T13:00:00Z"),
          joinCode: "REACT-2025",
          isPublic: true,
          status: "upcoming",
        },
      ],
    });

    console.log("Contests added successfully:", contests);
  } catch (error) {
    console.log("Error seeding contests", error);
  } finally {
    await database.$disconnect();
  }
}

main();