package main

import (
	"fmt"
	"time"
)

func main() {
	n := 14

	start := time.Now()
	res := SolveNQueens(n)
	elapsed := time.Since(start)

	// fmt.Println("all the solutions :")
	// for _, arr := range res {
	// 	fmt.Printf("%d\n", arr)
	// }

	fmt.Printf("Result for %d queens: %d\n", n, len(res))
	fmt.Printf("Time taken: %v\n", elapsed)
}

func SolveNQueens(n int) [][]int {
	board := make([]int, n)
	for i := range board {
		board[i] = -1
	}
	var result [][]int
	backtrack(0, &result, board, n)
	return result
}

func backtrack(row int, result *[][]int, board []int, n int) {
	if row == n {
		temp := make([]int, n)
		copy(temp, board)
		*result = append(*result, temp)
		return
	}

	for col := range n {
		if isValid(board, row, col, n) {
			board[row] = col
			backtrack(row+1, result, board, n)
			board[row] = -1
		}
	}
}

func isValid(board []int, row, col, n int) bool {
	// for upper col check
	for i := range row {
		if board[i] == col {
			return false
		}
	}
	// upper diagonal left
	for i, j := row-1, col-1; i >= 0 && j >= 0; i, j = i-1, j-1 {
		if board[i] == j {
			return false
		}
	}
	// upper diagonal right
	for i, j := row-1, col+1; i >= 0 && j < n; i, j = i-1, j+1 {
		if board[i] == j {
			return false
		}
	}
	return true
}
