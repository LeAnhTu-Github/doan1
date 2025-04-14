const { PrismaClient } = require("@prisma/client");
const database = new PrismaClient();

async function main() {
  try {
    const testCases = await database.testCase.createMany({
      data: [
        {
          problemId: "67f8704977b565e1e60e56c6",
          input: { nums: [2, 2, 1] },
          expected: "1",
          isHidden: false,
        },
        {
          problemId: "67f8704977b565e1e60e56c6",
          input: { nums: [4, 1, 2, 1, 2] },
          expected: "4",
          isHidden: false,
        },
        {
          problemId: "67f8704977b565e1e60e56c6",
          input: { nums: [1] },
          expected: "1",
          isHidden: false,
        },
        {
          problemId: "67f8704977b565e1e60e56c6",
          input: { nums: [0, 1, 0] },
          expected: "1",
          isHidden: true,
        },
        {
          problemId: "67f8704977b565e1e60e56c6",
          input: { nums: [5, 3, 5, 4, 4] },
          expected: "3",
          isHidden: true,
        },

        // Problem: Tìm phần tử xuất hiện hơn n/2 lần
        {
          problemId: "67f8704977b565e1e60e56c7",
          input: { nums: [3, 2, 3] },
          expected: "3",
          isHidden: false,
        },
        {
          problemId: "67f8704977b565e1e60e56c7",
          input: { nums: [2, 2, 1, 1, 1, 2, 2] },
          expected: "2",
          isHidden: false,
        },
        {
          problemId: "67f8704977b565e1e60e56c7",
          input: { nums: [1, 1] },
          expected: "1",
          isHidden: false,
        },
        {
          problemId: "67f8704977b565e1e60e56c7",
          input: { nums: [6, 6, 6, 7, 7] },
          expected: "6",
          isHidden: true,
        },
        {
          problemId: "67f8704977b565e1e60e56c7",
          input: { nums: [9, 9, 9, 9, 3, 3, 3] },
          expected: "9",
          isHidden: true,
        },

        // Problem: Tìm phần tử đỉnh trong mảng
        {
          problemId: "67f8704977b565e1e60e56c8",
          input: { nums: [1, 2, 3, 1] },
          expected: "2",
          isHidden: false,
        },
        {
          problemId: "67f8704977b565e1e60e56c8",
          input: { nums: [1, 2, 1, 3, 5, 6, 4] },
          expected: "5",
          isHidden: false,
        },
        {
          problemId: "67f8704977b565e1e60e56c8",
          input: { nums: [1] },
          expected: "0",
          isHidden: false,
        },
        {
          problemId: "67f8704977b565e1e60e56c8",
          input: { nums: [2, 1] },
          expected: "0",
          isHidden: true,
        },
        {
          problemId: "67f8704977b565e1e60e56c8",
          input: { nums: [1, 2] },
          expected: "1",
          isHidden: true,
        },

        // Problem: Ma trận xoắn ốc
        {
          problemId: "67f8704977b565e1e60e56c9",
          input: { matrix: [[1, 2, 3], [4, 5, 6], [7, 8, 9]] },
          expected: "[1,2,3,6,9,8,7,4,5]",
          isHidden: false,
        },
        {
          problemId: "67f8704977b565e1e60e56c9",
          input: { matrix: [[1, 2], [3, 4]] },
          expected: "[1,2,4,3]",
          isHidden: false,
        },
        {
          problemId: "67f8704977b565e1e60e56c9",
          input: { matrix: [[1]] },
          expected: "[1]",
          isHidden: false,
        },
        {
          problemId: "67f8704977b565e1e60e56c9",
          input: { matrix: [[1, 2, 3, 4]] },
          expected: "[1,2,3,4]",
          isHidden: true,
        },
        {
          problemId: "67f8704977b565e1e60e56c9",
          input: { matrix: [[1], [2], [3], [4]] },
          expected: "[1,2,3,4]",
          isHidden: true,
        },

        // Problem: Sinh dãy ngoặc hợp lệ
        {
          problemId: "67f8704977b565e1e60e56ca",
          input: { n: 1 },
          expected: '["()"]',
          isHidden: false,
        },
        {
          problemId: "67f8704977b565e1e60e56ca",
          input: { n: 2 },
          expected: '["(())","()()"]',
          isHidden: false,
        },
        {
          problemId: "67f8704977b565e1e60e56ca",
          input: { n: 3 },
          expected: '["((()))","(()())","(())()","()(())","()()()"]',
          isHidden: false,
        },
        {
          problemId: "67f8704977b565e1e60e56ca",
          input: { n: 4 },
          expected: '["(((())))",...more]', // rút gọn cho ngắn
          isHidden: true,
        },
        {
          problemId: "67f8704977b565e1e60e56ca",
          input: { n: 5 },
          expected: '["((((()))))",...more]',
          isHidden: true,
        },

        // Problem: Sắp xếp mảng 0, 1, 2
        {
          problemId: "67f8704977b565e1e60e56cb",
          input: { nums: [2, 0, 2, 1, 1, 0] },
          expected: "[0,0,1,1,2,2]",
          isHidden: false,
        },
        {
          problemId: "67f8704977b565e1e60e56cb",
          input: { nums: [2, 0, 1] },
          expected: "[0,1,2]",
          isHidden: false,
        },
        {
          problemId: "67f8704977b565e1e60e56cb",
          input: { nums: [1, 2, 0] },
          expected: "[0,1,2]",
          isHidden: false,
        },
        {
          problemId: "67f8704977b565e1e60e56cb",
          input: { nums: [0, 2, 2, 1, 0, 1] },
          expected: "[0,0,1,1,2,2]",
          isHidden: true,
        },
        {
          problemId: "67f8704977b565e1e60e56cb",
          input: { nums: [2, 1, 2, 0, 0, 1] },
          expected: "[0,0,1,1,2,2]",
          isHidden: true,
        },

        // Problem: Sắp xếp ký tự theo tần suất
        {
          problemId: "67f8704977b565e1e60e56cc",
          input: { s: "tree" },
          expected: '"eert"',
          isHidden: false,
        },
        {
          problemId: "67f8704977b565e1e60e56cc",
          input: { s: "cccaaa" },
          expected: '"cccaaa"',
          isHidden: false,
        },
        {
          problemId: "67f8704977b565e1e60e56cc",
          input: { s: "Aabb" },
          expected: '"bbAa"',
          isHidden: false,
        },
        {
          problemId: "67f8704977b565e1e60e56cc",
          input: { s: "xyzxyzxyz" },
          expected: '"xxx yyy zzz" (hoặc hoán vị tần suất)',
          isHidden: true,
        },
        {
          problemId: "67f8704977b565e1e60e56cc",
          input: { s: "aaabbc" },
          expected: '"aaabbc"',
          isHidden: true,
        },
      ],
    });

    console.log("Test cases seeded successfully:", testCases);
  } catch (error) {
    console.error("Error seeding test cases", error);
  } finally {
    await database.$disconnect();
  }
}

main();
