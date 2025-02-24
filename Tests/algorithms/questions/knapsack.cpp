#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

double fractionalKnapsack(int capacity, vector<pair<int, int>> &items) {
  sort(items.begin(), items.end(), [](pair<int, int> &a, pair<int, int> &b) {
    return (double)a.first / a.second > (double)b.first / b.second;  // val-to-wt ratio
  });

  double profit = 0;

  for (auto &item : items) {
    int val = item.first;
    int wt = item.second;

    if (capacity >= profit) {
      profit += val;
      capacity -= wt;
    } else {
      profit += ((double)val / wt) * capacity;
      break;
    }
  }

  return profit;
}

int main() {
    return 0;
}