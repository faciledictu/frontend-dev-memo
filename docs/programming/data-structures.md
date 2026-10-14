---
sidebar_position: 4
description:
  Big O, Omega and Theta, complexity classes, abstract data types, arrays,
  linked lists, stacks, queues, hash tables, trees, heaps, graphs, sorting,
  search and common algorithmic techniques
---

# Algorithms and Data Structures

An **algorithm** is a precise, finite sequence of steps that turns an input into
a result, like a recipe. A **data structure** is a way to store data in memory
so that certain operations are fast: an array finds an element by position
instantly, a hash table finds it by key. Algorithms are compared by how their
cost **grows** as the input grows, written in **Big O notation**: O(_n_) means
the work grows at most proportionally to the input size _n_, O(_n_²) — at most
as its square, O(1) — stays below a constant whatever _n_ is. Formally Big O is
an **upper bound** on growth, with constant factors ignored; it is usually
quoted for the worst case, but it is a bound, not a case.

## Details

### Measuring Complexity

- **Time complexity** counts basic steps (comparisons, assignments) as a
  function of the input size _n_; **space complexity** counts the extra memory.
- **Formal definition**: _f_(_n_) = O(_g_(_n_)) if there are constants _c_ > 0
  and _n₀_ such that _f_(_n_) ≤ _c_ · _g_(_n_) for all _n_ ≥ _n₀_. In words:
  from some size on, _f_ grows no faster than _g_ up to a constant factor.
- _f_ = Ω(_g_) if _f_(_n_) ≥ _c_ · _g_(_n_) for some _c_ > 0 and all _n_ ≥ _n₀_
  (grows at least as fast); _f_ = Θ(_g_) if it is both O(_g_) and Ω(_g_).
- **log _n_** in plain words: how many times _n_ can be halved until 1 is left.
  log₂ 1,000 ≈ 10, log₂ 1,000,000 ≈ 20: doubling the input adds one step.

| Notation | Bound                               | Reads as                |
| -------- | ----------------------------------- | ----------------------- |
| O(_g_)   | Upper: grows **no faster** than _g_ | "at most of order _g_"  |
| Ω(_g_)   | Lower: grows **no slower** than _g_ | "at least of order _g_" |
| Θ(_g_)   | Tight: both O(_g_) and Ω(_g_)       | "exactly of order _g_"  |

In everyday speech "O" is often used where Θ is meant: "binary search is O(log
_n_)" means that in the worst case it grows exactly like log _n_ (in the best
case it finds the element at once).

Rules for computing Big O:

- Drop constant factors and lower-order terms: 3_n_² + 5_n_ + 2 → O(_n_²).
- Steps in sequence **add**: O(_n_) + O(_n_²) = O(_n_²).
- Nested loops **multiply**: a loop over _n_ inside a loop over _m_ is O(_n_ ·
  _m_).
- The base of a logarithm does not matter: log₂ _n_ and log₁₀ _n_ differ by a
  constant factor.

Kinds of cost:

- **Best, average and worst case**: different inputs of the same size cost
  differently. Quicksort is Θ(_n_ log _n_) on average and Θ(_n_²) in the worst
  case.
- **Amortized** cost is the worst-case total cost of **any** sequence of _n_
  operations divided by _n_: a guarantee, not an average over random inputs.
  `push` into a dynamic array is occasionally O(_n_) (copying into a bigger
  buffer), but O(1) amortized.
- Recursion costs memory too: each pending call takes a stack frame, so a
  recursion of depth _d_ uses O(_d_) space.

### Complexity Classes

| Notation           | Name         | Example                                          | _n_ = 1,000 → steps |
| ------------------ | ------------ | ------------------------------------------------ | ------------------- |
| O(1)               | Constant     | Array element by index, `Map.get` (in practice)  | 1                   |
| O(log _n_)         | Logarithmic  | Binary search in a sorted array                  | ~10                 |
| O(_n_)             | Linear       | Linear search, one loop over the input           | 1,000               |
| O(_n_ log _n_)     | Linearithmic | Merge sort, `Array.prototype.sort`               | ~10,000             |
| O(_n_²)            | Quadratic    | Bubble sort, two nested loops over the input     | 1,000,000           |
| O(2<sup>_n_</sup>) | Exponential  | All subsets; naive Fibonacci (tightly Θ(1.618ⁿ)) | ~10³⁰¹              |
| O(_n_!)            | Factorial    | Generating all permutations                      | ~10²⁵⁶⁷             |

