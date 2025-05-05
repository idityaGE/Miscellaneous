# HENNGE's Global Internship Program

"""Question :
- The input will be a list of integers, each separated by a newline character.
- The first line of the input will be an integer N (1 <= N <= 100), indicating the number of test cases to follow.
- Each of the test cases will consist of a line with an integer X (0 < X <= 100), followed by another line consisting of X number of space-separated integers Yn (-100 <= Yn <= 100).
- For each test case, calculate the power of four of Yn, excluding when Yn is positive, and print the calculated sum in the output.

Note: There should be no output until all the input has been received.
Note 2: Do not put blank lines between test cases solutions.
Note 3: Take input from standard input, and output to standard output.
Note 4: The final output is guaranteed to be within the int32 range.
Note 5: It is possible that X and the number of integers Yn may not be equal. If that is the case, print -1 as the output.
"""

"""Constaints
Your source code must be a single file, including at least a main function.
Do not use any for loop, while loop, or any list / set / dictionary comprehension.
Your solution will be tested against Python 3.13 (as of January 2025) or higher.
"""

"""
Sample Input :
2
4
3 -1 1 10
5
9 -5 -5 -10 10

Output :
1
11250
"""

def process_test_case(x, Yn):
    if x != len(Yn):
        return -1

    def sum_negative_fourth_powers(values, index=0, res=0):
        if index >= len(values):
            return res

        current = values[index]
        if current <= 0:
            res += current**4

        return sum_negative_fourth_powers(values, index + 1, res)

    return sum_negative_fourth_powers(Yn)


def main():
    n = int(input().strip())
    results = []

    def read_test_cases(remaining=n, res_results=None):
        if res_results is None:
            res_results = []

        if remaining == 0:
            return res_results

        x = int(input().strip())

        Yn = list(map(int, input().strip().split(' ')))

        result = process_test_case(x, Yn)
        res_results.append(result)

        return read_test_cases(remaining - 1, res_results)

    results = read_test_cases()

    def print_results(index=0):
        if index >= len(results):
            return
        print(results[index])
        print_results(index + 1)

    print_results()


if __name__ == "__main__":
    main()
