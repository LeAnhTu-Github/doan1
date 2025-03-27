const { PrismaClient } = require("@prisma/client");
const database = new PrismaClient();

async function main() {
  try {
    const testCases = await database.testCase.createMany({
      data: [
        // Test cases for Two Sum
        {
          problemId: "67e4c48ad50628d7b8f9522a",
          input: { nums: [-1,-2,-3,-4,-5], target: -8 },
          expected: "[2,4]",
          isHidden: false,
        },
        // Test case với số 0 và số trùng nhau
        {
          problemId: "67e4c48ad50628d7b8f9522a",
          input: { nums: [0,0,0,0], target: 0 },
          expected: "[0,1]",
          isHidden: false,
        },
        // Test case với mảng lớn hơn và số lớn
        {
          problemId: "67e4c48ad50628d7b8f9522a",
          input: { nums: [1,8,2,10,21,4,7,12,3], target: 24 },
          expected: "[2,4]",
          isHidden: false,
        },
        {
          problemId: "67e4c48ad50628d7b8f9522a", // You'll need to replace with actual IDs
          input: { nums: [2,7,11,15], target: 9 }, 
          expected: "[0,1]",
          isHidden: false,
        },
        {
          problemId: "67e4c48ad50628d7b8f9522a",
          input: { nums: [3,2,4], target: 6 },
          expected: "[1,2]",
          isHidden: true,
        },
        // Test cases for Palindrome Number
        {
          problemId: "67e4c48ad50628d7b8f9522b",
          input: { x: 121 },
          expected: "true",
          isHidden: false,
        },
        {
          problemId: "67e4c48ad50628d7b8f9522b",
          input: { x: -121 },
          expected: "false",
          isHidden: true,
        },
        {
          problemId: "67e4c48ad50628d7b8f9522b",
          input: { x: 0 },
          expected: "true",
          isHidden: false,
        }, 
        {
          problemId: "67e4c48ad50628d7b8f9522b",
          input: { x: 10 },
          expected: "false",
          isHidden: false,
        },
        {
          problemId: "67e4c48ad50628d7b8f9522b",
          input: { x: 12321 },
          expected: "true",
          isHidden: false,
        },
        {
          problemId: "67e4c48ad50628d7b8f9522b",
          input: { x: 1000021 },
          expected: "false",
          isHidden: true,
        },
        // Test cases for Longest Substring
        {
          problemId: "67e4c48ad50628d7b8f9522c",
          input: { s: "abcabcbb" },
          expected: "3",
          isHidden: false,
        },
        {
          problemId: "67e4c48ad50628d7b8f9522c",
          input: { s: "bbbbb" },
          expected: "1",
          isHidden: true,
        },
      ],
    });

    console.log("Test cases added successfully:", testCases);
  } catch (error) {
    console.log("Error seeding test cases", error);
  } finally {
    await database.$disconnect();
  }
}

main();