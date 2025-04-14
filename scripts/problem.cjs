const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
  try {
    const problems = await database.problem.createMany({
      data: [
        // Tiếp tục trong mảng data
        {
          title: "Tìm phần tử xuất hiện một lần",
          difficulty: "Easy",
          category: "Bit Manipulation",
          language: 1,
          problemStatement:
            "Cho một mảng số nguyên `nums` nơi mỗi phần tử xuất hiện hai lần ngoại trừ một phần tử chỉ xuất hiện một lần. Hãy tìm phần tử đó.",
          examples: [
            { input: "nums = [2,2,1]", output: "1" },
            { input: "nums = [4,1,2,1,2]", output: "4" },
          ],
          constraints: "1 <= nums.length <= 3 * 10^4",
          metadata: {
            params: [
              { name: "nums", type: "number[]", description: "Mảng số nguyên" },
            ],
            return: {
              type: "number",
              description: "Phần tử xuất hiện một lần",
            },
          },
          codeTemplate: {
            javascript: `var singleNumber = function(nums) {

};`,
            python: `def singleNumber(nums: List[int]) -> int:
    `,
            cpp: `class Solution {
public:
    int singleNumber(vector<int>& nums) {
        
    }
};`,
            java: `class Solution {
    public int singleNumber(int[] nums) {
        
    }
}`,
          },
          functionName: "singleNumber",
        },
        {
          title: "Tìm phần tử xuất hiện hơn n/2 lần",
          difficulty: "Easy",
          category: "Array",
          language: 1,
          problemStatement:
            "Cho một mảng số nguyên `nums`, hãy tìm phần tử xuất hiện nhiều hơn ⌊n / 2⌋ lần. Đảm bảo rằng luôn tồn tại phần tử như vậy.",
          examples: [{ input: "nums = [3,2,3]", output: "3" }],
          constraints: "1 <= nums.length <= 5 * 10^4",
          metadata: {
            params: [
              { name: "nums", type: "number[]", description: "Mảng số nguyên" },
            ],
            return: {
              type: "number",
              description: "Phần tử chiếm đa số",
            },
          },
          codeTemplate: {
            javascript: `var majorityElement = function(nums) {

};`,
            python: `def majorityElement(nums: List[int]) -> int:
    `,
            cpp: `class Solution {
public:
    int majorityElement(vector<int>& nums) {
        
    }
};`,
            java: `class Solution {
    public int majorityElement(int[] nums) {
        
    }
}`,
          },
          functionName: "majorityElement",
        },
        {
          title: "Tìm phần tử đỉnh trong mảng",
          difficulty: "Medium",
          category: "Binary Search",
          language: 1,
          problemStatement:
            "Một phần tử đỉnh là phần tử lớn hơn cả hai phần tử lân cận. Hãy tìm chỉ số của một phần tử đỉnh bất kỳ.",
          examples: [
            { input: "nums = [1,2,3,1]", output: "2" },
            { input: "nums = [1,2,1,3,5,6,4]", output: "5" },
          ],
          constraints: "1 <= nums.length <= 10^4",
          metadata: {
            params: [
              { name: "nums", type: "number[]", description: "Mảng số nguyên" },
            ],
            return: {
              type: "number",
              description: "Chỉ số phần tử đỉnh",
            },
          },
          codeTemplate: {
            javascript: `var findPeakElement = function(nums) {

};`,
            python: `def findPeakElement(nums: List[int]) -> int:
    `,
            cpp: `class Solution {
public:
    int findPeakElement(vector<int>& nums) {
        
    }
};`,
            java: `class Solution {
    public int findPeakElement(int[] nums) {
        
    }
}`,
          },
          functionName: "findPeakElement",
        },
        {
          title: "Ma trận xoắn ốc",
          difficulty: "Medium",
          category: "Matrix",
          language: 1,
          problemStatement:
            "Cho một ma trận 2D, hãy trả về tất cả phần tử theo thứ tự xoắn ốc.",
          examples: [
            {
              input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]",
              output: "[1,2,3,6,9,8,7,4,5]",
            },
          ],
          constraints: "1 <= m, n <= 10",
          metadata: {
            params: [
              {
                name: "matrix",
                type: "number[][]",
                description: "Ma trận đầu vào",
              },
            ],
            return: {
              type: "number[]",
              description: "Các phần tử theo thứ tự xoắn ốc",
            },
          },
          codeTemplate: {
            javascript: `var spiralOrder = function(matrix) {

};`,
            python: `def spiralOrder(matrix: List[List[int]]) -> List[int]:
    `,
            cpp: `class Solution {
public:
    vector<int> spiralOrder(vector<vector<int>>& matrix) {
        
    }
};`,
            java: `class Solution {
    public List<Integer> spiralOrder(int[][] matrix) {
        
    }
}`,
          },
          functionName: "spiralOrder",
        },
        {
          title: "Sinh dãy ngoặc hợp lệ",
          difficulty: "Medium",
          category: "Backtracking",
          language: 1,
          problemStatement:
            "Cho một số nguyên `n`, sinh ra tất cả các dãy ngoặc `n` cặp hợp lệ.",
          examples: [
            {
              input: "n = 3",
              output: '["((()))","(()())","(())()","()(())","()()()"]',
            },
          ],
          constraints: "1 <= n <= 8",
          metadata: {
            params: [
              { name: "n", type: "number", description: "Số cặp ngoặc" },
            ],
            return: {
              type: "string[]",
              description: "Danh sách chuỗi ngoặc hợp lệ",
            },
          },
          codeTemplate: {
            javascript: `var generateParenthesis = function(n) {

};`,
            python: `def generateParenthesis(n: int) -> List[str]:
    `,
            cpp: `class Solution {
public:
    vector<string> generateParenthesis(int n) {
        
    }
};`,
            java: `class Solution {
    public List<String> generateParenthesis(int n) {
        
    }
}`,
          },
          functionName: "generateParenthesis",
        },
        {
          title: "Sắp xếp mảng 0, 1, 2",
          difficulty: "Medium",
          category: "Sorting",
          language: 1,
          problemStatement:
            "Cho một mảng nums chỉ chứa 0, 1 và 2, hãy sắp xếp chúng theo thứ tự tăng dần mà không sử dụng hàm sort có sẵn.",
          examples: [
            { input: "nums = [2,0,2,1,1,0]", output: "[0,0,1,1,2,2]" },
            { input: "nums = [2,0,1]", output: "[0,1,2]" },
          ],
          constraints: "1 <= nums.length <= 300",
          metadata: {
            params: [{ name: "nums", type: "number[]", description: "Mảng đầu vào" }],
            return: {
              type: "void",
              description: "Hàm chỉnh mảng tại chỗ (in-place), không trả về",
            },
          },
          codeTemplate: {
            javascript: `var sortColors = function(nums) {
        
        };`,
            python: `def sortColors(nums: List[int]) -> None:
            `,
            cpp: `class Solution {
        public:
            void sortColors(vector<int>& nums) {
                
            }
        };`,
            java: `class Solution {
            public void sortColors(int[] nums) {
                
            }
        }`,
          },
          functionName: "sortColors",
        },
        {
          title: "Sắp xếp ký tự theo tần suất",
          difficulty: "Medium",
          category: "Sorting",
          language: 1,
          problemStatement:
            "Cho một chuỗi `s`, hãy sắp xếp lại các ký tự trong chuỗi theo tần suất giảm dần.",
          examples: [
            { input: 's = "tree"', output: '"eert"' },
            { input: 's = "cccaaa"', output: '"aaaccc" hoặc "cccaaa"' },
          ],
          constraints: "1 <= s.length <= 5 * 10^5",
          metadata: {
            params: [{ name: "s", type: "string", description: "Chuỗi đầu vào" }],
            return: {
              type: "string",
              description: "Chuỗi sau khi sắp xếp theo tần suất",
            },
          },
          codeTemplate: {
            javascript: `var frequencySort = function(s) {
        
        };`,
            python: `def frequencySort(s: str) -> str:
            `,
            cpp: `class Solution {
        public:
            string frequencySort(string s) {
                
            }
        };`,
            java: `class Solution {
            public String frequencySort(String s) {
                
            }
        }`,
          },
          functionName: "frequencySort",
        }
        
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
