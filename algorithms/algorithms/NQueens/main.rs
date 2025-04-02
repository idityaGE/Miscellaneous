use std::sync::{Arc, Mutex};
use std::thread;
use std::time::Instant;

fn total_n_queens(n: i32) -> i32 {
    let total_result = Arc::new(Mutex::new(0));
    let mut handles = vec![];

    // Get all possible positions for the first row
    let mut available_positions = (1 << n) - 1;

    // For each possible position in the first row, start a thread
    while available_positions != 0 {
        let position = available_positions & -available_positions;
        available_positions ^= position;

        let result_clone = Arc::clone(&total_result);
        let handle = thread::spawn(move || {
            // Process this branch with the queen at position pos in the first row
            let mut partial_result = 0;
            backtrack_parallel(1, n, position, position << 1, position >> 1, &mut partial_result);

            // Safely update the total result
            let mut total = result_clone.lock().unwrap();
            *total += partial_result;
        });

        handles.push(handle);
    }

    // Wait for all threads to complete
    for handle in handles {
        handle.join().unwrap();
    }

    // Fix: Create a separate scope for the lock to ensure it's dropped before returning
    let result = {
        let guard = total_result.lock().unwrap();
        *guard
    };
    
    result
}

// This function runs in a thread and computes results for a specific first-row placement
fn backtrack_parallel(row: i32, n: i32, cols: i32, diag1: i32, diag2: i32, result: &mut i32) {
    if row == n {
        *result += 1;
        return;
    }

    let mut available_positions = !(cols | diag1 | diag2) & ((1 << n) - 1);
    while available_positions != 0 {
        let position = available_positions & -available_positions;
        available_positions ^= position;
        backtrack_parallel(
            row + 1,
            n,
            cols | position,
            (diag1 | position) << 1,
            (diag2 | position) >> 1,
            result,
        );
    }
}

fn main() {
    let n = 17;

    // Run the parallel version
    let start = Instant::now();
    let result = total_n_queens(n);
    let elapsed = start.elapsed();
    println!("Parallel result for {} queens: {}", n, result);
    println!("Parallel time taken: {:?}", elapsed);
}
