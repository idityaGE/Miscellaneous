#include <iostream>
#include <vector>
#include <algorithm>
#include <functional>
using namespace std;

void processNumbers(vector<int>& nums, function<void(int)> func) {
  for (int num : nums) {
    func(num);
  }
}

int main() {
  // Basic lambda
  auto add = [](int a, int b) { return a + b; };
  cout << add(3, 4) << endl;

  //
  int x = 10, y = 20;
  auto sumByVal = [=]() { return x + y; };      // Capture by value
  auto subByRef = [&]() { return ++x + ++y; };  // Capture by reference

  cout << sumByVal() << endl;  // Output: 30 (x and y remain unchanged)
  cout << subByRef() << endl;  // Output: 32 (x and y are modified)
  cout << "x : " << x << " y : " << y << endl;

  //
  vector<int> nums = {3, 1, 4, 1, 5, 9};
  // Sort in descending order
  sort(nums.begin(), nums.end(), [](int a, int b) { return a > b; });
  // Print the sorted array
  for (int num : nums) cout << num << " ";
  // Output: 9 5 4 3 1 1


  // 
  vector<int> nums = {2, 4, 6, 8, 10};
  if (all_of(nums.begin(), nums.end(), [](int x) { return x % 2 == 0; })) {
    cout << "All numbers are even.\n";
  }
  if (any_of(nums.begin(), nums.end(), [](int x) { return x > 5; })) {
    cout << "At least one number is greater than 5.\n";
  }
  if (none_of(nums.begin(), nums.end(), [](int x) { return x < 0; })) {
    cout << "No negative numbers present.\n";
  }

  //
  vector<int> nums = {1, 3, 5, 7, 9, 2, 4, 6, 8, 10};
  int countEven = count_if(nums.begin(), nums.end(), [](int x) { return x % 2 == 0; });
  cout << "Number of even numbers: " << countEven << endl;  // Output: 5

  //
  vector<int> nums = {1, 3, 5, 7, 9, 2, 4, 6, 8, 10};
  auto it = find_if(nums.begin(), nums.end(), [](int x) { return x > 5; });
  if (it != nums.end()) {
    cout << "First number greater than 5: " << *it << endl;  // Output: 7
  }


  //
  vector<int> nums = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
  nums.erase(remove_if(nums.begin(), nums.end(), [](int x) { return x % 2 == 0; }), nums.end());
  // Print remaining elements
  for (int num : nums) cout << num << " ";
  // Output: 1 3 5 7 9

  //
  vector<int> nums = {1, 2, 3, 4, 5};
  vector<int> squares(nums.size());
  transform(nums.begin(), nums.end(), squares.begin(), [](int x) { return x * x; });
  for (int sq : squares) cout << sq << " ";
  // Output: 1 4 9 16 25

  //
  vector<pair<int, int>> arr = {{1, 5}, {2, 3}, {4, 2}, {3, 4}};
  sort(arr.begin(), arr.end(), [](pair<int, int> a, pair<int, int> b) {
    return a.second < b.second;  // Sort by second element
  });
  for (auto p : arr) cout << "(" << p.first << ", " << p.second << ") ";
  // Output: (4, 2) (2, 3) (3, 4) (1, 5)


  //
  vector<int> nums = {1, 2, 3, 4, 5};
  processNumbers(nums, [](int x) { cout << x * 2 << " "; });
  // Output: 2 4 6 8 10
  return 0;
}
