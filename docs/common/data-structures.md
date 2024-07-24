---
sidebar_position: 4
---

# Alogrithms and Data Structures

## Algorithms

:::info Algorithm

Algorithm is a sequence of well-defined instructions designed to solve a problem
efficiently. Algorithms can range from simple to complex, and they are essential
in programming for tasks like searching, sorting, and data manipulation.

:::

### Complexity of Algorithms

Big O notation, denoted as **O()**, is used to describe the upper bound, or
worst case, performance or complexity of an algorithm.

We need Big O notation because it provides a standardized way of comparing the
efficiency of algorithms. It helps to understand how the algorithm's performance
scales with increasing input.

#### Examples of Time Complexity

| Notation           | Explanation                  | Examples                                                   |
| ------------------ | ---------------------------- | ---------------------------------------------------------- |
| O(1)               | Constant Time Complexity     | Accessing an element in an array by index                  |
| O(log _n_)         | Logarithmic Time Complexity  | Binary Search                                              |
| O(_n_ log _n_)     | Linearithmic Time Complexity | Merge Sort                                                 |
| O(_n_)             | Linear Time Complexity       | Linear search in an unsorted array                         |
| O(_n²_)            | Quadratic Time Complexity    | Bubble Sort                                                |
| O(2<sup>_n_</sup>) | Exponential Time Complexity  | Recursive Fibonacci algorithm without memoization          |
| O(_n_!)            | Factorial Time Complexity    | Brute-force solution for finding all permutations of a set |

## Data Structures

### Arrays

Arrays are a collection of elements stored in contiguous memory locations. They
offer constant-time access to elements but can be inefficient for insertion and
deletion operations as they may require shifting elements.

### Linked Lists

Linked lists consist of nodes where each node points to the next node in the
sequence. They allow for efficient insertion and deletion operations but have
slower access times compared to arrays as elements are not stored in contiguous
memory locations.

### Stacks

A stack is a _Last In, First Out (LIFO)_ data structure where elements are
inserted and removed from the same end, called the top. It supports operations
like `push` (insert) and `pop` (remove).

Stacks are commonly used in programming languages for function calls, expression
evaluation, and backtracking algorithms.

### Queues

A queue is a _First In, First Out (FIFO)_ data structure where elements are
inserted at the rear end and removed from the front end. It supports operations
like `enqueue` (insert) and `dequeue` (remove).

Queues are used in scenarios like task scheduling, message passing, and
breadth-first search algorithms.

### Trees

Trees are hierarchical data structures consisting of _nodes_ connected by
_edges_. They have a _root node_ at the top and may have multiple levels of
_child nodes_ branching out from it.

Trees are used in various applications, such as representing hierarchical data
(e.g., file systems), organizing data for efficient searching and sorting, and
implementing decision-making algorithms.

### Graphs

Graphs are collections of nodes (vertices) and edges that connect pairs of
nodes. They can be _directed_ (edges have a specific direction) or _undirected_
(edges have no direction).

Graphs are versatile data structures used to model relationships between
entities, such as social networks, transportation networks, and computer
networks.
