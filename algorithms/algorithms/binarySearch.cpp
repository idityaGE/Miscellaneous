#include <iostream>
#include <vector>
using namespace std;

int binarySearch(vector<int>& arr, int target) {
    int low = 0;
    int high = arr.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target)
            return mid;
        else if (arr[mid] < target)
            low = mid + 1;
        else
            high = mid - 1;
    }
    return -1;
}

// Recursively
int binarySearchRec(vector<int>& arr, int low, int high, int target) {
    if (low > high)
        return -1;
    int mid = low + (high - low) / 2;
    if (arr[mid] == target)
        return mid;
    else if (target > arr[mid])
        return binarySearchRec(arr, mid + 1, high, target);
    else
        return binarySearchRec(arr, low, mid - 1, target);
}

int main() {
    vector<int> arr = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
    int target = 5;
    
    cout << "Iterative Binary Search: " << binarySearch(arr, target) << endl;
    cout << "Recursive Binary Search: " << binarySearchRec(arr, 0, arr.size()-1, target) << endl;
    
    return 0;
}