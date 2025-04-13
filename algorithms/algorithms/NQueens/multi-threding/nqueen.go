package main

import (
    "fmt"
    "runtime"
    "sync"
    "sync/atomic"
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
    
    numCPU := runtime.NumCPU()
    runtime.GOMAXPROCS(numCPU)
    fmt.Printf("Using %d CPU cores\n", numCPU)

    var totalSolutions int64 = 0
    var wg sync.WaitGroup

    // Only for first row, we'll split the work
    for col := 0; col < n; col++ {
        wg.Add(1)
        go func(startCol int) {
            defer wg.Done()
            
            // Create the initial board with first queen placed
            board := uint64(1) << startCol
            
            // Count solutions starting with this column
            solutions := countSolutions(1, board, board<<1, board>>1, n)
            atomic.AddInt64(&totalSolutions, solutions)
        }(col)
    }

    wg.Wait()
    return totalSolutions
}

// Recursive approach - simpler and likely more efficient than the stack-based one
func countSolutions(row int, cols, leftDiag, rightDiag uint64, n int) int64 {
    if row == n {
        return 1
    }
    
    // All occupied positions
    occupied := cols | leftDiag | rightDiag
    // All possible positions for current row (1 bits represent available positions)
    allPositions := uint64((1 << n) - 1)
    // Available positions
    validPositions := ^occupied & allPositions
    
    var count int64 = 0
    
    // Try each valid position
    for validPositions != 0 {
        // Get rightmost valid position
        pos := validPositions & -validPositions
        // Remove this position from validPositions
        validPositions ^= pos
        
        // Add a solution for each valid position in the next row
        count += countSolutions(
            row + 1,
            cols | pos,                 // Update columns
            (leftDiag | pos) << 1,      // Update left diagonal
            (rightDiag | pos) >> 1,     // Update right diagonal
            n,
        )
    }
    
    return count
}

// Function to return all solutions as 2D array if needed
func SolveNQueens(n int) [][]int {
    if n > 12 {
        fmt.Println("Warning: Generating all solutions for n > 12 may be very memory intensive")
    }
    
    var solutions [][]int
    if n <= 0 {
        return solutions
    }
    
    // For storing the board state - index is row, value is column
    board := make([]int, n)
    for i := range board {
        board[i] = -1
    }
    
    // Use backtracking to find all solutions
    generateSolutions(0, board, &solutions, n)
    return solutions
}

func generateSolutions(row int, board []int, solutions *[][]int, n int) {
    if row == n {
        // Found a solution, copy it
        solution := make([]int, n)
        copy(solution, board)
        *solutions = append(*solutions, solution)
        return
    }
    
    for col := 0; col < n; col++ {
        if isSafe(board, row, col) {
            board[row] = col
            generateSolutions(row+1, board, solutions, n)
            board[row] = -1  // Backtrack
        }
    }
}

func isSafe(board []int, row, col int) bool {
    for i := 0; i < row; i++ {
        // Check if same column or same diagonal
        if board[i] == col || 
           board[i] == col-(row-i) || 
           board[i] == col+(row-i) {
            return false
        }
    }
    return true
}
