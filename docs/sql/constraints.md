---
sidebar_position: 2
---

# SQL Constraints

SQL constraints are rules enforced on data columns in a table to ensure data
integrity and consistency. They restrict the type of data that can go into a
table.

## `NOT NULL`

Ensures that a column cannot have a `NULL` value.

```sql
CREATE TABLE employees (
    id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    age INT
);
```

## `UNIQUE`

Ensures that all values in a column are unique.

```sql
CREATE TABLE employees (
    id INT NOT NULL UNIQUE,
    email VARCHAR(100) UNIQUE,
    name VARCHAR(100)
);
```

## `PRIMARY KEY`

A combination of NOT NULL and UNIQUE. It uniquely identifies each row in a
table. A table can have `only one` primary key.

```sql
CREATE TABLE employees (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    age INT
);
```

## `FOREIGN KEY`

Ensures the referential integrity of the data in one table to match values in
another table.

```sql
CREATE TABLE departments (
    id INT PRIMARY KEY,
    name VARCHAR(100)
);

CREATE TABLE employees (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES departments(id)
);
```

Here, `department_id` in the `employees` table must match an `id` in the
`departments` table.

## `CHECK`

Ensures that the value in a column meets a specific condition.

```sql
CREATE TABLE employees (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    age INT CHECK (age >= 18)
);
```

## `DEFAULT`

Sets a default value for a column when no value is specified.

```sql
CREATE TABLE employees (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    start_date DATE DEFAULT GETDATE()
);
```

If no value is provided for `start_date`, it defaults to the current date.
