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

// This function runs in a goroutine and computes results for a specific first-row placement
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
	n := 12

	// Run the parallel version
	start := time.Now()
	result := totalNQueens(n)
	elapsed := time.Since(start)
	fmt.Printf("Parallel result for %d queens: %d\n", n, result)
	fmt.Printf("Parallel time taken: %v\n", elapsed)
}
