---
sidebar_position: 4
description:
  Big O notation, complexity classes, arrays, linked lists, stacks, queues, hash
  tables, trees and graphs with the cost of their operations
---

# Algorithms and Data Structures

An **algorithm** is a finite sequence of steps that solves a problem. Its cost
is described with **Big O notation**: an **upper bound** on how running time (or
memory) **grows** with the input size _n_, ignoring constants. O(1) does not
depend on _n_, O(_n_) grows linearly, O(_n_²) quadratically. Big O is usually
quoted for the worst case, but it is a bound, not a case: best, average and
worst cases each have their own bound. A **data structure** is a way to organize
data; the choice decides which operations are cheap.

## Details

### Complexity Classes

| Notation           | Name         | Example                                      |
| ------------------ | ------------ | -------------------------------------------- |
| O(1)               | Constant     | Access an array element by index             |
| O(log _n_)         | Logarithmic  | Binary search in a sorted array              |
| O(_n_)             | Linear       | Linear search, one loop over the input       |
| O(_n_ log _n_)     | Linearithmic | Merge sort, `Array.prototype.sort`           |
| O(_n_²)            | Quadratic    | Bubble sort, two nested loops over the input |
| O(2<sup>_n_</sup>) | Exponential  | Naive recursive Fibonacci                    |
| O(_n_!)            | Factorial    | Generating all permutations                  |

### Operations by Structure

Average case.

| Structure    | Access         | Search     | Insert / delete                               | Notes                                                  |
| ------------ | -------------- | ---------- | --------------------------------------------- | ------------------------------------------------------ |
| Array        | O(1)           | O(_n_)     | O(1) at the end (amortized), O(_n_) elsewhere | Elements shift on insert in the middle                 |
| Linked list  | O(_n_)         | O(_n_)     | O(1) at a known node                          | No index; finding the node is O(_n_)                   |
| Stack (LIFO) | —              | —          | O(1) `push` / `pop` at the top                | Call stack, undo, backtracking                         |
| Queue (FIFO) | —              | —          | O(1) enqueue / dequeue                        | Task queues, breadth-first search                      |
| Hash table   | —              | O(1)       | O(1)                                          | `Map`, `Set`, objects; O(_n_) worst case on collisions |
| Balanced BST | —              | O(log _n_) | O(log _n_)                                    | Sorted order; O(_n_) if unbalanced                     |
| Heap         | O(1) min / max | O(_n_)     | O(log _n_)                                    | Priority queue                                         |

In JavaScript, a queue built on an array with `shift()` is O(_n_) per dequeue:
the remaining elements are reindexed. For large queues, use a linked list or two
indices.

### Trees and Graphs

- A **tree** is a hierarchy of nodes with one root and no cycles: the DOM, a
  file system, a component tree. In a **binary search tree**, the left subtree
  is smaller than the node and the right one larger.
- A **graph** is nodes (vertices) connected by edges, **directed** or
  **undirected**, possibly with cycles: social networks, routes, module
  dependencies.
- Traversal: **depth-first search** (DFS) goes as deep as possible first (a
  stack or recursion); **breadth-first search** (BFS) visits neighbors level by
  level (a queue) and finds the shortest path in an unweighted graph. Both are
  O(V + E).

## Example

<details>
<summary>Binary search: O(log n)</summary>

```javascript
function binarySearch(sorted, target) {
  let low = 0;
  let high = sorted.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (sorted[mid] === target) return mid;
    if (sorted[mid] < target) low = mid + 1;
    else high = mid - 1;
  }

  return -1;
}

console.log(binarySearch([1, 3, 5, 7, 9, 11], 7)); // 3
console.log(binarySearch([1, 3, 5, 7, 9, 11], 4)); // -1
```

</details>

<details>
<summary>O(n²) → O(n) with a Set</summary>

```javascript
// O(n²): includes() scans the array for every element
function hasDuplicatesSlow(items) {
  return items.some((item, i) => items.slice(i + 1).includes(item));
}

// O(n): Set lookups are O(1) on average
function hasDuplicates(items) {
  return new Set(items).size !== items.length;
}

console.log(hasDuplicatesSlow([1, 2, 3, 2]), hasDuplicates([1, 2, 3, 2])); // true true
console.log(hasDuplicates([1, 2, 3])); // false
```

</details>

## Follow-up Questions

- Why drop constants in Big O? It describes growth: for large _n_, O(_n_) beats
  O(_n_²) whatever the constants. For small inputs, the constants can matter
  more.
- What is space complexity? The extra memory an algorithm needs as a function of
  _n_: merge sort needs O(_n_), an in-place sort O(1) or O(log _n_).
- What is the complexity of `Array.prototype.sort`? O(_n_ log _n_); V8 uses
  TimSort, which is also stable.

## Common Mistakes

- Calling Big O "the worst case": it is an upper bound and can describe any
  case.
- Forgetting the hidden loops: `includes`, `indexOf`, `shift`, `splice` inside a
  loop turn O(_n_) into O(_n_²).
