const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
  try {
    const problems = await database.problem.createMany({
      data: [
        // ... (3 bài cũ bạn đã có)

        {
          title: "Đảo ngược số nguyên",
          difficulty: "Easy",
          category: "Math",
          language: 1,
          problemStatement:
            "Cho một số nguyên x, hãy trả về số nguyên đó sau khi đảo ngược chữ số. Nếu số bị đảo vượt quá phạm vi của số nguyên 32-bit có dấu, trả về 0.",
          examples: [
            { input: "x = 123", output: "321" },
            { input: "x = -123", output: "-321" },
            { input: "x = 120", output: "21" },
          ],
          constraints: "-2^31 <= x <= 2^31 - 1",
          metadata: {
            params: [
              { name: "x", type: "number", description: "Số nguyên đầu vào" },
            ],
            return: { type: "number", description: "Số sau khi đảo ngược" },
          },
          codeTemplate: {
            javascript: `var reverse = function(x) {
    
};`,
            python: `def reverse(x: int) -> int:
    `,
            cpp: `class Solution {
public:
    int reverse(int x) {
        
    }
};`,
            java: `class Solution {
    public int reverse(int x) {
        
    }
}`,
          },
          functionName: "reverse",
        },
        {
          title: "Tổng hai số",
          difficulty: "Easy",
          category: "Linked List",
          language: 1,
          problemStatement:
            "Bạn được cung cấp hai số nguyên không âm dưới dạng hai danh sách liên kết, mỗi node chứa một chữ số. Các chữ số được lưu theo thứ tự ngược lại. Hãy trả về tổng của hai số dưới dạng danh sách liên kết.",
          examples: [{ input: "[2,4,3] + [5,6,4]", output: "[7,0,8]" }],
          constraints: "1 <= độ dài danh sách <= 100",
          metadata: {
            params: [
              {
                name: "l1",
                type: "ListNode",
                description: "Danh sách liên kết thứ nhất",
              },
              {
                name: "l2",
                type: "ListNode",
                description: "Danh sách liên kết thứ hai",
              },
            ],
            return: {
              type: "ListNode",
              description: "Danh sách liên kết biểu diễn tổng",
            },
          },
          codeTemplate: {
            javascript: `var addTwoNumbers = function(l1, l2) {
    
};`,
            python: `def addTwoNumbers(l1: ListNode, l2: ListNode) -> ListNode:
    `,
            cpp: `class Solution {
public:
    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
        
    }
};`,
            java: `class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        
    }
}`,
          },
          functionName: "addTwoNumbers",
        },
        {
          title: "Chuỗi con chung dài nhất",
          difficulty: "Medium",
          category: "Dynamic Programming",
          language: 1,
          problemStatement:
            "Cho hai chuỗi văn bản text1 và text2, hãy trả về độ dài của chuỗi con chung dài nhất giữa chúng.",
          examples: [
            { input: '"abcde", "ace"', output: "3" },
            { input: '"abc", "abc"', output: "3" },
            { input: '"abc", "def"', output: "0" },
          ],
          constraints: "1 <= text1.length, text2.length <= 1000",
          metadata: {
            params: [
              { name: "text1", type: "string", description: "Chuỗi thứ nhất" },
              { name: "text2", type: "string", description: "Chuỗi thứ hai" },
            ],
            return: {
              type: "number",
              description: "Độ dài chuỗi con chung dài nhất",
            },
          },
          codeTemplate: {
            javascript: `var longestCommonSubsequence = function(text1, text2) {
    
};`,
            python: `def longestCommonSubsequence(text1: str, text2: str) -> int:
    `,
            cpp: `class Solution {
public:
    int longestCommonSubsequence(string text1, string text2) {
        
    }
};`,
            java: `class Solution {
    public int longestCommonSubsequence(String text1, String text2) {
        
    }
}`,
          },
          functionName: "longestCommonSubsequence",
        },
      ],
    });

    console.log("Problems added successfully:", problems);
  } catch (error) {
    console.log("Error seeding problems", error);
  } finally {
    await database.$disconnect();
  }
}

main();
