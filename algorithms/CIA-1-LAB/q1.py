import numpy as np


def add_matrices(A, B):
    return A + B


def sub_matrices(A, B):
    return A - B


def strassen(A, B):
    n = len(A)
    if n == 1:
        return A * B
    else:
        mid = n // 2
        A11 = A[:mid, :mid]
        A12 = A[:mid, mid:]
        A21 = A[mid:, :mid]
        A22 = A[mid:, mid:]

        B11 = B[:mid, :mid]
        B12 = B[:mid, mid:]
        B21 = B[mid:, :mid]
        B22 = B[mid:, mid:]

        M1 = strassen(add_matrices(A11, A22), add_matrices(B11, B22))
        M2 = strassen(add_matrices(A21, A22), B11)
        M3 = strassen(A11, sub_matrices(B12, B22))
        M4 = strassen(A22, sub_matrices(B21, B11))
        M5 = strassen(add_matrices(A11, A12), B22)
        M6 = strassen(sub_matrices(A21, A11), add_matrices(B11, B12))
        M7 = strassen(sub_matrices(A12, A22), add_matrices(B21, B22))

        C11 = add_matrices(sub_matrices(add_matrices(M1, M4), M5), M7)
        C12 = add_matrices(M3, M5)
        C21 = add_matrices(M2, M4)
        C22 = add_matrices(sub_matrices(add_matrices(M1, M3), M2), M6)

        C = np.vstack((np.hstack((C11, C12)), np.hstack((C21, C22))))

        return C


# check if the given matrix is square and multiple of 2 if not then return nearest power 2
def next_power_of_2(n):
    power = 2
    while power < n:
        power *= 2
    return power


# pad the matrix with zeros if not square and multiple of 2
def pad(matrix, new_size):
    n = max(matrix.shape)
    new_matrix = np.zeros((new_size, new_size), dtype=matrix.dtype)
    new_matrix[: matrix.shape[0], : matrix.shape[1]] = matrix
    return new_matrix


# Example usage:
A = np.array([[1, 2, 3], [3, 4, 6]])
B = np.array([[5, 6, 1], [7, 8, 7]])

n = max([n for n in A.shape] + [n for n in B.shape])
n = next_power_of_2(n)
A = pad(A, n)
B = pad(B, n)

C = strassen(A, B)
print("Matrix A:")
print(A)
print("Matrix B:")
print(B)
print("Resultant Matrix C:")
print(C)
