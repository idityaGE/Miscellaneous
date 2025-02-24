#include <iostream>
#include <vector>
using namespace std;

void printArr(int arr[], int n) {
  for (int i = 0; i < n; i++)
    cout << arr[i] << " ";
  cout << endl;
}

// #=== Insertion ===#
void insertionSort(int arr[], int n) {
  for (int i = 1; i < n; i++)
    for (int j = i; j > 0; j--)
      if (arr[j] < arr[j - 1])
        swap(arr[j], arr[j - 1]);
      else
        break;
}

// #=== Selection ===#
void seclectionSort(int arr[], int n) {
  for (int i = 0; i < n - 1; i++) {
    int minIdx = i;
    for (int j = i + 1; j < n; j++)
      if (arr[j] < arr[minIdx])
        minIdx = j;
    swap(arr[i], arr[minIdx]);
  }
}

// #=== Bubble ===#
void bubbleSort(int arr[], int n) {
  for (int i = 0; i < n - 1; i++) {
    bool isSwapped = false;
    for (int j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        isSwapped = true;
        swap(arr[j], arr[j + 1]);
      }
    }
    if (!isSwapped) break;
  }
}

// #=== Merge ===#
void merge(int arr[], int low, int mid, int high) {
  vector<int> temp;
  int left = low;
  int right = mid + 1;

  while (left <= mid && right <= high) {
    if (arr[left] <= arr[right])
      temp.push_back(arr[left++]);
    else
      temp.push_back(arr[right++]);
  }

  while (left <= mid)
    temp.push_back(arr[left++]);
  while (right <= high)
    temp.push_back(arr[right++]);

  for (int i = low; i <= high; i++)
    arr[i] = temp[i - low];
}

void mergeSort(int arr[], int low, int high) {
  if (low >= high) return;
  int mid = low + (high - low) / 2;
  mergeSort(arr, low, mid);
  mergeSort(arr, mid + 1, high);
  merge(arr, low, mid, high);
}

// #=== Quick ===#
int partition(int arr[], int low, int high) {
  int pivot = arr[low];
  int i = low, j = high;
  while (i < j) {                                  // For decending order
    while (arr[i] <= pivot && i <= high - 1) i++;  // `arr[i] >= pivot`
    while (arr[j] >= pivot && j >= low + 1) j--;   // `arr[i] <= pivot`
    if (i < j) swap(arr[i], arr[j]);
  }
  swap(arr[low], arr[j]);
  return j;
}

void quickSort(int arr[], int low, int high) {
  if (low < high) {
    int partIdx = partition(arr, low, high);
    quickSort(arr, low, partIdx - 1);
    quickSort(arr, partIdx + 1, high);
  }
}

// #=== Count ===#
void countSort(int arr[], int n) {
  int M = 0;
  for (int i = 0; i < n; i++)
    M = max(M, arr[i]);

  int count[M + 1] = {0};

  for (int i = 0; i < n; i++)
    count[arr[i]]++;

  for (int i = 1; i <= M; i++)
    count[i] += count[i - 1];

  int output[n];

  for (int i = n - 1; i >= 0; i--) {
    output[count[arr[i]] - 1] = arr[i];
    count[arr[i]]--;
  }

  for (int i = 0; i < n; i++)
    arr[i] = output[i];
}

// #=== Radix ===#
void countingSort(int arr[], int n, int exp) {
  vector<int> output(n);
  vector<int> count(10, 0);

  for (int i = 0; i < n; i++)
    count[(arr[i] / exp) % 10]++;

  for (int i = 1; i < 10; i++)
    count[i] += count[i - 1];

  for (int i = n - 1; i >= 0; i--) {
    output[count[(arr[i] / exp) % 10] - 1] = arr[i];
    count[(arr[i] / exp) % 10]--;
  }

  for (int i = 0; i < n; i++)
    arr[i] = output[i];
}

void radixSort(int arr[], int n) {
  int M = arr[0];
  for (int i = 1; i < n; i++)
    if (arr[i] > M)
      M = arr[i];

  for (int exp = 1; M / exp > 0; exp *= 10)
    countingSort(arr, n, exp);
}

// #=== Heap ===#
void heapify(int arr[], int n, int i) {
  int largest = i;        // Initialize largest as root
  int left = 2 * i + 1;   // left = 2*i + 1
  int right = 2 * i + 2;  // right = 2*i + 2

  if (left < n && arr[left] > arr[largest])
    largest = left;

  if (right < n && arr[right] > arr[largest])
    largest = right;

  if (largest != i) {
    swap(arr[i], arr[largest]);
    heapify(arr, n, largest);
  }
}

void heapSort(int arr[], int n) {
  for (int i = n / 2 - 1; i >= 0; i--)
    heapify(arr, n, i);
  for (int i = n - 1; i > 0; i--) {
    swap(arr[0], arr[i]);
    heapify(arr, i, 0);
  }
}

int main() {
  int n;
  cin >> n;
  int arr[n];
  for (int i = 0; i < n; i++)
    cin >> arr[i];

  int low = 0;
  int high = n - 1;
  // selection_sort(arr, n);

  cout << "After Sort : " << endl;
  printArr(arr, n);
  return 0;
}