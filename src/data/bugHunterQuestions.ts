export interface BugHunterChallenge {
  id: number;
  title: string;
  language: 'Python' | 'C' | 'Java' | 'SQL';
  description: string;
  buggyCode: string;
  bugDescription: string;
  fixedCode: string;
  testInput: string;
  expectedOutput: string;
  hints: string[];
}

export const BUG_HUNTER_CHALLENGES: BugHunterChallenge[] = [
  {
    id: 1,
    title: 'Python Array Index Range Bug',
    language: 'Python',
    description: 'The function should calculate the sum of all elements in the list, but raises an IndexError.',
    buggyCode: `def sum_list(items):
    total = 0
    # Bug: range goes up to len(items) + 1
    for i in range(len(items) + 1):
        total += items[i]
    return total`,
    bugDescription: 'Loop index out of bounds: range(len(items) + 1) attempts to access items[len(items)].',
    fixedCode: `def sum_list(items):
    total = 0
    for i in range(len(items)):
        total += items[i]
    return total`,
    testInput: '[10, 20, 30, 40]',
    expectedOutput: '100',
    hints: ['Check the upper boundary of the range() loop.', 'Remember that Python lists are 0-indexed.'],
  },
  {
    id: 2,
    title: 'C Null Pointer Segmentation Fault',
    language: 'C',
    description: 'Pointer is dereferenced before ensuring it was allocated properly.',
    buggyCode: `int compute_square(int *ptr) {
    // Bug: Missing NULL check
    return (*ptr) * (*ptr);
}`,
    bugDescription: 'Dereferencing ptr without checking if ptr == NULL causes potential segmentation fault.',
    fixedCode: `int compute_square(int *ptr) {
    if (ptr == NULL) return 0;
    return (*ptr) * (*ptr);
}`,
    testInput: 'ptr = &val (val = 8)',
    expectedOutput: '64',
    hints: ['Always check if pointer is NULL before dereferencing.'],
  },
  {
    id: 3,
    title: 'SQL Aggregate Without Group By',
    language: 'SQL',
    description: 'Selecting both non-aggregate department column and AVG(salary) without GROUP BY.',
    buggyCode: `SELECT department, AVG(salary)
FROM employees;`,
    bugDescription: 'department is not part of an aggregate function and GROUP BY department clause is missing.',
    fixedCode: `SELECT department, AVG(salary)
FROM employees
GROUP BY department;`,
    testInput: 'employees table',
    expectedOutput: 'grouped rows per department with average salary',
    hints: ['Add GROUP BY department at the end of query.'],
  },
];
