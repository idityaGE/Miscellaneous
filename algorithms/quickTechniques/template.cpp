#include <iostream>

template <typename T>
int binarySearch(T arr[], int n, T key) {
  int left = 0, right = n - 1;
  while (left <= right) {
    int mid = left + (right - left) / 2;
    if (arr[mid] == key)
      return mid;
    else if (arr[mid] < key)
      left = mid + 1;
    else
      right = mid - 1;
  }
  return -1;  // Not found
}

int main() {
  int arr[] = {1, 3, 5, 7, 9, 11};
  int n = sizeof(arr) / sizeof(arr[0]);
  int key = 7;

  int index = binarySearch(arr, n, key);

  if (index != -1)
    std::cout << "Element found at index: " << index << std::endl;
  else
    std::cout << "Element not found" << std::endl;

  return 0;
}
