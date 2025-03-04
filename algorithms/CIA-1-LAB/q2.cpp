#include <iostream>
#include <vector>
using namespace std;

vector<int> merge(vector<int> &arr1, vector<int> &arr2) {
  int n1 = arr1.size();
  int n2 = arr2.size();

  vector<int> temp;

  int left = 0;
  int right = 0;

  while (left < n1 && right < n2) {
    if (arr1[left] < arr2[right])
      temp.push_back(arr1[left++]);
    else
      temp.push_back(arr2[right++]);
  }

  while (left < n1) temp.push_back(arr1[left++]);
  while (right < n2) temp.push_back(arr2[right++]);

  return temp;
}

int main() {
  vector<vector<int>> mat = {
      {2, 5, 6, 8, 9},
      {4, 7, 9},
      {1, 2, 2, 4, 8},
      {1, 1, 1, 1, 5}
    };

  while (mat.size() != 1) {
    vector<int> arr1 = mat.back();
    mat.pop_back();
    vector<int> arr2 = mat.back();
    mat.pop_back();

    vector<int> temp = merge(arr1, arr2);
    mat.push_back(temp);
  }

  for (int i = 0; i < mat[0].size(); i++) {
    cout << mat[0][i] << " ";
  }

  return 0;
}