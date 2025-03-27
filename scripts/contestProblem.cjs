const { PrismaClient } = require("@prisma/client");
const database = new PrismaClient();

async function main() {
  try {
    const contestProblems = await database.contestProblem.createMany({
      data: [
        {
          contestId: "67dfd57ef1c7360a916a43b4",
          problemId: "67dfd2fe592b1de96cf7cc94", // Two Sum
        },
        {
          contestId: "67dfd57ef1c7360a916a43b4",
          problemId: "67dfd2fe592b1de96cf7cc95", // Palindrome Number
        },
        {
          contestId: "67dfd57ef1c7360a916a43b4",
          problemId: "67dfd2fe592b1de96cf7cc96", // Longest Substring
        },
      ],
    });

    console.log("Contest problems added successfully:", contestProblems);
  } catch (error) {
    console.log("Error seeding contest problems", error);
  } finally {
    await database.$disconnect();
  }
}

main();