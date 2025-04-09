use std::sync::atomic::{AtomicU64, Ordering};
use std::sync::Arc;
use std::thread;
use std::time::Instant;

fn main() {
    let n = 17;
    println!("Solving for {}x{} board...", n, n);
    
    let start = Instant::now();
    let result = total_n_queens(n);
    let duration = start.elapsed();
    
    println!("Result for {} queens: {}", n, result);
    println!("Time taken: {:?}", duration);
}

fn total_n_queens(n: u32) -> u64 {
    let total_result = Arc::new(AtomicU64::new(0));
    let num_workers = thread::available_parallelism().map(|p| p.get()).unwrap_or(1);
    println!("Using {} CPU cores", num_workers);
    
    // Get all possible positions for the first row
    let available_positions = (1 << n) - 1;
    let mut handles = vec![];
    
    // For each possible position in the first row, start a thread
    let mut current_pos: u32 = available_positions;
    while current_pos != 0 {
        let position = current_pos & current_pos.wrapping_neg();
        current_pos ^= position;
        
        let total_clone = Arc::clone(&total_result);
        
        let handle = thread::spawn(move || {
            let mut partial_result = 0;
            backtrack_parallel(1, n, position, position << 1, position >> 1, &mut partial_result);
            
            // Safely update the total result with atomic operation
            total_clone.fetch_add(partial_result, Ordering::Relaxed);
        });
        
        handles.push(handle);
    }
    
    // Wait for all threads to complete
    for handle in handles {
        handle.join().unwrap();
    }
    
    total_result.load(Ordering::Relaxed)
}

#[inline(always)]
fn backtrack_parallel(row: u32, n: u32, cols: u32, diag1: u32, diag2: u32, result: &mut u64) {
    if row == n {
        *result += 1;
        return;
    }
    
    let mut available_positions = !(cols | diag1 | diag2) & ((1 << n) - 1);
    while available_positions != 0 {
        let position = available_positions & available_positions.wrapping_neg();
        available_positions ^= position;
        
        backtrack_parallel(
            row + 1, 
            n, 
            cols | position, 
            (diag1 | position) << 1, 
            (diag2 | position) >> 1, 
            result
        );
    }
}
