#include <iostream>
using namespace std;

/**
 * A macro in C++ is a preprocessor directive that allows you to define constants,
 * functions, or code snippets that get replaced before compilation.
 * Macros are handled by the C++ preprocessor (#define),
 * which processes the code before the compiler sees it.
 */

#define PI 3.14159
#define MAX_VAL
#define TEMP 100

#undef TEMP  // Now TEMP is undefined

#define SQUARE(x) ((x) * (x))

#define BINARY_SEARCH(arr, n, key, result)    \
  {                                           \
    int left = 0, right = n - 1;              \
    result = -1; /* Default: key not found */ \
    while (left <= right) {                   \
      int mid = left + (right - left) / 2;    \
      if (arr[mid] == key) {                  \
        result = mid;                         \
        break;                                \
      } else if (arr[mid] < key) {            \
        left = mid + 1;                       \
      } else {                                \
        right = mid - 1;                      \
      }                                       \
    }                                         \
  }

int main() {
  std::cout << "Value of PI: " << PI << std::endl;  // Output: 3.14159
  // std::cout << "Max size: " << TEMP << std::endl;  // undefined

  std::cout << "Square of 5: " << SQUARE(5) << std::endl;  // Output: 25
  std::cout << "Square of 4+1: " << SQUARE(4 + 1) << std::endl;

  return 0;
}
