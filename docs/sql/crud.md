---
sidebar_position: 6
---

# CRUD operations

:::info

CRUD is an acronym that stands for Create, Read, Update, and Delete, which are
the four basic operations that can be performed on data in a database.

:::

CRUD operations are fundamental to managing and interacting with data in any
database management system (DBMS). Each operation can be related to SQL
statements.

1. Create

   SQL Statement: `INSERT`

   Adds new data or records to a database.

   ```sql
   INSERT INTO employees (first_name, last_name, email) VALUES ('John', 'Doe', 'john.doe@example.com');
   ```

   This statement adds a new record to the _employees_ table with the specified
   values for _first_name_, _last_name_, and _email_.

2. Read

   SQL Statement: `SELECT`

   Retrieves or queries data from a database.

   ```sql
   SELECT first_name, last_name FROM employees WHERE department = 'Sales';
   ```

   This statement _retrieves_ the _first_name_ and _last_name_ of employees who
   work in the _Sales_ department.

3. Update

   SQL Statement: `UPDATE`

   Modifies existing data within a database.

   ```sql
   UPDATE employees SET email = 'j.doe@example.com' WHERE first_name = 'John' AND last_name = 'Doe';
   ```

   This statement updates the email address of the employee named John Doe.

4. Delete

   SQL Statement: `DELETE`

   Removes data or records from a database.

   ```sql
   DELETE FROM employees WHERE last_name = 'Doe';
   ```

   This statement deletes all records from the _employees_ table where the
   _last_name_ is Doe.
