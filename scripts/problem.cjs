const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
  try {
    const problems = await database.problem.createMany({
      data: [
        {
          title: "Two Sum",
          difficulty: "Easy",
          category: "Array",
          language: 1,
          problemStatement: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
          examples: [
            { input: "[2,7,11,15], target = 9", output: "[0,1]" },
            { input: "[3,2,4], target = 6", output: "[1,2]" }
          ],
          constraints: "2 <= nums.length <= 10^4",
          metadata: {
            params: [
              { name: "nums", type: "number[]", description: "Array of integers" },
              { name: "target", type: "number", description: "Target sum" }
            ],
            return: {
              type: "number[]",
              description: "Indices of the two numbers"
            }
          },
          codeTemplate: {
            javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    
};`,
            python: `def twoSum(nums: List[int], target: int) -> List[int]:
    `,
            cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        
    }
};`,
            java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        
    }
}`
          },
          functionName: "twoSum"
        },
        {
          title: "Palindrome Number",
          difficulty: "Easy",
          category: "Math",
          language: 1,
          problemStatement: "Given an integer x, return true if x is a palindrome, and false otherwise.",
          examples: [
            { input: "121", output: "true" },
            { input: "-121", output: "false" }
          ],
          constraints: "-2^31 <= x <= 2^31 - 1",
          metadata: {
            params: [
              { name: "x", type: "number", description: "Input integer" }
            ],
            return: {
              type: "boolean",
              description: "True if x is palindrome, false otherwise"
            }
          },
          codeTemplate: {
            javascript: `/**
 * @param {number} x
 * @return {boolean}
 */
var isPalindrome = function(x) {
    
};`,
            python: `def isPalindrome(x: int) -> bool:
    `,
            cpp: `class Solution {
public:
    bool isPalindrome(int x) {
        
    }
};`,
            java: `class Solution {
    public boolean isPalindrome(int x) {
        
    }
}`
          },
          functionName: "isPalindrome"
        },
        {
          title: "Longest Substring Without Repeating Characters",
          difficulty: "Medium",
          category: "String",
          language: 1,
          problemStatement: "Given a string s, find the length of the longest substring without repeating characters.",
          examples: [
            { input: '"abcabcbb"', output: "3" },
            { input: '"bbbbb"', output: "1" }
          ],
          constraints: "0 <= s.length <= 5 * 10^4",
          metadata: {
            params: [
              { name: "s", type: "string", description: "Input string" }
            ],
            return: {
              type: "number",
              description: "Length of longest substring without repeating characters"
            }
          },
          codeTemplate: {
            javascript: `/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function(s) {
    
};`,
            python: `def lengthOfLongestSubstring(s: str) -> int:
    `,
            cpp: `class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        
    }
};`,
            java: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        
    }
}`
          },
          functionName: "lengthOfLongestSubstring"
        }
      ]
    });

    console.log("Problems added successfully:", problems);
  } catch (error) {
    console.log("Error seeding problems", error);
  } finally {
    await database.$disconnect();
  }
}

main();
