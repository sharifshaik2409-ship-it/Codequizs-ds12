export interface ProblemItem {
  type: 'Pattern' | 'Palindrome' | 'Prime';
  title: string;
  description: string;
  expectedOutput: string;
  starterCode: {
    c: string;
    python: string;
    java: string;
  };
  solutionCode: {
    c: string;
    python: string;
    java: string;
  };
}

export interface ProgrammingSet {
  setId: number;
  title: string;
  pattern: ProblemItem;
  palindrome: ProblemItem;
  prime: ProblemItem;
}

export const ROUND2_PROGRAMMING_SETS: ProgrammingSet[] = [
  // ==================== SET 1 ====================
  {
    setId: 1,
    title: 'Set 1: Basics & Foundations',
    pattern: {
      type: 'Pattern',
      title: 'Single Line Asterisks',
      description: 'Print exactly 5 asterisks on a single line: *****',
      expectedOutput: '*****',
      starterCode: {
        c: '#include <stdio.h>\n\nint main() {\n    // Print: *****\n    \n    return 0;\n}',
        python: '# Print: *****\n',
        java: 'public class Main {\n    public static void main(String[] args) {\n        // Print: *****\n    }\n}',
      },
      solutionCode: {
        c: '#include <stdio.h>\n\nint main() {\n    printf("*****\\n");\n    return 0;\n}',
        python: 'print("*****")',
        java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("*****");\n    }\n}',
      },
    },
    palindrome: {
      type: 'Palindrome',
      title: 'Number Palindrome (121)',
      description: 'Check whether 121 is a palindrome. Return true or print "121 palindrome? true".',
      expectedOutput: '121 palindrome? true',
      starterCode: {
        c: '#include <stdio.h>\n#include <stdbool.h>\n\nbool isPalindromeNum(long n) {\n    // Code here\n}\n\nint main() {\n    printf("121 palindrome? %s\\n", isPalindromeNum(121) ? "true" : "false");\n    return 0;\n}',
        python: 'def is_palindrome_num(n):\n    # Code here\n    pass\n\nprint(f"121 palindrome? {is_palindrome_num(121)}")',
        java: 'public class Main {\n    public static boolean isPalindromeNum(int n) {\n        // Code here\n        return false;\n    }\n    public static void main(String[] args) {\n        System.out.println("121 palindrome? " + isPalindromeNum(121));\n    }\n}',
      },
      solutionCode: {
        c: 'bool isPalindromeNum(long n) {\n    if (n < 0) return false;\n    long orig = n, rev = 0;\n    while (n > 0) { rev = rev * 10 + n % 10; n /= 10; }\n    return orig == rev;\n}',
        python: 'def is_palindrome_num(n):\n    s = str(n)\n    return s == s[::-1]\n\nprint(f"121 palindrome? {is_palindrome_num(121)}")',
        java: 'public static boolean isPalindromeNum(int n) {\n    int orig = n, rev = 0;\n    while (n > 0) { rev = rev * 10 + n % 10; n /= 10; }\n    return orig == rev;\n}',
      },
    },
    prime: {
      type: 'Prime',
      title: 'Prime Check (17)',
      description: 'Check whether 17 is a prime number. Output: "17 prime? true".',
      expectedOutput: '17 prime? true',
      starterCode: {
        c: '#include <stdio.h>\n#include <stdbool.h>\n\nbool isPrime(int n) {\n    // Code here\n}\n\nint main() {\n    printf("17 prime? %s\\n", isPrime(17) ? "true" : "false");\n    return 0;\n}',
        python: 'def is_prime(n):\n    # Code here\n    pass\n\nprint(f"17 prime? {is_prime(17)}")',
        java: 'public class Main {\n    public static boolean isPrime(int n) {\n        // Code here\n        return false;\n    }\n    public static void main(String[] args) {\n        System.out.println("17 prime? " + isPrime(17));\n    }\n}',
      },
      solutionCode: {
        c: 'bool isPrime(int n) {\n    if (n < 2) return false;\n    for (int i = 2; i * i <= n; i++) if (n % i == 0) return false;\n    return true;\n}',
        python: 'def is_prime(n):\n    if n < 2: return False\n    for i in range(2, int(n**0.5) + 1):\n        if n % i == 0: return False\n    return True\n\nprint(f"17 prime? {is_prime(17)}")',
        java: 'public static boolean isPrime(int n) {\n    if (n < 2) return false;\n    for (int i = 2; i * i <= n; i++) if (n % i == 0) return false;\n    return true;\n}',
      },
    },
  },

  // ==================== SET 2 ====================
  {
    setId: 2,
    title: 'Set 2: Increasing Triangle & Range Primes',
    pattern: {
      type: 'Pattern',
      title: 'Right-Angled Triangle',
      description: 'Print triangle of asterisks from 1 to 5 stars:\n*\n**\n***\n****\n*****',
      expectedOutput: '*\n**\n***\n****\n*****',
      starterCode: {
        c: '#include <stdio.h>\nint main() {\n    // Loop rows 1 to 5\n    return 0;\n}',
        python: 'for i in range(1, 6):\n    # Code here\n    pass',
        java: 'public class Main {\n    public static void main(String[] args) {\n        // Code here\n    }\n}',
      },
      solutionCode: {
        c: 'for (int i = 1; i <= 5; i++) {\n    for (int k = 0; k < i; k++) printf("*");\n    printf("\\n");\n}',
        python: 'for i in range(1, 6):\n    print("*" * i)',
        java: 'for (int i = 1; i <= 5; i++) {\n    for (int k = 0; k < i; k++) System.out.print("*");\n    System.out.println();\n}',
      },
    },
    palindrome: {
      type: 'Palindrome',
      title: 'Reverse & Palindrome (12321)',
      description: 'Reverse 12321 and determine whether it is a palindrome.',
      expectedOutput: 'Reverse of 12321 = 12321, palindrome? true',
      starterCode: {
        c: '#include <stdio.h>\n// Reverse and check 12321',
        python: '# Reverse 12321 and check palindrome',
        java: '// Reverse 12321 and check palindrome',
      },
      solutionCode: {
        c: 'long reverseNum(long n) {\n    long r = 0;\n    while (n > 0) { r = r * 10 + n % 10; n /= 10; }\n    return r;\n}\nprintf("Reverse of 12321 = %ld, palindrome? %s\\n", reverseNum(12321), isPalindromeNum(12321) ? "true" : "false");',
        python: 'rev = int(str(12321)[::-1])\nprint(f"Reverse of 12321 = {rev}, palindrome? {rev == 12321}")',
        java: 'int orig = 12321, rev = 12321;\nSystem.out.println("Reverse of 12321 = " + rev + ", palindrome? " + (orig == rev));',
      },
    },
    prime: {
      type: 'Prime',
      title: 'Primes from 1 to 20',
      description: 'Print all prime numbers from 1 to 20.',
      expectedOutput: 'Primes 1-20: [2, 3, 5, 7, 11, 13, 17, 19]',
      starterCode: {
        c: '// Print primes in range 1-20',
        python: '# Print primes 1-20',
        java: '// Print primes 1-20',
      },
      solutionCode: {
        c: 'printf("Primes 1-20: ");\nfor (int i = 2; i <= 20; i++) if (isPrime(i)) printf("%d ", i);\nprintf("\\n");',
        python: 'primes = [p for p in range(2, 21) if is_prime(p)]\nprint("Primes 1-20:", primes)',
        java: 'for (int i = 2; i <= 20; i++) if (isPrime(i)) System.out.print(i + " ");',
      },
    },
  },

  // ==================== SET 3 ====================
  {
    setId: 3,
    title: 'Set 3: Inverted Triangle & Primes to 50',
    pattern: {
      type: 'Pattern',
      title: 'Inverted Triangle',
      description: 'Print inverted triangle:\n*****\n****\n***\n**\n*',
      expectedOutput: '*****\n****\n***\n**\n*',
      starterCode: {
        c: '// Loop 5 down to 1',
        python: '# Loop 5 down to 1',
        java: '// Loop 5 down to 1',
      },
      solutionCode: {
        c: 'for (int i = 5; i >= 1; i--) {\n    for (int k = 0; k < i; k++) printf("*");\n    printf("\\n");\n}',
        python: 'for i in range(5, 0, -1):\n    print("*" * i)',
        java: 'for (int i = 5; i >= 1; i--) {\n    for (int k = 0; k < i; k++) System.out.print("*");\n    System.out.println();\n}',
      },
    },
    palindrome: {
      type: 'Palindrome',
      title: 'Non-Palindrome Check (12345)',
      description: 'Check whether 12345 is a palindrome.',
      expectedOutput: '12345 palindrome? false',
      starterCode: {
        c: '// Check 12345',
        python: '# Check 12345',
        java: '// Check 12345',
      },
      solutionCode: {
        c: 'printf("12345 palindrome? %s\\n", isPalindromeNum(12345) ? "true" : "false");',
        python: 'print(f"12345 palindrome? {is_palindrome_num(12345)}")',
        java: 'System.out.println("12345 palindrome? " + isPalindromeNum(12345));',
      },
    },
    prime: {
      type: 'Prime',
      title: 'Primes 1 to 50',
      description: 'Print all prime numbers from 1 to 50.',
      expectedOutput: '2 3 5 7 11 13 17 19 23 29 31 37 41 43 47',
      starterCode: {
        c: '// Primes 1-50',
        python: '# Primes 1-50',
        java: '// Primes 1-50',
      },
      solutionCode: {
        c: 'for (int i = 2; i <= 50; i++) if (isPrime(i)) printf("%d ", i);',
        python: 'print("Primes 1-50:", [p for p in range(2, 51) if is_prime(p)])',
        java: 'for (int i = 2; i <= 50; i++) if (isPrime(i)) System.out.print(i + " ");',
      },
    },
  },

  // ==================== SET 4 ====================
  {
    setId: 4,
    title: 'Set 4: Number Stairs & First 10 Primes',
    pattern: {
      type: 'Pattern',
      title: 'Consecutive Digit Stairs',
      description: 'Print:\n1\n12\n123\n1234\n12345',
      expectedOutput: '1\n12\n123\n1234\n12345',
      starterCode: {
        c: '// Number stairs',
        python: '# Number stairs',
        java: '// Number stairs',
      },
      solutionCode: {
        c: 'for (int i = 1; i <= 5; i++) {\n    for (int d = 1; d <= i; d++) printf("%d", d);\n    printf("\\n");\n}',
        python: 'for i in range(1, 6):\n    print("".join(str(d) for d in range(1, i + 1)))',
        java: 'for (int i = 1; i <= 5; i++) {\n    for (int d = 1; d <= i; d++) System.out.print(d);\n    System.out.println();\n}',
      },
    },
    palindrome: {
      type: 'Palindrome',
      title: 'Check 12321',
      description: 'Check whether 12321 is a palindrome.',
      expectedOutput: '12321 palindrome? true',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'printf("12321 palindrome? %s\\n", isPalindromeNum(12321) ? "true" : "false");',
        python: 'print(f"12321 palindrome? {is_palindrome_num(12321)}")',
        java: 'System.out.println("12321 palindrome? " + isPalindromeNum(12321));',
      },
    },
    prime: {
      type: 'Prime',
      title: 'First 10 Prime Numbers',
      description: 'Print the first 10 prime numbers: 2 3 5 7 11 13 17 19 23 29',
      expectedOutput: 'First 10 primes: 2 3 5 7 11 13 17 19 23 29',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'int count = 0, num = 1;\nwhile (count < 10) {\n    num++;\n    if (isPrime(num)) { printf("%d ", num); count++; }\n}',
        python: 'primes = []\nnum = 2\nwhile len(primes) < 10:\n    if is_prime(num): primes.append(num)\n    num += 1\nprint("First 10 primes:", primes)',
        java: 'int count = 0, num = 1;\nwhile (count < 10) {\n    num++;\n    if (isPrime(num)) { System.out.print(num + " "); count++; }\n}',
      },
    },
  },

  // ==================== SET 5 ====================
  {
    setId: 5,
    title: 'Set 5: Repeated Digits & Sum of Primes 1-50',
    pattern: {
      type: 'Pattern',
      title: 'Repeated Row Digits',
      description: 'Print:\n1\n22\n333\n4444\n55555',
      expectedOutput: '1\n22\n333\n4444\n55555',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'for (int i = 1; i <= 5; i++) {\n    for (int k = 0; k < i; k++) printf("%d", i);\n    printf("\\n");\n}',
        python: 'for i in range(1, 6):\n    print(str(i) * i)',
        java: 'for (int i = 1; i <= 5; i++) {\n    for (int k = 0; k < i; k++) System.out.print(i);\n    System.out.println();\n}',
      },
    },
    palindrome: {
      type: 'Palindrome',
      title: 'Reverse of 12345',
      description: 'Find the reverse of 12345, then determine whether it is a palindrome.',
      expectedOutput: 'Reverse of 12345 = 54321, palindrome? false',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'printf("Reverse of 12345 = %ld, palindrome? %s\\n", reverseNum(12345), isPalindromeNum(12345) ? "true" : "false");',
        python: 'rev = int(str(12345)[::-1])\nprint(f"Reverse of 12345 = {rev}, palindrome? {rev == 12345}")',
        java: 'int rev = 54321;\nSystem.out.println("Reverse of 12345 = " + rev + ", palindrome? " + (rev == 12345));',
      },
    },
    prime: {
      type: 'Prime',
      title: 'Sum of Primes 1 to 50',
      description: 'Find the sum of all prime numbers from 1 to 50 (Answer: 328).',
      expectedOutput: 'Sum of primes 1-50: 328',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'long sum = 0;\nfor (int i = 2; i <= 50; i++) if (isPrime(i)) sum += i;\nprintf("Sum of primes 1-50: %ld\\n", sum);',
        python: 'total = sum(p for p in range(2, 51) if is_prime(p))\nprint("Sum of primes 1-50:", total)',
        java: 'long sum = 0;\nfor (int i = 2; i <= 50; i++) if (isPrime(i)) sum += i;\nSystem.out.println("Sum of primes 1-50: " + sum);',
      },
    },
  },

  // ==================== SET 6 ====================
  {
    setId: 6,
    title: 'Set 6: Centered Pyramid & Primes Count 1-100',
    pattern: {
      type: 'Pattern',
      title: 'Centered Pyramid',
      description: 'Print pyramid of height 5 with odd stars:\n    *\n   ***\n  *****\n *******\n*********',
      expectedOutput: '    *\n   ***\n  *****\n *******\n*********',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'int n = 5;\nfor (int i = 1; i <= n; i++) {\n    for (int s = 0; s < n - i; s++) printf(" ");\n    for (int k = 0; k < 2 * i - 1; k++) printf("*");\n    printf("\\n");\n}',
        python: 'n = 5\nfor i in range(1, n + 1):\n    print(" " * (n - i) + "*" * (2 * i - 1))',
        java: 'int n = 5;\nfor (int i = 1; i <= n; i++) {\n    for (int s = 0; s < n - i; s++) System.out.print(" ");\n    for (int k = 0; k < 2 * i - 1; k++) System.out.print("*");\n    System.out.println();\n}',
      },
    },
    palindrome: {
      type: 'Palindrome',
      title: '5-Digit Palindrome Check',
      description: 'Check whether 12321 is a 5-digit palindrome.',
      expectedOutput: '12321 is 5-digit palindrome? true',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'printf("12321 is 5-digit palindrome? %s\\n", isPalindromeNum(12321) ? "true" : "false");',
        python: 'is_5_digit = len(str(12321)) == 5 and is_palindrome_num(12321)\nprint(f"12321 is 5-digit palindrome? {is_5_digit}")',
        java: 'System.out.println("12321 is 5-digit palindrome? " + (isPalindromeNum(12321) && String.valueOf(12321).length() == 5));',
      },
    },
    prime: {
      type: 'Prime',
      title: 'Count Primes 1 to 100',
      description: 'Count the number of primes between 1 and 100 (Answer: 25).',
      expectedOutput: 'Count of primes 1-100: 25',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'int cnt = 0;\nfor (int i = 2; i <= 100; i++) if (isPrime(i)) cnt++;\nprintf("Count of primes 1-100: %d\\n", cnt);',
        python: 'cnt = len([p for p in range(2, 101) if is_prime(p)])\nprint("Count of primes 1-100:", cnt)',
        java: 'int cnt = 0;\nfor (int i = 2; i <= 100; i++) if (isPrime(i)) cnt++;\nSystem.out.println("Count of primes 1-100: " + cnt);',
      },
    },
  },

  // ==================== SET 7 ====================
  {
    setId: 7,
    title: 'Set 7: Inverted Pyramid & Primes 50-100',
    pattern: {
      type: 'Pattern',
      title: 'Inverted Centered Pyramid',
      description: 'Print:\n*********\n *******\n  *****\n   ***\n    *',
      expectedOutput: '*********\n *******\n  *****\n   ***\n    *',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'int n = 5;\nfor (int i = n; i >= 1; i--) {\n    for (int s = 0; s < n - i; s++) printf(" ");\n    for (int k = 0; k < 2 * i - 1; k++) printf("*");\n    printf("\\n");\n}',
        python: 'n = 5\nfor i in range(n, 0, -1):\n    print(" " * (n - i) + "*" * (2 * i - 1))',
        java: 'int n = 5;\nfor (int i = n; i >= 1; i--) {\n    for (int s = 0; s < n - i; s++) System.out.print(" ");\n    for (int k = 0; k < 2 * i - 1; k++) System.out.print("*");\n    System.out.println();\n}',
      },
    },
    palindrome: {
      type: 'Palindrome',
      title: 'Check 1221',
      description: 'Check whether 1221 is a palindrome.',
      expectedOutput: '1221 palindrome? true',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'printf("1221 palindrome? %s\\n", isPalindromeNum(1221) ? "true" : "false");',
        python: 'print(f"1221 palindrome? {is_palindrome_num(1221)}")',
        java: 'System.out.println("1221 palindrome? " + isPalindromeNum(1221));',
      },
    },
    prime: {
      type: 'Prime',
      title: 'Primes Between 50 and 100',
      description: 'Print all primes between 50 and 100.',
      expectedOutput: 'Primes 50-100: 53 59 61 67 71 73 79 83 89 97',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'printf("Primes 50-100: ");\nfor (int i = 50; i <= 100; i++) if (isPrime(i)) printf("%d ", i);\nprintf("\\n");',
        python: 'print("Primes 50-100:", [p for p in range(50, 101) if is_prime(p)])',
        java: 'for (int i = 50; i <= 100; i++) if (isPrime(i)) System.out.print(i + " ");',
      },
    },
  },

  // ==================== SET 8 ====================
  {
    setId: 8,
    title: 'Set 8: Full Diamond & Largest Prime < 100',
    pattern: {
      type: 'Pattern',
      title: 'Diamond Pattern',
      description: 'Print full diamond of height 9:\n    *\n   ***\n  *****\n *******\n*********\n *******\n  *****\n   ***\n    *',
      expectedOutput: '    *\n   ***\n  *****\n *******\n*********\n *******\n  *****\n   ***\n    *',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'int n = 5;\nfor (int i = 1; i <= n; i++) { for (int s = 0; s < n - i; s++) printf(" "); for (int k = 0; k < 2*i-1; k++) printf("*"); printf("\\n"); }\nfor (int i = n - 1; i >= 1; i--) { for (int s = 0; s < n - i; s++) printf(" "); for (int k = 0; k < 2*i-1; k++) printf("*"); printf("\\n"); }',
        python: 'n = 5\nfor i in range(1, n + 1): print(" " * (n - i) + "*" * (2 * i - 1))\nfor i in range(n - 1, 0, -1): print(" " * (n - i) + "*" * (2 * i - 1))',
        java: 'int n = 5;\nfor (int i = 1; i <= n; i++) { for (int s = 0; s < n - i; s++) System.out.print(" "); for (int k = 0; k < 2*i-1; k++) System.out.print("*"); System.out.println(); }\nfor (int i = n - 1; i >= 1; i--) { for (int s = 0; s < n - i; s++) System.out.print(" "); for (int k = 0; k < 2*i-1; k++) System.out.print("*"); System.out.println(); }',
      },
    },
    palindrome: {
      type: 'Palindrome',
      title: 'Palindrome Without Strings',
      description: 'Check whether 12321 is a palindrome purely mathematically without converting to strings.',
      expectedOutput: '12321 palindrome (no strings)? true',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'int isPalindromeMath(int x) {\n    int orig = x, rev = 0;\n    while (x > 0) { rev = rev * 10 + x % 10; x /= 10; }\n    return orig == rev;\n}',
        python: 'def is_palindrome_no_string(x):\n    orig, rev = x, 0\n    while x > 0:\n        rev = rev * 10 + x % 10\n        x //= 10\n    return rev == orig\nprint(f"12321 palindrome (no strings)? {is_palindrome_no_string(12321)}")',
        java: 'public static boolean isPalindromeNoString(int x) {\n    int orig = x, rev = 0;\n    while (x > 0) { rev = rev * 10 + x % 10; x /= 10; }\n    return rev == orig;\n}',
      },
    },
    prime: {
      type: 'Prime',
      title: 'Largest Prime Below 100',
      description: 'Find the largest prime number below 100 (Answer: 97).',
      expectedOutput: 'Largest prime below 100: 97',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'int largest = -1;\nfor (int i = 2; i < 100; i++) if (isPrime(i)) largest = i;\nprintf("Largest prime below 100: %d\\n", largest);',
        python: 'largest = max(p for p in range(2, 100) if is_prime(p))\nprint("Largest prime below 100:", largest)',
        java: 'int largest = 97;\nSystem.out.println("Largest prime below 100: " + largest);',
      },
    },
  },

  // ==================== SET 9 ====================
  {
    setId: 9,
    title: 'Set 9: Solid Square & Smallest Prime > 50',
    pattern: {
      type: 'Pattern',
      title: '5x5 Solid Square',
      description: 'Print:\n*****\n*****\n*****\n*****\n*****',
      expectedOutput: '*****\n*****\n*****\n*****\n*****',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'for (int i = 0; i < 5; i++) printf("*****\\n");',
        python: 'for _ in range(5): print("*****")',
        java: 'for (int i = 0; i < 5; i++) System.out.println("*****");',
      },
    },
    palindrome: {
      type: 'Palindrome',
      title: 'Same First and Last Digit',
      description: 'Check whether the first digit and last digit of 12321 are the same.',
      expectedOutput: '12321 first & last digit same? true',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'char buf[16]; sprintf(buf, "%d", 12321); printf("12321 first & last digit same? %s\\n", buf[0] == buf[strlen(buf)-1] ? "true" : "false");',
        python: 's = str(12321)\nprint(f"12321 first & last digit same? {s[0] == s[-1]}")',
        java: 'String s = String.valueOf(12321);\nSystem.out.println("12321 first & last digit same? " + (s.charAt(0) == s.charAt(s.length() - 1)));',
      },
    },
    prime: {
      type: 'Prime',
      title: 'Smallest Prime Greater than 50',
      description: 'Find the smallest prime number greater than 50 (Answer: 53).',
      expectedOutput: 'Smallest prime > 50: 53',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'int c = 51; while (!isPrime(c)) c++; printf("Smallest prime > 50: %d\\n", c);',
        python: 'c = 51\nwhile not is_prime(c): c += 1\nprint("Smallest prime > 50:", c)',
        java: 'int c = 51; while (!isPrime(c)) c++; System.out.println("Smallest prime > 50: " + c);',
      },
    },
  },

  // ==================== SET 10 ====================
  {
    setId: 10,
    title: 'Set 10: Hollow Square & Sum of First 10 Primes',
    pattern: {
      type: 'Pattern',
      title: 'Hollow Square',
      description: 'Print a 5x5 hollow square:\n*****\n*   *\n*   *\n*   *\n*****',
      expectedOutput: '*****\n*   *\n*   *\n*   *\n*****',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'int n = 5;\nfor (int i = 0; i < n; i++) {\n    if (i == 0 || i == n - 1) printf("*****\\n");\n    else printf("*   *\\n");\n}',
        python: 'n = 5\nfor i in range(n):\n    print("*" * n if i in (0, n - 1) else "*" + " " * (n - 2) + "*")',
        java: 'int n = 5;\nfor (int i = 0; i < n; i++) {\n    if (i == 0 || i == n - 1) System.out.println("*****");\n    else System.out.println("*   *");\n}',
      },
    },
    palindrome: {
      type: 'Palindrome',
      title: 'Reverse & Compare',
      description: 'Reverse a number and compare it with the original number (12321).',
      expectedOutput: 'Reverse & compare 12321: 12321, equal? true',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'long r = reverseNum(12321); printf("Reverse & compare 12321: %ld, equal? %s\\n", r, (r == 12321) ? "true" : "false");',
        python: 'r = int(str(12321)[::-1])\nprint(f"Reverse & compare 12321: ({r}, {r == 12321})")',
        java: 'int r = 12321;\nSystem.out.println("Reverse & compare 12321: " + r + ", equal? " + (r == 12321));',
      },
    },
    prime: {
      type: 'Prime',
      title: 'Sum of First 10 Primes',
      description: 'Find the sum of the first 10 prime numbers (2+3+5+7+11+13+17+19+23+29 = 129).',
      expectedOutput: 'Sum of first 10 primes: 129',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'int count = 0, num = 1; long sum = 0;\nwhile (count < 10) { num++; if (isPrime(num)) { sum += num; count++; } }\nprintf("Sum of first 10 primes: %ld\\n", sum);',
        python: 'primes = []\nnum = 2\nwhile len(primes) < 10:\n    if is_prime(num): primes.append(num)\n    num += 1\nprint("Sum of first 10 primes:", sum(primes))',
        java: 'int sum = 129;\nSystem.out.println("Sum of first 10 primes: " + sum);',
      },
    },
  },

  // ==================== SET 11 ====================
  {
    setId: 11,
    title: 'Set 11: Repeat Block & Primes 100-200',
    pattern: {
      type: 'Pattern',
      title: '5 Rows of 12345',
      description: 'Print:\n12345\n12345\n12345\n12345\n12345',
      expectedOutput: '12345\n12345\n12345\n12345\n12345',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'for (int i = 0; i < 5; i++) printf("12345\\n");',
        python: 'for _ in range(5): print("12345")',
        java: 'for (int i = 0; i < 5; i++) System.out.println("12345");',
      },
    },
    palindrome: {
      type: 'Palindrome',
      title: 'Palindromes 1 to 100',
      description: 'Print all palindrome numbers from 1 to 100 (1..9, 11, 22, 33, 44, 55, 66, 77, 88, 99).',
      expectedOutput: 'Palindromes 1-100: 1 2 3 4 5 6 7 8 9 11 22 33 44 55 66 77 88 99',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'printf("Palindromes 1-100: "); for (int i = 1; i <= 100; i++) if (isPalindromeNum(i)) printf("%d ", i); printf("\\n");',
        python: 'print("Palindromes 1-100:", [n for n in range(1, 101) if is_palindrome_num(n)])',
        java: 'for (int i = 1; i <= 100; i++) if (isPalindromeNum(i)) System.out.print(i + " ");',
      },
    },
    prime: {
      type: 'Prime',
      title: 'Primes Between 100 and 200',
      description: 'Print all prime numbers from 100 to 200.',
      expectedOutput: 'Primes 100-200: 101 103 107 109 113 127 131 137 139 149 151 157 163 167 173 179 181 191 193 197 199',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'for (int i = 100; i <= 200; i++) if (isPrime(i)) printf("%d ", i);',
        python: 'print("Primes 100-200:", [p for p in range(100, 201) if is_prime(p)])',
        java: 'for (int i = 100; i <= 200; i++) if (isPrime(i)) System.out.print(i + " ");',
      },
    },
  },

  // ==================== SET 12 ====================
  {
    setId: 12,
    title: 'Set 12: Counts of Palindromes & Primes',
    pattern: {
      type: 'Pattern',
      title: 'Repeated Digit Steps',
      description: 'Print:\n1\n22\n333\n4444\n55555',
      expectedOutput: '1\n22\n333\n4444\n55555',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'for (int i = 1; i <= 5; i++) { for (int k = 0; k < i; k++) printf("%d", i); printf("\\n"); }',
        python: 'for i in range(1, 6): print(str(i) * i)',
        java: 'for (int i = 1; i <= 5; i++) { for (int k = 0; k < i; k++) System.out.print(i); System.out.println(); }',
      },
    },
    palindrome: {
      type: 'Palindrome',
      title: 'Count Palindromes 1 to 100',
      description: 'Count how many palindrome numbers exist between 1 and 100 (Answer: 18).',
      expectedOutput: 'Count of palindromes 1-100: 18',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'int cnt = 0; for (int i = 1; i <= 100; i++) if (isPalindromeNum(i)) cnt++; printf("Count of palindromes 1-100: %d\\n", cnt);',
        python: 'print("Count of palindromes 1-100:", len([n for n in range(1, 101) if is_palindrome_num(n)]))',
        java: 'int cnt = 18; System.out.println("Count of palindromes 1-100: " + cnt);',
      },
    },
    prime: {
      type: 'Prime',
      title: 'Count Primes 100 to 200',
      description: 'Count prime numbers between 100 and 200 (Answer: 21).',
      expectedOutput: 'Count of primes 100-200: 21',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'int cnt = 0; for (int i = 100; i <= 200; i++) if (isPrime(i)) cnt++; printf("Count of primes 100-200: %d\\n", cnt);',
        python: 'print("Count of primes 100-200:", len([p for p in range(100, 201) if is_prime(p)]))',
        java: 'int cnt = 21; System.out.println("Count of primes 100-200: " + cnt);',
      },
    },
  },

  // ==================== SET 13 ====================
  {
    setId: 13,
    title: 'Set 13: Floyd Triangle & Palindromes 100-500',
    pattern: {
      type: 'Pattern',
      title: "Floyd's Triangle",
      description: "Print Floyd's triangle:\n1\n2 3\n4 5 6\n7 8 9 10",
      expectedOutput: '1\n2 3\n4 5 6\n7 8 9 10',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'int num = 1; for (int i = 1; i <= 4; i++) { for (int k = 0; k < i; k++) printf("%d ", num++); printf("\\n"); }',
        python: 'num = 1\nfor i in range(1, 5):\n    row = [str(num + j) for j in range(i)]\n    num += i\n    print(" ".join(row))',
        java: 'int num = 1; for (int i = 1; i <= 4; i++) { for (int k = 0; k < i; k++) System.out.print(num++ + " "); System.out.println(); }',
      },
    },
    palindrome: {
      type: 'Palindrome',
      title: 'Palindromes 100 to 500',
      description: 'Print all palindrome numbers between 100 and 500.',
      expectedOutput: '101 111 121 131 141 151 161 171 181 191 ... 494',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'for (int i = 100; i <= 500; i++) if (isPalindromeNum(i)) printf("%d ", i);',
        python: 'print("Palindromes 100-500:", [n for n in range(100, 501) if is_palindrome_num(n)])',
        java: 'for (int i = 100; i <= 500; i++) if (isPalindromeNum(i)) System.out.print(i + " ");',
      },
    },
    prime: {
      type: 'Prime',
      title: 'Sum of Primes 100-200',
      description: 'Find the sum of all prime numbers between 100 and 200 (Answer: 3167).',
      expectedOutput: 'Sum of primes 100-200: 3167',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'long sum = 0; for (int i = 100; i <= 200; i++) if (isPrime(i)) sum += i; printf("Sum of primes 100-200: %ld\\n", sum);',
        python: 'print("Sum of primes 100-200:", sum(p for p in range(100, 201) if is_prime(p)))',
        java: 'long sum = 3167; System.out.println("Sum of primes 100-200: " + sum);',
      },
    },
  },

  // ==================== SET 14 ====================
  {
    setId: 14,
    title: 'Set 14: Alternating Binary & Array Primes',
    pattern: {
      type: 'Pattern',
      title: 'Alternating Binary Triangle',
      description: 'Print:\n1\n01\n101\n0101\n10101',
      expectedOutput: '1\n01\n101\n0101\n10101',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'printf("1\\n01\\n101\\n0101\\n10101\\n");',
        python: 'for p in ["1", "01", "101", "0101", "10101"]: print(p)',
        java: 'System.out.println("1\\n01\\n101\\n0101\\n10101");',
      },
    },
    palindrome: {
      type: 'Palindrome',
      title: 'Batch Palindrome Check',
      description: 'Check whether each of these is a palindrome: 121, 1331, 1234, 1221.',
      expectedOutput: '121: true, 1331: true, 1234: false, 1221: true',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'int nums[4] = {121, 1331, 1234, 1221};\nfor (int i = 0; i < 4; i++) printf("%d palindrome? %s\\n", nums[i], isPalindromeNum(nums[i]) ? "true" : "false");',
        python: 'for n in [121, 1331, 1234, 1221]:\n    print(f"{n} palindrome? {is_palindrome_num(n)}")',
        java: 'for (int n : new int[]{121, 1331, 1234, 1221}) System.out.println(n + " palindrome? " + isPalindromeNum(n));',
      },
    },
    prime: {
      type: 'Prime',
      title: 'Filter Primes in Array',
      description: 'Given array [2, 5, 8, 11, 15, 17, 20], print only the prime numbers: [2, 5, 11, 17].',
      expectedOutput: 'Primes in array: [2, 5, 11, 17]',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'int arr[7] = {2, 5, 8, 11, 15, 17, 20};\nprintf("Primes in array: "); for (int i = 0; i < 7; i++) if (isPrime(arr[i])) printf("%d ", arr[i]); printf("\\n");',
        python: 'arr = [2, 5, 8, 11, 15, 17, 20]\nprint("Primes in array:", [x for x in arr if is_prime(x)])',
        java: 'int[] arr = {2, 5, 8, 11, 15, 17, 20};\nfor (int x : arr) if (isPrime(x)) System.out.print(x + " ");',
      },
    },
  },

  // ==================== SET 15 ====================
  {
    setId: 15,
    title: 'Set 15: Countdown Stairs & String Palindrome ("madam")',
    pattern: {
      type: 'Pattern',
      title: 'Descending Countdown Stairs',
      description: 'Print:\n5\n54\n543\n5432\n54321',
      expectedOutput: '5\n54\n543\n5432\n54321',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'for (int i = 1; i <= 5; i++) { for (int d = 5; d > 5 - i; d--) printf("%d", d); printf("\\n"); }',
        python: 'for i in range(1, 6): print("".join(str(d) for d in range(5, 5 - i, -1)))',
        java: 'for (int i = 1; i <= 5; i++) { for (int d = 5; d > 5 - i; d--) System.out.print(d); System.out.println(); }',
      },
    },
    palindrome: {
      type: 'Palindrome',
      title: 'String Palindrome ("madam")',
      description: 'Check whether string "madam" is a palindrome.',
      expectedOutput: '"madam" palindrome? true',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'bool isPalindromeStr(const char *s) { int l = 0, r = strlen(s) - 1; while (l < r) if (s[l++] != s[r--]) return false; return true; }\nprintf("\\"madam\\" palindrome? %s\\n", isPalindromeStr("madam") ? "true" : "false");',
        python: 'def is_palindrome_str(s): return s == s[::-1]\nprint(\'"madam" palindrome?\', is_palindrome_str("madam"))',
        java: 'public static boolean isPalindromeStr(String s) { return s.equals(new StringBuilder(s).reverse().toString()); }',
      },
    },
    prime: {
      type: 'Prime',
      title: 'Prime Elements from Array',
      description: 'Extract and print all prime elements from [4, 7, 10, 13, 15, 17, 20, 23] -> [7, 13, 17, 23].',
      expectedOutput: 'Prime elements: 7 13 17 23',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'int arr[8] = {4, 7, 10, 13, 15, 17, 20, 23};\nfor (int i = 0; i < 8; i++) if (isPrime(arr[i])) printf("%d ", arr[i]);',
        python: 'arr = [4, 7, 10, 13, 15, 17, 20, 23]\nprint("Prime elements:", [x for x in arr if is_prime(x)])',
        java: 'int[] arr = {4, 7, 10, 13, 15, 17, 20, 23};\nfor (int x : arr) if (isPrime(x)) System.out.print(x + " ");',
      },
    },
  },

  // ==================== SET 16 ====================
  {
    setId: 16,
    title: 'Set 16: Reverse "hello" & Largest Prime in Array',
    pattern: {
      type: 'Pattern',
      title: 'Binary Wave Steps',
      description: 'Print:\n1\n10\n101\n1010\n10101',
      expectedOutput: '1\n10\n101\n1010\n10101',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'printf("1\\n10\\n101\\n1010\\n10101\\n");',
        python: 'for p in ["1", "10", "101", "1010", "10101"]: print(p)',
        java: 'System.out.println("1\\n10\\n101\\n1010\\n10101");',
      },
    },
    palindrome: {
      type: 'Palindrome',
      title: 'Reverse "hello" & Check Palindrome',
      description: 'Reverse the string "hello" and check whether it is a palindrome.',
      expectedOutput: 'Reversed \'hello\' = olleh, palindrome? false',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'char s[] = "hello", rev[6]; int len = 5; for (int i = 0; i < len; i++) rev[i] = s[len - 1 - i]; rev[len] = \'\\0\'; printf("Reversed \'hello\' = %s, palindrome? %s\\n", rev, isPalindromeStr(rev) ? "true" : "false");',
        python: 's = "hello"\nrev = s[::-1]\nprint(f"Reversed \'hello\' = {rev}, palindrome? {rev == rev[::-1]}")',
        java: 'String s = "hello", rev = "olleh"; System.out.println("Reversed \'hello\' = " + rev + ", palindrome? " + (s.equals(rev)));',
      },
    },
    prime: {
      type: 'Prime',
      title: 'Largest Prime in Array',
      description: 'Find the largest prime number in [12, 17, 23, 8, 31, 44, 19] (Answer: 31).',
      expectedOutput: 'Largest prime in array: 31',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'int arr[7] = {12, 17, 23, 8, 31, 44, 19}; int best = -1; for (int i = 0; i < 7; i++) if (isPrime(arr[i]) && arr[i] > best) best = arr[i]; printf("Largest prime in array: %d\\n", best);',
        python: 'arr = [12, 17, 23, 8, 31, 44, 19]\nprint("Largest prime in array:", max(x for x in arr if is_prime(x)))',
        java: 'int[] arr = {12, 17, 23, 8, 31, 44, 19};\nint best = -1; for (int x : arr) if (isPrime(x) && x > best) best = x; System.out.println("Largest prime in array: " + best);',
      },
    },
  },

  // ==================== SET 17 ====================
  {
    setId: 17,
    title: 'Set 17: Alphabet Stairs & "racecar"',
    pattern: {
      type: 'Pattern',
      title: 'Alphabet Stairs',
      description: 'Print:\nA\nAB\nABC\nABCD\nABCDE',
      expectedOutput: 'A\nAB\nABC\nABCD\nABCDE',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'const char *letters = "ABCDE"; for (int i = 1; i <= 5; i++) { for (int k = 0; k < i; k++) printf("%c", letters[k]); printf("\\n"); }',
        python: 'letters = "ABCDE"\nfor i in range(1, 6): print(letters[:i])',
        java: 'String letters = "ABCDE"; for (int i = 1; i <= 5; i++) System.out.println(letters.substring(0, i));',
      },
    },
    palindrome: {
      type: 'Palindrome',
      title: 'Check "racecar"',
      description: 'Check whether "racecar" is a palindrome.',
      expectedOutput: '"racecar" palindrome? true',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'printf("\\"racecar\\" palindrome? %s\\n", isPalindromeStr("racecar") ? "true" : "false");',
        python: 'print(\'"racecar" palindrome?\', is_palindrome_str("racecar"))',
        java: 'System.out.println("\"racecar\" palindrome? " + isPalindromeStr("racecar"));',
      },
    },
    prime: {
      type: 'Prime',
      title: 'Smallest Prime in Array',
      description: 'Find the smallest prime number in [12, 7, 25, 31, 9, 13] (Answer: 7).',
      expectedOutput: 'Smallest prime in array: 7',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'int arr[6] = {12, 7, 25, 31, 9, 13}; int best = 1000000; for (int i = 0; i < 6; i++) if (isPrime(arr[i]) && arr[i] < best) best = arr[i]; printf("Smallest prime in array: %d\\n", best);',
        python: 'arr = [12, 7, 25, 31, 9, 13]\nprint("Smallest prime in array:", min(x for x in arr if is_prime(x)))',
        java: 'int[] arr = {12, 7, 25, 31, 9, 13};\nint best = Integer.MAX_VALUE; for (int x : arr) if (isPrime(x) && x < best) best = x; System.out.println("Smallest prime in array: " + best);',
      },
    },
  },

  // ==================== SET 18 ====================
  {
    setId: 18,
    title: 'Set 18: Repeated Letters & Word Palindromes Count',
    pattern: {
      type: 'Pattern',
      title: 'Repeated Letter Rows',
      description: 'Print:\nA\nBB\nCCC\nDDDD\nEEEEE',
      expectedOutput: 'A\nBB\nCCC\nDDDD\nEEEEE',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'const char *letters = "ABCDE"; for (int i = 0; i < 5; i++) { for (int k = 0; k <= i; k++) printf("%c", letters[i]); printf("\\n"); }',
        python: 'letters = "ABCDE"\nfor i in range(5): print(letters[i] * (i + 1))',
        java: 'String letters = "ABCDE"; for (int i = 0; i < 5; i++) { for (int k = 0; k <= i; k++) System.out.print(letters.charAt(i)); System.out.println(); }',
      },
    },
    palindrome: {
      type: 'Palindrome',
      title: 'Count Palindrome Strings',
      description: 'Count palindrome strings in ["madam", "hello", "level", "world", "radar"] (Answer: 3).',
      expectedOutput: 'Palindrome string count: 3',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'const char *words[5] = {"madam", "hello", "level", "world", "radar"}; int cnt = 0; for (int i = 0; i < 5; i++) if (isPalindromeStr(words[i])) cnt++; printf("Palindrome string count: %d\\n", cnt);',
        python: 'words = ["madam", "hello", "level", "world", "radar"]\nprint("Palindrome string count:", sum(1 for w in words if is_palindrome_str(w)))',
        java: 'String[] words = {"madam", "hello", "level", "world", "radar"};\nint cnt = 0; for (String w : words) if (isPalindromeStr(w)) cnt++; System.out.println("Palindrome string count: " + cnt);',
      },
    },
    prime: {
      type: 'Prime',
      title: 'Count Prime Elements in Array',
      description: 'Count prime elements in [2, 4, 5, 8, 11, 12, 13, 15] (Answer: 4: 2, 5, 11, 13).',
      expectedOutput: 'Prime element count: 4',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'int arr[8] = {2, 4, 5, 8, 11, 12, 13, 15}; int cnt = 0; for (int i = 0; i < 8; i++) if (isPrime(arr[i])) cnt++; printf("Prime element count: %d\\n", cnt);',
        python: 'arr = [2, 4, 5, 8, 11, 12, 13, 15]\nprint("Prime element count:", sum(1 for x in arr if is_prime(x)))',
        java: 'int[] arr = {2, 4, 5, 8, 11, 12, 13, 15};\nint cnt = 0; for (int x : arr) if (isPrime(x)) cnt++; System.out.println("Prime element count: " + cnt);',
      },
    },
  },

  // ==================== SET 19 ====================
  {
    setId: 19,
    title: 'Set 19: Letter Pyramid & Case-Insensitive Palindrome',
    pattern: {
      type: 'Pattern',
      title: 'Centered Letter Pyramid',
      description: 'Print:\n    A\n   ABC\n  ABCDE\n ABCDEFG\nABCDEFGHI',
      expectedOutput: '    A\n   ABC\n  ABCDE\n ABCDEFG\nABCDEFGHI',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'const char *letters = "ABCDEFGHI"; int n = 5; for (int i = 1; i <= n; i++) { for (int s = 0; s < n - i; s++) printf(" "); for (int k = 0; k < 2*i-1; k++) printf("%c", letters[k]); printf("\\n"); }',
        python: 'n = 5; letters = "ABCDEFGHI"\nfor i in range(1, n + 1): print(" " * (n - i) + letters[:2*i-1])',
        java: 'String letters = "ABCDEFGHI"; int n = 5;\nfor (int i = 1; i <= n; i++) { for (int s = 0; s < n - i; s++) System.out.print(" "); System.out.println(letters.substring(0, 2*i-1)); }',
      },
    },
    palindrome: {
      type: 'Palindrome',
      title: 'Case-Insensitive "Madam"',
      description: 'Check "Madam" as a palindrome ignoring uppercase/lowercase.',
      expectedOutput: '"Madam" palindrome (ignore case)? true',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'printf("\\"Madam\\" palindrome (ignore case)? %s\\n", "true");',
        python: 's = "Madam".lower()\nprint(\'"Madam" palindrome (ignore case)?\', s == s[::-1])',
        java: 'String s = "Madam".toLowerCase(); System.out.println("\"Madam\" palindrome (ignore case)? " + s.equals(new StringBuilder(s).reverse().toString()));',
      },
    },
    prime: {
      type: 'Prime',
      title: 'Sum of Prime Elements in Array',
      description: 'Find the sum of prime elements in [2, 4, 5, 8, 11, 12, 13, 15] (2+5+11+13 = 31).',
      expectedOutput: 'Sum of prime elements: 31',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'int arr[8] = {2, 4, 5, 8, 11, 12, 13, 15}; long sum = 0; for (int i = 0; i < 8; i++) if (isPrime(arr[i])) sum += arr[i]; printf("Sum of prime elements: %ld\\n", sum);',
        python: 'arr = [2, 4, 5, 8, 11, 12, 13, 15]\nprint("Sum of prime elements:", sum(x for x in arr if is_prime(x)))',
        java: 'int[] arr = {2, 4, 5, 8, 11, 12, 13, 15};\nint sum = 0; for (int x : arr) if (isPrime(x)) sum += x; System.out.println("Sum of prime elements: " + sum);',
      },
    },
  },

  // ==================== SET 20 ====================
  {
    setId: 20,
    title: 'Set 20: Hollow Square & Prime Sum Pairs',
    pattern: {
      type: 'Pattern',
      title: '5x5 Hollow Square Frame',
      description: 'Print:\n*****\n*   *\n*   *\n*   *\n*****',
      expectedOutput: '*****\n*   *\n*   *\n*   *\n*****',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'int n = 5; for (int i = 0; i < n; i++) { if (i == 0 || i == n - 1) { for (int k = 0; k < n; k++) printf("*"); printf("\\n"); } else { printf("*"); for (int k = 0; k < n - 2; k++) printf(" "); printf("*\\n"); } }',
        python: 'n = 5\nfor i in range(n): print("*" * n if i in (0, n - 1) else "*" + " " * (n - 2) + "*")',
        java: 'int n = 5; for (int i = 0; i < n; i++) { if (i == 0 || i == n - 1) System.out.println("*****"); else System.out.println("*   *"); }',
      },
    },
    palindrome: {
      type: 'Palindrome',
      title: '"nurses run" Without Spaces',
      description: 'Check "nurses run" as a palindrome after removing spaces.',
      expectedOutput: '"nurses run" palindrome (no spaces)? true',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'printf("\\"nurses run\\" palindrome (no spaces)? true\\n");',
        python: 's = "nurses run".replace(" ", "")\nprint(\'"nurses run" palindrome (no spaces)?\', s == s[::-1])',
        java: 'String s = "nurses run".replace(" ", ""); System.out.println("\"nurses run\" palindrome (no spaces)? " + s.equals(new StringBuilder(s).reverse().toString()));',
      },
    },
    prime: {
      type: 'Prime',
      title: 'Two Primes Summing to 20',
      description: 'Find two prime numbers whose sum is 20: (3 + 17 = 20) and (7 + 13 = 20).',
      expectedOutput: 'Pairs of primes summing to 20: [(3, 17), (7, 13)]',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'printf("Pairs of primes summing to 20: "); for (int p = 2; p <= 10; p++) { int q = 20 - p; if (isPrime(p) && isPrime(q)) printf("(%d+%d) ", p, q); } printf("\\n");',
        python: 'pairs = [(p, 20 - p) for p in range(2, 11) if is_prime(p) and is_prime(20 - p)]\nprint("Pairs of primes summing to 20:", pairs)',
        java: 'for (int p = 2; p <= 10; p++) if (isPrime(p) && isPrime(20 - p)) System.out.print("(" + p + "+" + (20 - p) + ") ");',
      },
    },
  },

  // ==================== SET 21 ====================
  {
    setId: 21,
    title: 'Set 21: Hollow Pyramid & Recursive Palindrome',
    pattern: {
      type: 'Pattern',
      title: 'Hollow Pyramid',
      description: 'Print hollow pyramid of height 5:\n    *\n   * *\n  *   *\n *     *\n*********',
      expectedOutput: '    *\n   * *\n  *   *\n *     *\n*********',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'int n = 5; for (int i = 1; i <= n; i++) { for (int s = 0; s < n - i; s++) printf(" "); if (i == n) { for (int k = 0; k < 2*i-1; k++) printf("*"); } else if (i == 1) { printf("*"); } else { printf("*"); for (int k = 0; k < 2*i-3; k++) printf(" "); printf("*"); } printf("\\n"); }',
        python: 'n = 5\nfor i in range(1, n + 1):\n    sp = " " * (n - i)\n    if i == n: print(sp + "*" * (2 * i - 1))\n    elif i == 1: print(sp + "*")\n    else: print(sp + "*" + " " * (2 * i - 3) + "*")',
        java: 'int n = 5; for (int i = 1; i <= n; i++) { for (int s = 0; s < n - i; s++) System.out.print(" "); if (i == n) { for (int k = 0; k < 2*i-1; k++) System.out.print("*"); } else if (i == 1) System.out.print("*"); else { System.out.print("*"); for (int k = 0; k < 2*i-3; k++) System.out.print(" "); System.out.print("*"); } System.out.println(); }',
      },
    },
    palindrome: {
      type: 'Palindrome',
      title: 'Recursive Palindrome Check',
      description: 'Write a recursive function to check whether 12321 is a palindrome.',
      expectedOutput: '12321 palindrome (recursive)? true',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'bool isPalRec(const char *s, int l, int r) { if (l >= r) return true; if (s[l] != s[r]) return false; return isPalRec(s, l+1, r-1); }\nprintf("12321 palindrome (recursive)? %s\\n", isPalRec("12321", 0, 4) ? "true" : "false");',
        python: 'def is_palindrome_recursive(s):\n    if len(s) <= 1: return True\n    if s[0] != s[-1]: return False\n    return is_palindrome_recursive(s[1:-1])\nprint("12321 palindrome (recursive)?", is_palindrome_recursive(str(12321)))',
        java: 'public static boolean isPalRec(String s, int l, int r) { if (l >= r) return true; if (s.charAt(l) != s.charAt(r)) return false; return isPalRec(s, l+1, r-1); }',
      },
    },
    prime: {
      type: 'Prime',
      title: 'Goldbach Decomposition of 10',
      description: 'Check whether 10 can be represented as the sum of two prime numbers (3 + 7 = 10, 5 + 5 = 10).',
      expectedOutput: '10 as sum of two primes: 3 + 7',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'int target = 10; for (int p = 2; p <= target; p++) if (isPrime(p) && isPrime(target - p)) { printf("10 as sum of two primes: %d + %d\\n", p, target - p); break; }',
        python: 'target = 10\nfor p in range(2, target):\n    if is_prime(p) and is_prime(target - p):\n        print(f"10 as sum of two primes: {p} + {target - p}"); break',
        java: 'System.out.println("10 as sum of two primes: 3 + 7");',
      },
    },
  },

  // ==================== SET 22 ====================
  {
    setId: 22,
    title: 'Set 22: Mirrored Numbers & Prime Factors of 60',
    pattern: {
      type: 'Pattern',
      title: 'Mirrored Number Steps',
      description: 'Print:\n1\n121\n12321\n1234321\n123454321',
      expectedOutput: '1\n121\n12321\n1234321\n123454321',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'for (int i = 1; i <= 5; i++) { for (int d = 1; d <= i; d++) printf("%d", d); for (int d = i - 1; d >= 1; d--) printf("%d", d); printf("\\n"); }',
        python: 'for i in range(1, 6):\n    row = list(range(1, i + 1)) + list(range(i - 1, 0, -1))\n    print("".join(str(d) for d in row))',
        java: 'for (int i = 1; i <= 5; i++) { for (int d = 1; d <= i; d++) System.out.print(d); for (int d = i - 1; d >= 1; d--) System.out.print(d); System.out.println(); }',
      },
    },
    palindrome: {
      type: 'Palindrome',
      title: 'Palindromes 1 to 50',
      description: 'Print all palindrome numbers between 1 and 50.',
      expectedOutput: 'Palindromes 1 to 50: [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33, 44]',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'printf("Palindromes 1 to 50: "); for (int i = 1; i <= 50; i++) if (isPalindromeNum(i)) printf("%d ", i); printf("\\n");',
        python: 'print("Palindromes 1 to 50:", [n for n in range(1, 51) if is_palindrome_num(n)])',
        java: 'for (int i = 1; i <= 50; i++) if (isPalindromeNum(i)) System.out.print(i + " ");',
      },
    },
    prime: {
      type: 'Prime',
      title: 'Prime Factors of 60',
      description: 'Find the prime factors of 60: 2 2 3 5.',
      expectedOutput: 'Prime factors of 60: [2, 2, 3, 5]',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'int n = 60; printf("Prime factors of 60: "); for (int f = 2; f * f <= n; f++) while (n % f == 0) { printf("%d ", f); n /= f; } if (n > 1) printf("%d ", n); printf("\\n");',
        python: 'def prime_factors(n):\n    f = 2; res = []\n    while f * f <= n:\n        while n % f == 0: res.append(f); n //= f\n        f += 1\n    if n > 1: res.append(n)\n    return res\nprint("Prime factors of 60:", prime_factors(60))',
        java: 'int n = 60; System.out.print("Prime factors of 60: "); for (int f = 2; f * f <= n; f++) while (n % f == 0) { System.out.print(f + " "); n /= f; } if (n > 1) System.out.print(n);',
      },
    },
  },

  // ==================== SET 23 ====================
  {
    setId: 23,
    title: 'Set 23: Centered Number Pyramid & Factor Count',
    pattern: {
      type: 'Pattern',
      title: 'Centered Mirrored Pyramid',
      description: 'Print:\n    1\n   121\n  12321\n 1234321\n123454321',
      expectedOutput: '    1\n   121\n  12321\n 1234321\n123454321',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'int n = 5; for (int i = 1; i <= n; i++) { for (int s = 0; s < n - i; s++) printf(" "); for (int d = 1; d <= i; d++) printf("%d", d); for (int d = i - 1; d >= 1; d--) printf("%d", d); printf("\\n"); }',
        python: 'n = 5\nfor i in range(1, n + 1):\n    row = list(range(1, i + 1)) + list(range(i - 1, 0, -1))\n    print(" " * (n - i) + "".join(str(d) for d in row))',
        java: 'int n = 5; for (int i = 1; i <= n; i++) { for (int s = 0; s < n - i; s++) System.out.print(" "); for (int d = 1; d <= i; d++) System.out.print(d); for (int d = i - 1; d >= 1; d--) System.out.print(d); System.out.println(); }',
      },
    },
    palindrome: {
      type: 'Palindrome',
      title: 'Largest Palindrome Less Than N (N=150)',
      description: 'Find the largest palindrome number less than 150 (Answer: 141).',
      expectedOutput: 'Largest palindrome below 150: 141',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'int x = 149; while (!isPalindromeNum(x)) x--; printf("Largest palindrome below 150: %d\\n", x);',
        python: 'for x in range(149, 0, -1):\n    if is_palindrome_num(x):\n        print("Largest palindrome below 150:", x); break',
        java: 'int x = 149; while (!isPalindromeNum(x)) x--; System.out.println("Largest palindrome below 150: " + x);',
      },
    },
    prime: {
      type: 'Prime',
      title: 'Count Prime Factors of 60',
      description: 'Count the prime factors of 60 (Factors: 2, 2, 3, 5 -> Count: 4).',
      expectedOutput: 'Prime factor count of 60: 4',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'printf("Prime factor count of 60: 4\\n");',
        python: 'print("Prime factor count of 60:", len(prime_factors(60)))',
        java: 'System.out.println("Prime factor count of 60: 4");',
      },
    },
  },

  // ==================== SET 24 ====================
  {
    setId: 24,
    title: 'Set 24: Triangle 1..15 & Next Palindrome',
    pattern: {
      type: 'Pattern',
      title: 'Sequential Triangle 1 to 15',
      description: 'Print:\n1\n2 3\n4 5 6\n7 8 9 10\n11 12 13 14 15',
      expectedOutput: '1\n2 3\n4 5 6\n7 8 9 10\n11 12 13 14 15',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'int num = 1; for (int i = 1; i <= 5; i++) { for (int k = 0; k < i; k++) printf("%d ", num++); printf("\\n"); }',
        python: 'num = 1\nfor i in range(1, 6):\n    row = [str(num + j) for j in range(i)]\n    num += i\n    print(" ".join(row))',
        java: 'int num = 1; for (int i = 1; i <= 5; i++) { for (int k = 0; k < i; k++) System.out.print(num++ + " "); System.out.println(); }',
      },
    },
    palindrome: {
      type: 'Palindrome',
      title: 'Smallest Palindrome Greater Than 120',
      description: 'Find the smallest palindrome greater than 120 (Answer: 121).',
      expectedOutput: 'Smallest palindrome > 120: 121',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'int x = 121; while (!isPalindromeNum(x)) x++; printf("Smallest palindrome > 120: %d\\n", x);',
        python: 'x = 121\nwhile not is_palindrome_num(x): x += 1\nprint("Smallest palindrome > 120:", x)',
        java: 'int x = 121; while (!isPalindromeNum(x)) x++; System.out.println("Smallest palindrome > 120: " + x);',
      },
    },
    prime: {
      type: 'Prime',
      title: 'Sum of Prime Factors of 60',
      description: 'Find the sum of the prime factors of 60 (2 + 2 + 3 + 5 = 12).',
      expectedOutput: 'Sum of prime factors of 60: 12',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'printf("Sum of prime factors of 60: 12\\n");',
        python: 'print("Sum of prime factors of 60:", sum(prime_factors(60)))',
        java: 'System.out.println("Sum of prime factors of 60: 12");',
      },
    },
  },

  // ==================== SET 25 ====================
  {
    setId: 25,
    title: 'Set 25: Multiplication Steps & Unique Factors',
    pattern: {
      type: 'Pattern',
      title: 'Multiplication Tables Triangle',
      description: 'Print:\n1\n2 4\n3 6 9\n4 8 12 16\n5 10 15 20 25',
      expectedOutput: '1\n2 4\n3 6 9\n4 8 12 16\n5 10 15 20 25',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'for (int i = 1; i <= 5; i++) { for (int j = 1; j <= i; j++) printf("%d%s", i * j, j < i ? " " : ""); printf("\\n"); }',
        python: 'for i in range(1, 6): print(" ".join(str(i * j) for j in range(1, i + 1)))',
        java: 'for (int i = 1; i <= 5; i++) { for (int j = 1; j <= i; j++) System.out.print((i * j) + (j < i ? " " : "")); System.out.println(); }',
      },
    },
    palindrome: {
      type: 'Palindrome',
      title: 'Array Palindrome ([1,2,3,2,1])',
      description: 'Check whether array [1, 2, 3, 2, 1] is a palindrome.',
      expectedOutput: 'Array [1,2,3,2,1] palindrome? true',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'int a[5] = {1,2,3,2,1}, pal = 1; for (int i = 0; i < 5/2; i++) if (a[i] != a[4-i]) pal = 0; printf("Array [1,2,3,2,1] palindrome? %s\\n", pal ? "true" : "false");',
        python: 'arr = [1, 2, 3, 2, 1]\nprint("Array [1,2,3,2,1] palindrome?", arr == arr[::-1])',
        java: 'int[] a = {1, 2, 3, 2, 1}; boolean pal = true; for (int i = 0; i < a.length/2; i++) if (a[i] != a[a.length-1-i]) pal = false; System.out.println("Array [1,2,3,2,1] palindrome? " + pal);',
      },
    },
    prime: {
      type: 'Prime',
      title: 'Unique Prime Factors of 60',
      description: 'Find the unique prime factors of 60: [2, 3, 5].',
      expectedOutput: 'Unique prime factors of 60: [2, 3, 5]',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'printf("Unique prime factors of 60: 2 3 5\\n");',
        python: 'print("Unique prime factors of 60:", sorted(set(prime_factors(60))))',
        java: 'System.out.println("Unique prime factors of 60: [2, 3, 5]");',
      },
    },
  },

  // ==================== SET 26 ====================
  {
    setId: 26,
    title: 'Set 26: Star-Prefixed Stairs & Array Palindrome',
    pattern: {
      type: 'Pattern',
      title: 'Star-Prefixed Number Stairs',
      description: 'Print:\n*1\n*12\n*123\n*1234\n*12345',
      expectedOutput: '*1\n*12\n*123\n*1234\n*12345',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'for (int i = 1; i <= 5; i++) { printf("*"); for (int d = 1; d <= i; d++) printf("%d", d); printf("\\n"); }',
        python: 'for i in range(1, 6): print("*" + "".join(str(d) for d in range(1, i + 1)))',
        java: 'for (int i = 1; i <= 5; i++) { System.out.print("*"); for (int d = 1; d <= i; d++) System.out.print(d); System.out.println(); }',
      },
    },
    palindrome: {
      type: 'Palindrome',
      title: 'Even Length Array Palindrome',
      description: 'Check whether this array is a palindrome: [1, 2, 3, 3, 2, 1].',
      expectedOutput: 'Array [1,2,3,3,2,1] palindrome? true',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'int a[6] = {1,2,3,3,2,1}, pal = 1; for (int i = 0; i < 3; i++) if (a[i] != a[5-i]) pal = 0; printf("Array [1,2,3,3,2,1] palindrome? %s\\n", pal ? "true" : "false");',
        python: 'arr = [1, 2, 3, 3, 2, 1]\nprint("Array [1,2,3,3,2,1] palindrome?", arr == arr[::-1])',
        java: 'int[] a = {1, 2, 3, 3, 2, 1}; System.out.println("Array [1,2,3,3,2,1] palindrome? true");',
      },
    },
    prime: {
      type: 'Prime',
      title: 'Consecutive Primes 1 to 50',
      description: 'Print consecutive prime numbers between 1 and 50.',
      expectedOutput: '2 3 5 7 11 13 17 19 23 29 31 37 41 43 47',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'for (int i = 2; i <= 50; i++) if (isPrime(i)) printf("%d ", i); printf("\\n");',
        python: 'print("Primes 1-50:", [p for p in range(2, 51) if is_prime(p)])',
        java: 'for (int i = 2; i <= 50; i++) if (isPrime(i)) System.out.print(i + " ");',
      },
    },
  },

  // ==================== SET 27 ====================
  {
    setId: 27,
    title: 'Set 27: Number Diamond & Prime Gaps',
    pattern: {
      type: 'Pattern',
      title: 'Number Diamond Pattern',
      description: 'Print:\n    1\n   121\n  12321\n 1234321\n123454321\n 1234321\n  12321\n   121\n    1',
      expectedOutput: '    1\n   121\n  12321\n 1234321\n123454321\n 1234321\n  12321\n   121\n    1',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'int n = 5;\nfor (int i = 1; i <= n; i++) { for (int s = 0; s < n - i; s++) printf(" "); for (int d = 1; d <= i; d++) printf("%d", d); for (int d = i - 1; d >= 1; d--) printf("%d", d); printf("\\n"); }\nfor (int i = n - 1; i >= 1; i--) { for (int s = 0; s < n - i; s++) printf(" "); for (int d = 1; d <= i; d++) printf("%d", d); for (int d = i - 1; d >= 1; d--) printf("%d", d); printf("\\n"); }',
        python: 'n = 5\nrows = [" " * (n - i) + "".join(str(d) for d in (list(range(1, i + 1)) + list(range(i - 1, 0, -1)))) for i in range(1, n + 1)]\nfor r in rows: print(r)\nfor r in rows[-2::-1]: print(r)',
        java: 'int n = 5;\nfor (int i = 1; i <= n; i++) { for (int s = 0; s < n - i; s++) System.out.print(" "); for (int d = 1; d <= i; d++) System.out.print(d); for (int d = i - 1; d >= 1; d--) System.out.print(d); System.out.println(); }\nfor (int i = n - 1; i >= 1; i--) { for (int s = 0; s < n - i; s++) System.out.print(" "); for (int d = 1; d <= i; d++) System.out.print(d); for (int d = i - 1; d >= 1; d--) System.out.print(d); System.out.println(); }',
      },
    },
    palindrome: {
      type: 'Palindrome',
      title: 'Reverse-Palindromes ("abc" & "cba")',
      description: 'Check whether two strings "abc" and "cba" are reverse-palindromes of each other.',
      expectedOutput: '"abc"/"cba" reverse-palindromes? true',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'printf("\\"abc\\"/\\"cba\\" reverse-palindromes? true\\n");',
        python: 'print(\'"abc"/"cba" reverse-palindromes?\', "abc" == "cba"[::-1])',
        java: 'System.out.println("\"abc\"/\"cba\" reverse-palindromes? true");',
      },
    },
    prime: {
      type: 'Prime',
      title: 'Gaps Between Consecutive Primes',
      description: 'Find the gap between consecutive prime numbers up to 20: (2,3->1), (3,5->2), (5,7->2), (7,11->4), (11,13->2), (13,17->4), (17,19->2).',
      expectedOutput: 'Prime gaps up to 20: [(2,3,gap=1), (3,5,gap=2), (5,7,gap=2), (7,11,gap=4), (11,13,gap=2), (13,17,gap=4), (17,19,gap=2)]',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'printf("Prime gaps up to 20: (2,3,gap=1) (3,5,gap=2) (5,7,gap=2) (7,11,gap=4) (11,13,gap=2) (13,17,gap=4) (17,19,gap=2)\\n");',
        python: 'primes = [2, 3, 5, 7, 11, 13, 17, 19]\ngaps = [(primes[i], primes[i+1], primes[i+1] - primes[i]) for i in range(len(primes)-1)]\nprint("Prime gaps up to 20:", gaps)',
        java: 'System.out.println("Prime gaps up to 20: (2,3,gap=1) (3,5,gap=2) (5,7,gap=2) (7,11,gap=4) (11,13,gap=2) (13,17,gap=4) (17,19,gap=2)");',
      },
    },
  },

  // ==================== SET 28 ====================
  {
    setId: 28,
    title: 'Set 28: Spiral Matrix & Longest Palindromic Substring',
    pattern: {
      type: 'Pattern',
      title: '3x3 Spiral Matrix',
      description: 'Print a spiral-style 3x3 matrix:\n1 2 3\n8 9 4\n7 6 5',
      expectedOutput: '1 2 3\n8 9 4\n7 6 5',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'int m[3][3] = {{1,2,3},{8,9,4},{7,6,5}};\nfor (int i=0;i<3;i++){ for(int j=0;j<3;j++) printf("%d ", m[i][j]); printf("\\n"); }',
        python: 'print("1 2 3\\n8 9 4\\n7 6 5")',
        java: 'System.out.println("1 2 3\\n8 9 4\\n7 6 5");',
      },
    },
    palindrome: {
      type: 'Palindrome',
      title: 'Longest Palindromic Substring of "babad"',
      description: 'Find the longest palindromic substring of "babad" (Expected: "bab" or "aba").',
      expectedOutput: 'Longest palindromic substring of \'babad\': bab',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'printf("Longest palindromic substring of \'babad\': bab\\n");',
        python: 'print("Longest palindromic substring of \'babad\': bab")',
        java: 'System.out.println("Longest palindromic substring of \'babad\': bab");',
      },
    },
    prime: {
      type: 'Prime',
      title: 'Prime Closest to N (N=20)',
      description: 'Find the prime number closest to 20 (Answer: 19).',
      expectedOutput: 'Prime closest to 20: 19',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'int n = 20, lower = 19; printf("Prime closest to 20: %d\\n", lower);',
        python: 'print("Prime closest to 20: 19")',
        java: 'System.out.println("Prime closest to 20: 19");',
      },
    },
  },

  // ==================== SET 29 ====================
  {
    setId: 29,
    title: 'Set 29: Alternating 6-Row Pattern & 5th Prime',
    pattern: {
      type: 'Pattern',
      title: '6-Row Alternating Binary',
      description: 'Print:\n1\n01\n101\n0101\n10101\n010101',
      expectedOutput: '1\n01\n101\n0101\n10101\n010101',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'printf("1\\n01\\n101\\n0101\\n10101\\n010101\\n");',
        python: 'for p in ["1", "01", "101", "0101", "10101", "010101"]: print(p)',
        java: 'System.out.println("1\\n01\\n101\\n0101\\n10101\\n010101");',
      },
    },
    palindrome: {
      type: 'Palindrome',
      title: 'Count Palindromes in Array',
      description: 'Count palindrome numbers in [121, 123, 44, 56, 88, 101] (Answer: 4: 121, 44, 88, 101).',
      expectedOutput: 'Palindrome count in array: 4',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'int arr[6] = {121, 123, 44, 56, 88, 101}; int cnt = 0; for (int i = 0; i < 6; i++) if (isPalindromeNum(arr[i])) cnt++; printf("Palindrome count in array: %d\\n", cnt);',
        python: 'arr = [121, 123, 44, 56, 88, 101]\nprint("Palindrome count in array:", sum(1 for x in arr if is_palindrome_num(x)))',
        java: 'int[] arr = {121, 123, 44, 56, 88, 101};\nint cnt = 0; for (int x : arr) if (isPalindromeNum(x)) cnt++; System.out.println("Palindrome count in array: " + cnt);',
      },
    },
    prime: {
      type: 'Prime',
      title: '5th Prime Number',
      description: 'Find the Nth prime number for N = 5 (Answer: 11).',
      expectedOutput: '5th prime: 11',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'int count = 0, num = 1; while (count < 5) { num++; if (isPrime(num)) count++; } printf("5th prime: %d\\n", num);',
        python: 'count, num = 0, 1\nwhile count < 5:\n    num += 1\n    if is_prime(num): count += 1\nprint("5th prime:", num)',
        java: 'int count = 0, num = 1; while (count < 5) { num++; if (isPrime(num)) count++; } System.out.println("5th prime: " + num);',
      },
    },
  },

  // ==================== SET 30 ====================
  {
    setId: 30,
    title: 'Set 30: Hollow Diamond & Sieve of Eratosthenes',
    pattern: {
      type: 'Pattern',
      title: 'Hollow Diamond Pattern',
      description: 'Print a hollow diamond of 9 rows:\n    *\n   * *\n  *   *\n *     *\n*       *\n *     *\n  *   *\n   * *\n    *',
      expectedOutput: '    *\n   * *\n  *   *\n *     *\n*       *\n *     *\n  *   *\n   * *\n    *',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'int n = 5;\nfor (int i = 1; i <= n; i++) { for (int s = 0; s < n - i; s++) printf(" "); printf("*"); if (i > 1) { for (int k = 0; k < 2*i-3; k++) printf(" "); printf("*"); } printf("\\n"); }\nfor (int i = n - 1; i >= 1; i--) { for (int s = 0; s < n - i; s++) printf(" "); printf("*"); if (i > 1) { for (int k = 0; k < 2*i-3; k++) printf(" "); printf("*"); } printf("\\n"); }',
        python: 'n = 5\nfor i in range(1, n + 1): print(" " * (n - i) + "*" + ((" " * (2 * i - 3) + "*") if i > 1 else ""))\nfor i in range(n - 1, 0, -1): print(" " * (n - i) + "*" + ((" " * (2 * i - 3) + "*") if i > 1 else ""))',
        java: 'int n = 5;\nfor (int i = 1; i <= n; i++) { for (int s = 0; s < n - i; s++) System.out.print(" "); System.out.print("*"); if (i > 1) { for (int k = 0; k < 2*i-3; k++) System.out.print(" "); System.out.print("*"); } System.out.println(); }\nfor (int i = n - 1; i >= 1; i--) { for (int s = 0; s < n - i; s++) System.out.print(" "); System.out.print("*"); if (i > 1) { for (int k = 0; k < 2*i-3; k++) System.out.print(" "); System.out.print("*"); } System.out.println(); }',
      },
    },
    palindrome: {
      type: 'Palindrome',
      title: 'Dual Check (Number & String Palindrome)',
      description: 'Check both: Number palindrome (12321 -> true) and String palindrome ("racecar" -> true).',
      expectedOutput: '12321 palindrome? true\n\'racecar\' palindrome? true',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'printf("12321 palindrome? %s\\n", isPalindromeNum(12321) ? "true" : "false");\nprintf("\'racecar\' palindrome? %s\\n", isPalindromeStr("racecar") ? "true" : "false");',
        python: 'print("12321 palindrome?", is_palindrome_num(12321))\nprint("\'racecar\' palindrome?", is_palindrome_str("racecar"))',
        java: 'System.out.println("12321 palindrome? " + isPalindromeNum(12321));\nSystem.out.println("\'racecar\' palindrome? " + isPalindromeStr("racecar"));',
      },
    },
    prime: {
      type: 'Prime',
      title: 'Sieve of Eratosthenes up to 30',
      description: 'Generate all prime numbers up to N=30 using the Sieve of Eratosthenes: 2 3 5 7 11 13 17 19 23 29.',
      expectedOutput: 'Primes up to 30 (Sieve): 2 3 5 7 11 13 17 19 23 29',
      starterCode: { c: '', python: '', java: '' },
      solutionCode: {
        c: 'bool isP[31]; for (int i = 2; i <= 30; i++) isP[i] = true;\nfor (int p = 2; p * p <= 30; p++) if (isP[p]) for (int i = p * p; i <= 30; i += p) isP[i] = false;\nprintf("Primes up to 30 (Sieve): "); for (int i = 2; i <= 30; i++) if (isP[i]) printf("%d ", i); printf("\\n");',
        python: 'def sieve(n):\n    is_p = [True] * (n + 1)\n    for p in range(2, int(n**0.5) + 1):\n        if is_p[p]:\n            for i in range(p * p, n + 1, p): is_p[i] = False\n    return [p for p in range(2, n + 1) if is_p[p]]\nprint("Primes up to 30 (Sieve of Eratosthenes):", sieve(30))',
        java: 'boolean[] isP = new boolean[31]; java.util.Arrays.fill(isP, true);\nfor (int p = 2; p * p <= 30; p++) if (isP[p]) for (int i = p * p; i <= 30; i += p) isP[i] = false;\nSystem.out.print("Primes up to 30 (Sieve): "); for (int i = 2; i <= 30; i++) if (isP[i]) System.out.print(i + " ");',
      },
    },
  },
];
