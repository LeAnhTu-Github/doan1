const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
  try {
    await database.problem.createMany({
      data: [
        {
            id: "two-sum",
            title: "Two Sum",
            difficulty: "Easy",
            category: "Array",
            time: 30,
            order: 1,
            videoId: "8-k1C6ehKuw",
        },
        {
            id: "reverse-linked-list",
            title: "Reverse Linked List",
            difficulty: "Hard",
            category: "Linked List",
            time: 30,
            order: 2,
            videoId: "",
        },
        {
            id: "jump-game",
            title: "Jump Game",
            difficulty: "Medium",
            category: "Dynamic Programming",
            time: 30,
            order: 3,
            videoId: "",
        },
        {
            id: "valid-parentheses",
            title: "Valid Parentheses",
            difficulty: "Easy",
            category: "Stack",
            time: 30,
            order: 4,
            videoId: "xty7fr-k0TU",
        },
        {
            id: "search-a-2d-matrix",
            title: "Search a 2D Matrix",
            difficulty: "Medium",
            category: "Binary Search",
            time: 30,
            order: 5,
            videoId: "ZfFl4torNg4",
        },
        {
            id: "container-with-most-water",
            title: "Container With Most Water",
            difficulty: "Medium",
            category: "Two Pointers",
            time: 30,
            order: 6,
            videoId: "",
        },
        {
            id: "merge-intervals",
            title: "Merge Intervals",
            difficulty: "Medium",
            category: "intervals",
            time: 30,
            order: 7,
            videoId: "",
        },
        {
            id: "maximum-depth-of-binary-tree",
            title: "Maximum Depth of Binary Tree",
            difficulty: "Easy",
            category: "Tree",
            time: 30,
            order: 8,
            videoId: "4qYTqOiRMoM",
        },
        {
            id: "best-time-to-buy-and-sell-stock",
            title: "Best Time to Buy and Sell Stock",
            difficulty: "Easy",
            category: "Array",
            time: 30,
            order: 9,
            videoId: "",
        },
        {
            id: "subsets",
            title: "Subsets",
            difficulty: "Medium",
            category: "Backtracking",
            time: 30,
            order: 10,
            videoId: "",
        },
    ]
    });

    console.log("Success");
  } catch (error) {
    console.log("Error seeding the database categories", error);
  } finally {
    await database.$disconnect();
  }
}

main();