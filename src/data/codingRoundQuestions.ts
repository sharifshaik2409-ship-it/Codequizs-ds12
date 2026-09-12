export interface TestCase {
  id: number;
  input: string;
  expectedOutput: string;
  explanation: string;
}

export interface CodingQuestion {
  id: number;
  title: string;
  category: 'Python' | 'JavaScript' | 'Data Structures' | 'Algorithms';
  difficulty: 'Easy' | 'Medium';
  tokens: number;
  description: string;
  starterCode: string;
  databaseSolution: string;
  requiredLogicPatterns: string[];
  forbiddenPatterns: string[];
  language: 'javascript' | 'python';
  testCases: TestCase[];
}

export const ROUND_3_CODING_QUESTIONS: CodingQuestion[] = [
  {
    id: 1,
    title: 'Two Sum Target Matcher',
    category: 'Algorithms',
    difficulty: 'Easy',
    tokens: 15,
    description: `Given an array of integers \`nums\` and an integer \`target\`, return the indices of the two numbers such that they add up to \`target\`.

Return the result as an array of two indices, e.g. \`[0, 1]\`.

**Submission Requirement**: When clicking **Submit & Test Solution**, your solution will only pass if both your code logic and output data match the database specifications! Hardcoded returns or empty stubs are rejected.`,
    language: 'javascript',
    // Unsolved skeleton: users cannot default pass!
    starterCode: `function twoSum(nums, target) {
  // TODO: Write your algorithmic solution here
  // Calculate indices of two numbers that add up to target
  
}`,
    databaseSolution: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) {
      return [map.get(diff), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
    requiredLogicPatterns: ['for', 'return'],
    forbiddenPatterns: ['return [0, 1]'],
    testCases: [
      {
        id: 1,
        input: 'nums = [2, 7, 11, 15], target = 9',
        expectedOutput: '[0, 1]',
        explanation: 'nums[0] + nums[1] == 2 + 7 == 9, return [0, 1]',
      },
      {
        id: 2,
        input: 'nums = [3, 2, 4], target = 6',
        expectedOutput: '[1, 2]',
        explanation: 'nums[1] + nums[2] == 2 + 4 == 6, return [1, 2]',
      },
      {
        id: 3,
        input: 'nums = [3, 3], target = 6',
        expectedOutput: '[0, 1]',
        explanation: 'nums[0] + nums[1] == 3 + 3 == 6, return [0, 1]',
      },
    ],
  },
  {
    id: 2,
    title: 'Valid Palindrome Verifier',
    category: 'Algorithms',
    difficulty: 'Easy',
    tokens: 15,
    description: `Write a function that determines if a given string is a palindrome. Consider only alphanumeric characters and ignore letter case.

Return \`true\` if it is a palindrome, otherwise return \`false\`.

**Submission Requirement**: When clicking **Submit & Test Solution**, the database checks that your output matches all test cases and your code logic implements string normalization / reversal / two-pointer verification.`,
    language: 'javascript',
    starterCode: `function isPalindrome(s) {
  // TODO: Write your solution here
  // Clean non-alphanumeric characters, ignore case, and check palindrome
  
}`,
    databaseSolution: `function isPalindrome(s) {
  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  const reversed = clean.split('').reverse().join('');
  return clean === reversed;
}`,
    requiredLogicPatterns: ['return', 'toLowerCase'],
    forbiddenPatterns: ['return true', 'return false'],
    testCases: [
      {
        id: 1,
        input: 's = "racecar"',
        expectedOutput: 'true',
        explanation: '"racecar" spelled backward is "racecar".',
      },
      {
        id: 2,
        input: 's = "A man, a plan, a canal: Panama"',
        expectedOutput: 'true',
        explanation: '"amanaplanacanalpanama" is a palindrome.',
      },
      {
        id: 3,
        input: 's = "race a car"',
        expectedOutput: 'false',
        explanation: '"raceacar" is not a palindrome.',
      },
    ],
  },
  {
    id: 3,
    title: 'FizzBuzz Classifier',
    category: 'Algorithms',
    difficulty: 'Easy',
    tokens: 10,
    description: `Given an integer \`n\`, return:
- \`"FizzBuzz"\` if \`n\` is divisible by both 3 and 5.
- \`"Fizz"\` if \`n\` is divisible by 3.
- \`"Buzz"\` if \`n\` is divisible by 5.
- \`"\${n}"\` as a string if none of the above conditions are true.

**Submission Requirement**: When clicking **Submit & Test Solution**, your output and logic conditions must match the database specification.`,
    language: 'javascript',
    starterCode: `function fizzBuzz(n) {
  // TODO: Write your FizzBuzz logic here
  
}`,
    databaseSolution: `function fizzBuzz(n) {
  if (n % 15 === 0) return "FizzBuzz";
  if (n % 3 === 0) return "Fizz";
  if (n % 5 === 0) return "Buzz";
  return String(n);
}`,
    requiredLogicPatterns: ['%', 'Fizz', 'Buzz', 'return'],
    forbiddenPatterns: [],
    testCases: [
      {
        id: 1,
        input: 'n = 15',
        expectedOutput: '"FizzBuzz"',
        explanation: '15 is divisible by both 3 and 5.',
      },
      {
        id: 2,
        input: 'n = 9',
        expectedOutput: '"Fizz"',
        explanation: '9 is divisible by 3.',
      },
      {
        id: 3,
        input: 'n = 10',
        expectedOutput: '"Buzz"',
        explanation: '10 is divisible by 5.',
      },
      {
        id: 4,
        input: 'n = 7',
        expectedOutput: '"7"',
        explanation: '7 is not divisible by 3 or 5.',
      },
    ],
  },
  {
    id: 4,
    title: 'Maximum Subarray Sum (Kadane Algorithm)',
    category: 'Algorithms',
    difficulty: 'Medium',
    tokens: 20,
    description: `Given an integer array \`nums\`, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.

**Submission Requirement**: Output must match database test vectors and your code must implement an accumulative sum / Kadane approach.`,
    language: 'javascript',
    starterCode: `function maxSubArray(nums) {
  // TODO: Write your algorithm here
  // Return the maximum contiguous sum
  
}`,
    databaseSolution: `function maxSubArray(nums) {
  let maxCurrent = nums[0];
  let maxGlobal = nums[0];
  for (let i = 1; i < nums.length; i++) {
    maxCurrent = Math.max(nums[i], maxCurrent + nums[i]);
    if (maxCurrent > maxGlobal) {
      maxGlobal = maxCurrent;
    }
  }
  return maxGlobal;
}`,
    requiredLogicPatterns: ['for', 'return'],
    forbiddenPatterns: ['return 6', 'return 23'],
    testCases: [
      {
        id: 1,
        input: 'nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]',
        expectedOutput: '6',
        explanation: 'Subarray [4, -1, 2, 1] has the largest sum = 6.',
      },
      {
        id: 2,
        input: 'nums = [1]',
        expectedOutput: '1',
        explanation: 'The subarray is [1] with sum = 1.',
      },
      {
        id: 3,
        input: 'nums = [5, 4, -1, 7, 8]',
        expectedOutput: '23',
        explanation: 'The subarray is [5, 4, -1, 7, 8] with sum = 23.',
      },
    ],
  },
];
