package main

import (
	"fmt"
	"runtime"
	"sync"
	"time"
)

func totalNQueens(n int) int64 {
	var totalResult int64 = 0
	var wg sync.WaitGroup
	var mut sync.Mutex

	numWorkers := runtime.NumCPU()
	fmt.Printf("Using %d CPU cores\n", numWorkers)

	availablePositions := (1 << n) - 1

	for availablePositions != 0 {
		position := availablePositions & -availablePositions
		availablePositions ^= position

		wg.Add(1)
		go func(pos int) {
			defer wg.Done()

			partialResult := 0
			backtrackParallel(1, n, pos, pos<<1, pos>>1, &partialResult)

			mut.Lock()
			totalResult += int64(partialResult)
			mut.Unlock()
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
	var n int
	fmt.Print("Enter the n: ")
	fmt.Scanln(&n)

	fmt.Printf("\nSolving for %dx%d board...\n", n, n)

	start := time.Now()
	result := totalNQueens(n)
	elapsed := time.Since(start)

	fmt.Printf("Result for %d queens: %d\n", n, result)
	fmt.Printf("Time taken: %v\n", elapsed)
}
