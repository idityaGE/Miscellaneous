package main

import (
    "fmt"
    "runtime"
    "sync"
    "time"
)

func main() {
    var n int

    fmt.Print("Enter the n: ")
    fmt.Scanln(&n)

    start := time.Now()
    count := solveNQueensParallel(n)
    elapsed := time.Since(start)

    fmt.Printf("Result for %d queens: %d\n", n, count)
    fmt.Printf("Time taken: %v\n", elapsed)
}

func solveNQueensParallel(n int) int64 {
    if n <= 0 {
        return 0
    }
    
    // Set maximum CPU usage
    numCPU := runtime.NumCPU()
    runtime.GOMAXPROCS(numCPU)
    fmt.Printf("Using %d CPU cores\n", numCPU)

    // Using symmetry optimization for massive speedup
    var totalSolutions int64 = 0
    var wg sync.WaitGroup

    // For even values of n, we can exploit full symmetry
    // For odd values, the middle column breaks symmetry
    limit := n / 2
    if n%2 == 1 {
        limit++
    }

    // Create a channel for workers to report results
    results := make(chan int64, limit)
    
    // Launch workers
    for col := range limit {
        wg.Add(1)
        go func(startCol int) {
            defer wg.Done()
            
            // Create the initial board with first queen placed
            board := uint64(1) << startCol
            
            // Count solutions starting with this column
            solutions := countSolutions(1, board, board<<1, board>>1, n)
            
            // Apply symmetry factor
            factor := int64(2)
            if n%2 == 1 && startCol == n/2 {
                factor = 1 // Middle column in odd-sized board has no symmetry
            }
            
            results <- solutions * factor
        }(col)
    }
    
    // Collect results in a separate goroutine
    go func() {
        wg.Wait()
        close(results)
    }()
    
    // Sum up all results
    for res := range results {
        totalSolutions += res
    }
    
    return totalSolutions
}

// Optimized solution counter - rewritten for maximum performance
func countSolutions(row int, cols, leftDiag, rightDiag uint64, n int) int64 {
    // Base case - we've placed queens in all rows
    if row == n {
        return 1
    }
    
    var count int64 = 0
    
    // Pre-compute the mask for all valid positions in this row
    allPositions := uint64((1 << n) - 1)
    validPositions := ^(cols | leftDiag | rightDiag) & allPositions
    
    // Try each valid position
    for validPositions != 0 {
        // Get the least significant 1-bit (rightmost valid position)
        pos := validPositions & -validPositions
        
        // Remove this position from valid positions
        validPositions ^= pos
        
        // Recursively count solutions with this queen placement
        count += countSolutions(
            row + 1,
            cols | pos,           // Update occupied columns
            (leftDiag | pos) << 1, // Update left diagonal constraint
            (rightDiag | pos) >> 1, // Update right diagonal constraint
            n,
        )
    }
    
    return count
}
