---
sidebar_position: 2.5
---

# Virtual DOM

Operations on the real DOM can be slow and resource-intensive. So libraries like
React uses the Virtual DOM whis is a lightweight copy of the real DOM one.

It acts as an intermediary, allowing efficient updates to the user interface.
When a change occurs in the application's state, the Virtual DOM updates first.
The framework then compares the new Virtual DOM with the previous version to
identify what has changed.

After identifying the differences, the framework updates the real DOM only in
the places where changes have occurred.

This approach enhances performance, simplifies development, and ensures
cross-browser compatibility.
