#include <algorithm>
#include <cmath>
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
  int n;
  int m;
  cout << "No of elements in larger arr :";
  cin >> n;

  cout << "No of sub arr :";
  cin >> m;

  vector<int> largerArr(n, 0);
  cout << "Enter the elements :" << endl;
  for (int i = 0; i < n; i++)
    cin >> largerArr[i];

  double n3 = (double)n / m;
  int size_of_subarr = ceil(n3);

  vector<vector<int>> mat(m);

  for (int i = 0; i < n; i++)
    mat[i / size_of_subarr].push_back(largerArr[i]);

  // for (int i = 0; i < m; i++)
  //   sort(mat[i].begin(), mat[0].end());

  while (mat.size() > 1) {
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
