const { PrismaClient } = require("@prisma/client");
const database = new PrismaClient();

async function main() {
  try {
    const testCases = await database.testCase.createMany({
      data: [
        // Test cases cho bài Đảo ngược số nguyên
        {
          problemId: "67f6318a2e6a2ca48791ac0a",
          input: { x: 123 },
          expected: "321",
          isHidden: false,
        },
        {
          problemId: "67f6318a2e6a2ca48791ac0a",
          input: { x: -123 },
          expected: "-321",
          isHidden: false,
        },
        {
          problemId: "67f6318a2e6a2ca48791ac0a",
          input: { x: 120 },
          expected: "21",
          isHidden: false,
        },
        {
          problemId: "67f6318a2e6a2ca48791ac0a",
          input: { x: 1534236469 },
          expected: "0",
          isHidden: true,
        },
        {
          problemId: "67f6318a2e6a2ca48791ac0a",
          input: { x: -2147483648 },
          expected: "0",
          isHidden: true,
        },

        // Test cases cho bài Tổng hai số (Linked List)
        {
          problemId: "67f6318a2e6a2ca48791ac0b",
          input: { l1: [2,4,3], l2: [5,6,4] },
          expected: "[7,0,8]",
          isHidden: false,
        },
        {
          problemId: "67f6318a2e6a2ca48791ac0b",
          input: { l1: [0], l2: [0] },
          expected: "[0]",
          isHidden: false,
        },
        {
          problemId: "67f6318a2e6a2ca48791ac0b",
          input: { l1: [9,9,9,9,9,9,9], l2: [9,9,9,9] },
          expected: "[8,9,9,9,0,0,0,1]",
          isHidden: false,
        },
        {
          problemId: "67f6318a2e6a2ca48791ac0b",
          input: { l1: [5], l2: [5] },
          expected: "[0,1]",
          isHidden: true,
        },
        {
          problemId: "67f6318a2e6a2ca48791ac0b",
          input: { l1: [1,8], l2: [0] },
          expected: "[1,8]",
          isHidden: true,
        },

        // Test cases cho bài Chuỗi con chung dài nhất
        {
          problemId: "67f6318a2e6a2ca48791ac0c",
          input: { text1: "abcde", text2: "ace" },
          expected: "3",
          isHidden: false,
        },
        {
          problemId: "67f6318a2e6a2ca48791ac0c",
          input: { text1: "abc", text2: "abc" },
          expected: "3",
          isHidden: false,
        },
        {
          problemId: "67f6318a2e6a2ca48791ac0c",
          input: { text1: "abc", text2: "def" },
          expected: "0",
          isHidden: false,
        },
        {
          problemId: "67f6318a2e6a2ca48791ac0c",
          input: { text1: "abcdef", text2: "fbdamnce" },
          expected: "3",
          isHidden: true,
        },
        {
          problemId: "67f6318a2e6a2ca48791ac0c",
          input: { text1: "a", text2: "a" },
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
