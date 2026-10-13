---
sidebar_position: 13
description: What a garbage collector (GC) is and what it is used for
---

# Garbage collector

A garbage collector (GC) is a form of automatic memory management. The primary
purpose is to find and reclaim memory that is no longer in use by the program,
thus reducing memory leaks and optimizing memory usage. In essence, the garbage
collector monitors objects in a program, determines which objects are no longer
reachable (meaning they cannot be accessed or used by the program anymore), and
then frees the memory allocated to those objects for future use.

## Purposes

- Reduces Memory Leaks: By automatically cleaning up unused memory, it helps
  prevent your program from using more and more memory over time, which could
  slow it down or cause crashes. It cannot free memory that is still referenced,
  so leaks through live references are still possible.
- Improves Developer Productivity: Developers can focus on writing code without
  worrying about memory management.

## Approaches

- The most common approach is **Mark and Sweep**. It marks all reachable objects
  and then frees the memory of those that aren't marked.

- Some garbage collectors use **Reference Counting**, where each object has a
  count of the number of references to it. When an object's reference count
  drops to zero, it can be safely deallocated. However, this approach has
  limitations, particularly with cyclic references (where two or more objects
  reference each other but are otherwise unreachable).
