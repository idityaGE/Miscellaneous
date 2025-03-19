#include <iostream>
#include <queue>
#include <vector>
using namespace std;

int minComputation(vector<int> &files) {
  priority_queue<int, vector<int>, greater<int> > pq;

  for (auto file : files)
    pq.push(file);

  int bagSize = 0;
  while (pq.size() != 1) {
    int num1 = pq.top();
    pq.pop();
    int num2 = pq.top();
    pq.pop();
    int temp = num1 + num2;
    bagSize += temp;
    pq.push(temp);
  }
  return bagSize;
}

int main() {
  vector<int> files = {23, 1, 7, 14, 9, 5, 19};

  int bagSize = minComputation(files);

  cout << "Minimum Bag size required :" << bagSize << endl;

  return 0;
}
