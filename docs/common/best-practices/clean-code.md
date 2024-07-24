---
sidebar_position: 3
description: The main principles according the book of Robert C. Martin
---

# Clean code

## Best Practices

The main principles of Robert C. Martin's "Clean Code".

1. **Meaningful Names**.
   - Choose clear, intention-revealing names.
   - Avoid misleading names and make names searchable.
2. **Functions**.
   - Keep functions small and focused on a single task.
   - Use descriptive names and minimize the number of parameters.
3. **Comments**.
   - Write comments that explain _why,_ not _what._
   - Avoid unnecessary or redundant comments.
4. **Formatting**.
   - Ensure code is well-organized and aesthetically pleasing.
   - Use consistent indentation and spacing.
5. **Error Handling**.
   - Prefer exceptions over return codes.
   - Handle errors appropriately and avoid returning null.
6. **Testing**.
   - Write clean, maintainable tests.
   - Use descriptive names for tests and aim for high test coverage.
7. **Classes**.
   - Keep classes small and focused on a single responsibility.
   - Use meaningful names and encapsulate details.
8. **Systems**.
   - Separate system construction from usage.
   - Manage dependencies through dependency injection.
9. **Concurrency**.
   - Isolate concurrency-related code.
   - Avoid shared mutable data and use thread-safe structures.
10. **Source Code Structure**.
    - Organize code logically with clear file and directory naming conventions.

These principles aim to make code more readable, maintainable, and efficient,
leading to higher-quality software and a smoother development process.

## Antipatterns

These antipatterns are addressed throughout "Clean Code" with the goal of
encouraging practices that lead to more maintainable, understandable, and robust
code. The book emphasizes the importance of writing clean, simple, and focused
code, avoiding these common pitfalls.

1. **The God Class**

   A class that knows too much or does too much. It usually ends up being a
   catch-all for functionality, violating the Single Responsibility Principle.

2. **Duplicated Code**

   Code that is repeated in multiple places. This leads to difficulties in
   maintenance and increases the risk of bugs, as changes need to be replicated
   in all locations.

3. **Long Methods**

   Methods that are excessively long, making them hard to understand and
   maintain. Clean Code advocates for short, single-purpose methods.

4. **Large Classes**

   Classes that contain too much functionality, becoming difficult to manage.
   They often indicate a need for refactoring into smaller, more cohesive
   classes.

5. **Feature Envy**

   When a method in one class is more interested in the data of another class
   than its own data, leading to tight coupling and low cohesion.

6. **Inappropriate Intimacy**

   When one class is too familiar with the inner workings of another class,
   leading to strong coupling and making changes more difficult.

7. **Primitive Obsession**

   The use of primitive data types to represent domain ideas instead of creating
   specific types that better represent the concepts and provide more meaning.

8. **Data Clumps**

   Groups of data items that tend to be passed around together, indicating they
   might belong in their own class.

9. **Switch Statements**

   Overuse of switch statements can lead to code duplication and difficulty in
   maintaining the code, suggesting the need for polymorphism to handle such
   cases.

10. **Speculative Generality**

    Writing code to handle cases that don't exist yet, leading to unnecessary
    complexity and maintenance overhead.

11. **Temporary Field**

    Fields that are set only in certain circumstances, making the class harder
    to understand and maintain.

12. **Comments**

    Over-reliance on comments to explain what the code does instead of writing
    self-explanatory code. Comments should be used to explain why something is
    done, not what is done.