### Abstract Data Types and Data Structures

- An **abstract data type** (ADT) defines **what** operations are available and
  what they do: a stack has `push` and `pop`, a map has `get` and `set`.
- A **data structure** is **how** it is implemented in memory: a stack can be
  built on an array or on a linked list.

| ADT            | Operations                                                                                 | Typical implementation     | In JavaScript               |
| -------------- | ------------------------------------------------------------------------------------------ | -------------------------- | --------------------------- |
| List           | Access by position, insert, delete                                                         | Dynamic array, linked list | `Array`                     |
| Stack (LIFO)   | `push`, `pop`, `peek` — last in, first out (undo, the browser's Back, the call stack)      | Array                      | `Array` with `push` / `pop` |
| Queue (FIFO)   | `enqueue`, `dequeue` — first in, first out (a line at a shop, the event loop's task queue) | Linked list, ring buffer   | No built-in; see below      |
| Map            | `get`, `set`, `delete` by key (a dictionary: word → definition)                            | Hash table, balanced tree  | `Map`, plain objects        |
| Set            | `add`, `has`, `delete`, unique values                                                      | Hash table                 | `Set`                       |
| Priority queue | Insert, take the min / max                                                                 | Binary heap                | No built-in                 |

### Operations by Structure

Average case unless stated.

| Structure    | Access by index | Search     | Insert / delete                              | Notes                                                                                       |
| ------------ | --------------- | ---------- | -------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Array        | O(1)            | O(_n_)     | O(1) amortized at the end, O(_n_) elsewhere  | Elements after the position shift                                                           |
| Sorted array | O(1)            | O(log _n_) | O(_n_)                                       | Binary search; inserting keeps the order by shifting                                        |
| Linked list  | O(_n_)          | O(_n_)     | O(1) at a known node                         | Finding the node is O(_n_); deleting needs the previous node (O(1) in a doubly linked list) |
| Hash table   | —               | O(1)       | O(1)                                         | O(_n_) worst case when all keys collide                                                     |
| BST          | —               | O(log _n_) | O(log _n_)                                   | Keeps keys sorted; O(_n_) in the worst case if unbalanced                                   |
| Binary heap  | —               | O(_n_)     | Insert O(log _n_), take min / max O(log _n_) | Peek at the min / max is O(1)                                                               |

### Cost of Common JavaScript Operations

| Operation                                                       | Cost                    |
| --------------------------------------------------------------- | ----------------------- |
| `arr[i]`, `arr.length`, `push`, `pop`                           | O(1) (`push` amortized) |
| `shift`, `unshift`, `splice`, `includes`, `indexOf`, `find`     | O(_n_)                  |
| `slice`, spread `[...arr]`, `concat`, `map`, `filter`, `reduce` | O(_n_)                  |
| `sort`, `toSorted`                                              | O(_n_ log _n_)          |
| `Map` / `Set`: `get`, `set`, `has`, `add`, `delete`             | O(1) average            |
| Object property read or write                                   | O(1) average            |
| `Object.keys`, `JSON.stringify`, `structuredClone`              | O(size of the object)   |

### Arrays and Linked Lists

- A classic **array** is a block of **contiguous memory**: the address of
  element _i_ is computed directly, so access is O(1), but inserting in the
  middle shifts the rest.
- A **dynamic array** grows by allocating a bigger block and copying. The growth
  must be **geometric** (1.5–2 times larger) for `push` to be O(1) amortized;
  growing by a fixed amount would make it O(_n_).
- JavaScript arrays are objects; engines store dense arrays contiguously, but
  switch to slower dictionary storage for sparse arrays (`arr[1_000_000] = 1` on
  an empty array).
- A **linked list** stores each element in a node with a pointer to the next
  (**singly linked**) or to the next and previous (**doubly linked**). Inserting
  or removing at a known node is O(1); access by index walks the list.
- In JavaScript, `shift()` on an array is O(_n_): the remaining elements are
  reindexed. A large queue is better built on a linked list or an array with a
  head index.

### Hash Tables

- A **hash function** turns a key into a number; the number modulo the table
  size is the index of a **bucket** where the value is stored.
- A **collision** is two keys in the same bucket. It is resolved by **chaining**
  (a list per bucket) or **open addressing** (probe other slots in a fixed
  sequence until a free one is found).
- When the table fills up (the **load factor** passes a threshold), it is
  resized and all entries are rehashed: O(_n_) once, O(1) amortized.
- `Map` vs plain object: `Map` accepts any key (objects, functions), keeps pure
  insertion order, has `size`, and is optimized for frequent additions and
  deletions. Object keys are only strings and symbols, and their order puts
  integer-like keys first: `Object.keys({ b: 1, 2: 1, a: 1 })` is
  `['2', 'b', 'a']`.

### Trees

- A **tree** is a connected hierarchy of nodes without cycles: one **root**, and
  every other node has exactly one **parent**. A node without children is a
  **leaf**; the **height** is the longest path from the root to a leaf.
  Examples: the DOM, a file system, a component tree, an AST (the syntax tree a
  compiler builds from code).
- A **binary tree**: each node has at most two children.
- A **binary search tree** (BST): for every node, the keys in the left subtree
  are smaller and in the right subtree larger, so search goes down one path —
  O(height). **Balanced** trees (AVL, red-black) keep the height O(log _n_).
- A **heap** is a complete binary tree where each parent is ≤ its children
  (min-heap) or ≥ them (max-heap); the minimum is always at the root. It is
  stored in an array: the children of index _i_ are at 2_i_ + 1 and 2_i_ + 2,
  the parent at ⌊(_i_ − 1) / 2⌋. Building a heap from _n_ elements is O(_n_).
  This data structure is unrelated to the "heap" in memory management.
- A **trie** (prefix tree) stores strings character by character along paths:
  autocomplete, search by prefix.

### Graphs

- A **graph** is a set of **vertices** connected by **edges**: **directed** or
  **undirected**, **weighted** or not, with or without cycles. Examples: social
  networks, routes, links between pages.
- A **DAG** (directed acyclic graph) has no cycles: module dependencies, task
  dependencies. **Topological sort** orders its vertices so that for every edge
  _u_ → _v_, _u_ comes before _v_.
- Representations: an **adjacency list** (for each vertex, a list of its
  neighbors; O(V + E) memory, good for sparse graphs) or an **adjacency matrix**
  (a V × V table; O(V²) memory, O(1) to check one edge).
- Traversal, both O(V + E) with an adjacency list (O(V²) with a matrix):
  - **Depth-first search** (DFS) goes as deep as possible before backtracking;
    uses a stack or recursion. Finds cycles, used for topological sort.
  - **Breadth-first search** (BFS) visits vertices level by level; uses a queue.
    Finds the **shortest path in an unweighted graph**.
- Shortest paths in a weighted graph with non-negative weights: **Dijkstra's
  algorithm**, O((V + E) log V) with a binary heap.

### Sorting

| Algorithm      | Best           | Average        | Worst          | Extra memory | Stable | Idea                                                                               |
| -------------- | -------------- | -------------- | -------------- | ------------ | ------ | ---------------------------------------------------------------------------------- |
| Bubble sort    | O(_n_)         | O(_n_²)        | O(_n_²)        | O(1)         | Yes    | Swap neighbors until nothing changes                                               |
| Selection sort | O(_n_²)        | O(_n_²)        | O(_n_²)        | O(1)         | No     | Find the minimum of the rest, put it next                                          |
| Insertion sort | O(_n_)         | O(_n_²)        | O(_n_²)        | O(1)         | Yes    | Insert each element into the sorted part; fast on nearly sorted data               |
| Merge sort     | O(_n_ log _n_) | O(_n_ log _n_) | O(_n_ log _n_) | O(_n_)       | Yes    | Split in halves, sort them, merge                                                  |
| Quicksort      | O(_n_ log _n_) | O(_n_ log _n_) | O(_n_²)        | O(log _n_)\* | No     | Partition around a pivot, sort the parts                                           |
| Heapsort       | O(_n_ log _n_) | O(_n_ log _n_) | O(_n_ log _n_) | O(1)         | No     | Build a heap, take the max repeatedly                                              |
| TimSort        | O(_n_)         | O(_n_ log _n_) | O(_n_ log _n_) | O(_n_)       | Yes    | Find sorted runs, extend short ones with insertion sort, merge runs; V8 since 2018 |

\* Quicksort's stack is O(log _n_) on average, or always when it recurses into
the smaller part first; otherwise O(_n_) in the worst case.

- A **stable** sort keeps equal elements in their original order: sort users by
  name, then stably by age — users of the same age stay sorted by name.
- Any comparison-based sort needs Ω(_n_ log _n_) comparisons in the worst (and
  average) case. Non-comparison sorts (counting sort, radix sort) can be O(_n_)
  for integer keys from a small range.
- `Array.prototype.sort` is stable since ES2019 and, without a comparator,
  compares elements **as strings**: `[10, 9, 1].sort()` gives `[1, 10, 9]`. Pass
  `(a, b) => a - b` for numbers. See [Arrays](../javascript/arrays.md).

### Common Techniques

| Technique           | Idea                                                                                                                                       | Typical task                                          |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------- |
| Hash map lookup     | Trade memory for time: remember what was seen in a `Map` / `Set`                                                                           | Two sum, duplicates, counting                         |
| Two pointers        | Move two indices toward each other or at different speeds                                                                                  | Pairs in a sorted array, palindromes, cycle in a list |
| Sliding window      | Keep a window over the array and update it incrementally                                                                                   | Longest substring without repeats                     |
| Divide and conquer  | Split the problem, solve the parts recursively, combine                                                                                    | Merge sort; binary search (decrease and conquer)      |
| Dynamic programming | For problems with optimal substructure and overlapping subproblems: solve each subproblem once, reuse the results (memoization or a table) | Fibonacci, edit distance, knapsack                    |
| Greedy              | Take the locally best choice at each step; correct only for some problems                                                                  | Interval scheduling                                   |

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

<details>
<summary>BFS: shortest path in an unweighted graph</summary>

```javascript
const graph = {
  A: ['B', 'C'],
  B: ['D'],
  C: ['D', 'E'],
  D: ['F'],
  E: ['F'],
  F: [],
};

function shortestPath(graph, start, goal) {
  const queue = [start];
  const parent = new Map([[start, null]]); // also marks visited vertices

  for (let head = 0; head < queue.length; head++) {
    const node = queue[head]; // a head index instead of shift(): O(1)
    if (node === goal) {
      const path = [];
      for (let v = goal; v !== null; v = parent.get(v)) path.unshift(v);
      return path;
    }

    for (const next of graph[node]) {
      if (!parent.has(next)) {
        parent.set(next, node);
        queue.push(next);
      }
    }
  }

  return null;
}

console.log(shortestPath(graph, 'A', 'F')); // [ 'A', 'B', 'D', 'F' ]
```

</details>

<details>
<summary>Dynamic programming: Fibonacci from O(2ⁿ) to O(n)</summary>

```javascript
// O(2ⁿ): the same values are computed again and again
const fibSlow = (n) => (n < 2 ? n : fibSlow(n - 1) + fibSlow(n - 2));

// O(n): each value is computed once
function fib(n) {
  let [prev, curr] = [0, 1];
  for (let i = 0; i < n; i++) [prev, curr] = [curr, prev + curr];
  return prev;
}

console.log(fibSlow(20), fib(20), fib(50)); // 6765 6765 12586269025
```

</details>

## Follow-up Questions

- Why drop constants in Big O? It describes growth: for large _n_, O(_n_) beats
  O(_n_²) whatever the constants. For small inputs, the constants can matter
  more: insertion sort beats merge sort on a dozen elements.
- O vs Θ? O is an upper bound, Θ is a tight bound. Linear search is also O(_n_²)
  (an upper bound need not be tight), but Θ(_n_) in the worst case.
- Why is a hash table lookup O(1) only on average? On average each bucket holds
  a constant number of keys; if many keys collide, a lookup scans a long bucket,
  up to O(_n_).
- What is the complexity of `Array.prototype.sort`? O(_n_ log _n_); V8 uses
  TimSort, which is stable.
- When is a linked list better than an array? When elements are often inserted
  or removed in the middle at a known position, and access by index is rare. In
  practice JS arrays win in most cases because of memory locality.

## Common Mistakes

- Calling Big O "the worst case": it is an upper bound and can describe any
  case.
- Forgetting the hidden loops: `includes`, `indexOf`, `shift`, `splice` inside a
  loop turn O(_n_) into O(_n_²).
- Saying a linked list inserts in O(1) without adding "at a known node".
- Sorting numbers with `sort()` without a comparator.

## See Also

- [Arrays](../javascript/arrays.md)
- "Introduction to Algorithms" by Cormen, Leiserson, Rivest and Stein — the
  standard textbook.
- [VisuAlgo](https://visualgo.net/) — animated data structures and algorithms.
