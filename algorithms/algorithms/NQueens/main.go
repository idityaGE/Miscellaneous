package main

import (
	"fmt"
	"sync"
	"time"
)

func totalNQueens(n int) int {
	var totalResult int
	var wg sync.WaitGroup
	var mutex sync.Mutex

	// Get all possible positions for the first row
	availablePositions := (1 << n) - 1

	// For each possible position in the first row, start a goroutine
	for availablePositions != 0 {
		position := availablePositions & -availablePositions
		availablePositions ^= position

		wg.Add(1)
		go func(pos int) {
			defer wg.Done()

			// Process this branch with the queen at position pos in the first row
			partialResult := 0
			backtrackParallel(1, n, pos, pos<<1, pos>>1, &partialResult)

			// Safely update the total result
			mutex.Lock()
			totalResult += partialResult
			mutex.Unlock()
		}(position)
	}

	wg.Wait()
	return totalResult
}

func backtrackParallel(row, n, cols, diag1, diag2 int, result *int) {
	if row == n {
		*result++
		return
	}

	availablePositions := ^(cols | diag1 | diag2) & ((1 << n) - 1)
	for availablePositions != 0 {
		position := availablePositions & -availablePositions
		availablePositions ^= position
		backtrackParallel(row+1, n, cols|position, (diag1|position)<<1, (diag2|position)>>1, result)
	}
}

func main() {
	n := 16

	start := time.Now()
	// result := totalNQueens(n)
	result := SolveNQueens(n)
	elapsed := time.Since(start)
	fmt.Printf("Parallel result for %d queens: %d\n", n, len(result))
	fmt.Printf("Parallel time taken: %v\n", elapsed)
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
	var wg sync.WaitGroup
	var mutex sync.Mutex

	if row == n {
		temp := make([]int, n)
		copy(temp, board)
		mutex.Lock()
		*result = append(*result, temp)
		mutex.Unlock()
		return

	}

	for col := range n {
		if isValid(board, row, col, n) {
			board[row] = col
			wg.Add(1)
			go backtrack(row+1, result, board, n)
			wg.Done()
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
