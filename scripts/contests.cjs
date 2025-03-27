const { PrismaClient } = require("@prisma/client");
const database = new PrismaClient();

async function main() {
  try {
    const contests = await database.contest.createMany({
      data: [
        {
          title: "Weekly Coding Challenge #1",
          description: "A weekly contest to test your coding skills",
          startTime: new Date("2025-04-01T09:00:00Z"),
          endTime: new Date("2025-04-01T12:00:00Z"),
          joinCode: "WCC1-2025",
          isPublic: true,
          status: "upcoming",
        },
        {
          title: "Algorithm Mastery Contest",
          description: "Advanced algorithm problems",
          startTime: new Date("2025-04-15T10:00:00Z"),
          endTime: new Date("2025-04-15T14:00:00Z"),
          joinCode: "AMC-2025",
          isPublic: false,
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