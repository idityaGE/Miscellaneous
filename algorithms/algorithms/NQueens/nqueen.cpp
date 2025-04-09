#include <atomic>
#include <chrono>
#include <iostream>
#include <thread>
#include <vector>

std::atomic<uint64_t> totalResult{0};

inline void backtrackParallel(int row, int n, uint32_t cols, uint32_t diag1, uint32_t diag2, uint64_t& result) {
  if (row == n) {
    result++;
    return;
  }

  uint32_t availablePositions = ~(cols | diag1 | diag2) & ((1 << n) - 1);
  while (availablePositions) {
    uint32_t position = availablePositions & -availablePositions;
    availablePositions ^= position;
    backtrackParallel(row + 1, n, cols | position, (diag1 | position) << 1, (diag2 | position) >> 1, result);
  }
}

uint64_t totalNQueens(int n) {
  unsigned int numWorkers = std::thread::hardware_concurrency();
  std::cout << "Using " << numWorkers << " CPU cores\n";

  // Get all possible positions for the first row
  uint32_t availablePositions = (1 << n) - 1;
  std::vector<std::thread> threads;

  // For each possible position in the first row, start a thread
  while (availablePositions) {
    uint32_t position = availablePositions & -availablePositions;
    availablePositions ^= position;

    threads.emplace_back([position, n]() {
      uint64_t partialResult = 0;
      backtrackParallel(1, n, position, position << 1, position >> 1, partialResult);

      // Safely update the total result with atomic operation
      totalResult.fetch_add(partialResult, std::memory_order_relaxed);
    });
  }

  // Wait for all threads to complete
  for (auto& thread : threads) {
    if (thread.joinable()) {
      thread.join();
    }
  }

  return totalResult;
}

int main() {
  int n = 16;
  std::cout << "Solving for " << n << "x" << n << " board...\n";

  auto start = std::chrono::high_resolution_clock::now();
  uint64_t result = totalNQueens(n);
  auto end = std::chrono::high_resolution_clock::now();

  std::chrono::duration<double> elapsed = end - start;

  std::cout << "Result for " << n << " queens: " << result << "\n";
  std::cout << "Time taken: " << elapsed.count() << " seconds\n";

  return 0;
}
