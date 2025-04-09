package main

import (
	"fmt"
	"runtime"
	"sync"
	"sync/atomic"
	"time"
)

func totalNQueens(n int) int {
	var totalResult int64 = 0
	var wg sync.WaitGroup

	// Use all available CPU cores
	numWorkers := runtime.NumCPU()
	fmt.Printf("Using %d CPU cores\n", numWorkers)

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

			// Safely update the total result with atomic operation
			atomic.AddInt64(&totalResult, int64(partialResult))
		}(position)
	}

	wg.Wait()
	return int(totalResult)
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
	// Allow testing different board sizes
	sizes := 16

	fmt.Printf("\nSolving for %dx%d board...\n", sizes, sizes)

	start := time.Now()
	result := totalNQueens(sizes)
	elapsed := time.Since(start)

	fmt.Printf("Result for %d queens: %d\n", sizes, result)
	fmt.Printf("Time taken: %v\n", elapsed)
}
