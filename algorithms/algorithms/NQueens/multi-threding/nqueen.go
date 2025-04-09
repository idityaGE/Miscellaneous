package main

import (
	"fmt"
	"runtime"
	"sync"
	"sync/atomic"
	"time"
)

func main() {
	n := 16

	start := time.Now()
	count := solveNQueensParallel(n)
	duration := time.Since(start)

	fmt.Printf("Result for %d queens: %d\n", n, count)
	fmt.Printf("Time taken: %v\n", duration)
}

func solveNQueensParallel(n int) int64 {
	numCPU := runtime.NumCPU()
	fmt.Printf("Using %d CPU cores\n", numCPU)

	var totalSolutions int64 = 0
	var wg sync.WaitGroup
	
	// For n ≥ 12, we can use a lookup table for the first two rows to avoid redundant calculations
	if n >= 12 {
		// Process jobs in batches for better load balancing
		batchSize := 8
		jobs := make(chan int, n/2+1)
		
		// Create job queue for first column positions (exploiting symmetry)
		limit := n / 2
		if n%2 == 1 {
			limit++
		}
		
		for col := 0; col < limit; col++ {
			jobs <- col
		}
		close(jobs)
		
		// Create worker pool
		for i := 0; i < numCPU; i++ {
			wg.Add(1)
			go func() {
				defer wg.Done()
				
				// Process jobs in batches
				batch := make([]int, 0, batchSize)
				
				for {
					// Get a batch of jobs
					batch = batch[:0] // Clear batch
					for j := 0; j < batchSize; j++ {
						col, ok := <-jobs
						if !ok {
							break
						}
						batch = append(batch, col)
					}
					
					if len(batch) == 0 {
						break
					}
					
					// Process this batch
					var localCount int64
					for _, startCol := range batch {
						mask := uint64(1) << startCol
						
						// Precomputed first row constraint
						col := mask
						ld := mask << 1  // left diagonal
						rd := mask >> 1  // right diagonal
						
						// Factor for symmetry
						factor := int64(2)
						if n%2 == 1 && startCol == n/2 {
							factor = 1 // Middle column in odd board
						}
						
						// Use an optimized solver that avoids recursion
						localCount += factor * solveWithBitmaskNonRecursive(1, col, ld, rd, n)
					}
					
					atomic.AddInt64(&totalSolutions, localCount)
				}
			}()
		}
	} else {
		// For smaller board sizes, use the original approach
		limit := n / 2
		if n%2 == 1 {
			limit++
		}
		
		for col := 0; col < limit; col++ {
			wg.Add(1)
			go func(startCol int) {
				defer wg.Done()
				
				mask := uint64(1) << startCol
				
				// Precomputed first row constraint
				col := mask
				ld := mask << 1  // left diagonal
				rd := mask >> 1  // right diagonal
				
				// Factor for symmetry
				factor := int64(2)
				if n%2 == 1 && startCol == n/2 {
					factor = 1 // Middle column in odd board
				}
				
				localCount := factor * solveWithBitmaskNonRecursive(1, col, ld, rd, n)
				atomic.AddInt64(&totalSolutions, localCount)
			}(col)
		}
	}

	wg.Wait()
	return totalSolutions
}

// Non-recursive implementation using a state machine approach
func solveWithBitmaskNonRecursive(startRow int, col, ld, rd uint64, n int) int64 {
	var count int64
	
	// Pre-allocate all row states to avoid allocation in the search loop
	type State struct {
		row int
		col uint64
		ld  uint64
		rd  uint64
		pos uint64
	}
	
	// Use a manually managed stack to avoid function call overhead
	stack := make([]State, n+1)
	top := 0
	
	// Initialize first state
	allOnes := uint64((1 << n) - 1)
	stack[0] = State{
		row: startRow,
		col: col,
		ld:  ld,
		rd:  rd,
		pos: 0, // Will be calculated on first iteration
	}
	
	for top >= 0 {
		state := &stack[top]
		
		if state.row == n {
			// Found a solution
			count++
			top--
			continue
		}
		
		if state.pos == 0 {
			// First time processing this row, calculate valid positions
			state.pos = ^(state.col | state.ld | state.rd) & allOnes
		}
		
		if state.pos == 0 {
			// No valid positions left, backtrack
			top--
			continue
		}
		
		// Get the rightmost valid position
		p := state.pos & -state.pos
		// Remove this position from valid positions
		state.pos ^= p
		
		// Prepare next state
		top++
		if top < len(stack) {
			stack[top] = State{
				row: state.row + 1,
				col: state.col | p,
				ld:  (state.ld | p) << 1,
				rd:  (state.rd | p) >> 1,
				pos: 0,
			}
		}
	}
	
	return count
}
