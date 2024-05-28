import assert from "assert";
import { Problem } from "../types/problem";
import toast from "react-hot-toast";
const starterCodeTwoSum = `function twoSum(nums,target){
  // Viết code của bạn ở đây
};`;

// checks if the user has the correct code
const handlerTwoSum = (fn: any) => {
	// fn is the callback that user's code is passed into
	try {
		const nums = [
			[3, 3],
			[11,2, 7, 15],
			[3, 2, 4],
			
		];

		const targets = [6,9, 6];
		const answers = [
			[0, 1],
			[1, 2],
			[1, 2],
			
		];

		// // loop all tests to check if the user's code is correct
		// for (let i = 0; i < nums.length; i++) {
		// 	// result is the output of the user's function and answer is the expected output
		// 	const result = fn(nums[i], targets[i]);
		// 	assert.deepStrictEqual(result, answers[i]);
		// }
		// return true;
		let score = 0;

        // loop all tests to check if the user's code is correct
        for (let i = 0; i < nums.length; i++) {
            // result is the output of the user's function and answer is the expected output
            try {
                // result is the output of the user's function and answer is the expected output
                const result = fn(nums[i], targets[i]);
                assert.deepStrictEqual(result, answers[i]);
                score += 3; // add 3 points for each correct answer
			}catch (error: any) {
				console.log("Lỗi testcase thứ: ", i + 1, error.message);
			}
        }

        if (score === 9) {
            score = 10; // if all test cases are correct, set score to 10
        }

        return score;
	} catch (error: any) {
		toast.error("Có một lỗi xảy ra: ");
		throw new Error(error);
	}
};

export const twoSum: Problem = {
	id: "two-sum",
	title: "1. Hai tổng",
	problemStatement: `<p class='mt-3'>
	Cho một mảng các số nguyên numsvà một số nguyên target, trả về chỉ số của hai số sao cho tổng của chúng bằng target .
</p>
<p class='mt-3'>
Bạn có thể giả định rằng mỗi đầu vào sẽ có chính xác một giải pháp và bạn không được sử dụng cùng một phần tử hai lần.
</p>
<p class='mt-3'>Bạn có thể trả lời câu trả lời theo bất kỳ thứ tự nào.</p>`,
	examples: [
		{
			id: 1,
			inputText: "nums = [2,7,11,15], Trả về = 9",
			outputText: "[0,1]",
			explanation: "Vì nums[0] + nums[1] == 9, nên ta trả về [0, 1].",
		},
		{
			id: 2,
			inputText: "nums = [3,2,4], Trả về = 6",
			outputText: "[1,2]",
			explanation: "Vì nums[1] + nums[2] == 6, nên ta trả về [1, 2].",
		},
		{
			id: 3,
			inputText: " nums = [3,3], Trả về = 6",
			outputText: "[0,1]",
		},
	],
	constraints: `<li class='mt-2'>
  <code>2 ≤ nums.length ≤ 10</code>
</li> <li class='mt-2'>
<code>-10 ≤ nums[i] ≤ 10</code>
</li> <li class='mt-2'>
<code>-10 ≤ target ≤ 10</code>
</li>
<li class='mt-2 text-sm'>
<strong>Chỉ có một câu trả lời hợp lệ tồn tại.</strong>
</li>`,
	handlerFunction: handlerTwoSum,
	starterCode: starterCodeTwoSum,
	order: 1,
	starterFunctionName: "function twoSum(",
};