---
sidebar_position: 3
description:
  NOT NULL, UNIQUE, PRIMARY KEY, FOREIGN KEY with ON DELETE actions, CHECK and
  DEFAULT, and how NULL interacts with them
---

# SQL Constraints

**Constraints** are rules on table data that the database enforces on every
change (`INSERT`, `UPDATE`, and for foreign keys also `DELETE` of the parent
row): a statement that breaks one fails with an error, so invalid data cannot
get in regardless of which application writes it. The main ones: **`NOT NULL`**
(a value is required), **`UNIQUE`** (no duplicates), **`PRIMARY KEY`**
(`NOT NULL` + `UNIQUE`, one per table, identifies a row), **`FOREIGN KEY`** (the
value must exist in another table; `ON DELETE` says what happens to referencing
rows) and **`CHECK`** (an arbitrary condition). **`DEFAULT`** is not a
constraint but is defined the same way: the value used when none is given.

Applies to: PostgreSQL 18.

## Details

| Constraint    | Rule                                             | Notes                                                                                                                                    |
| ------------- | ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `NOT NULL`    | The column cannot be `NULL`                      | Make it the default for required fields                                                                                                  |
| `UNIQUE`      | No two rows have the same value (or combination) | Creates an index. `NULL`s are not equal to each other, so several `NULL`s are allowed, unless `UNIQUE NULLS NOT DISTINCT`                |
| `PRIMARY KEY` | `UNIQUE` + `NOT NULL`                            | **Only one** per table, but it can span several columns                                                                                  |
| `FOREIGN KEY` | The value exists in the referenced column        | The referenced column must be `PRIMARY KEY` or `UNIQUE`. `NULL` skips the check. The referencing column is **not** indexed automatically |
| `CHECK`       | A boolean expression is not false                | `NULL` passes: `CHECK (age >= 18)` accepts `NULL`. Can compare columns of the same row                                                   |
| `DEFAULT`     | Value used when the column is omitted            | `DEFAULT now()`, `DEFAULT CURRENT_DATE`, `DEFAULT 0`                                                                                     |

- Constraints can be written on a column (`email text UNIQUE`) or on the table
  (`UNIQUE (first_name, last_name)`), and named:
  `CONSTRAINT employees_age_check CHECK (age >= 18)`.
- Added later with `ALTER TABLE … ADD CONSTRAINT`; existing rows are checked
  then, unless the constraint is added `NOT VALID` and checked later with
  `VALIDATE CONSTRAINT` (useful on large tables).

### `ON DELETE` and `ON UPDATE` Actions

What happens to rows that reference a deleted (or changed) parent row:

| Action                | Effect                                                                           |
| --------------------- | -------------------------------------------------------------------------------- |
| `NO ACTION` (default) | The delete fails if referencing rows exist (checked at the end of the statement) |
| `RESTRICT`            | The same, checked immediately                                                    |
| `CASCADE`             | Referencing rows are deleted too (or updated, for `ON UPDATE`)                   |
| `SET NULL`            | The foreign key column is set to `NULL`                                          |
| `SET DEFAULT`         | The foreign key column is set to its default                                     |

`CASCADE` fits rows that cannot exist without the parent (order items of an
order); `SET NULL` fits optional links (an employee whose department was
removed); the default protects against accidental deletes.

### Constraints vs Application Validation

- Validation in the application gives friendly messages; constraints guarantee
  correctness when there are several writers, race conditions or manual fixes.
  Use both.
- Two concurrent requests can both pass an application check "email is free";
  only a `UNIQUE` constraint stops the second insert.

## Example

```sql
CREATE TABLE departments (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL UNIQUE
);

CREATE TABLE employees (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email text NOT NULL UNIQUE,
  age integer CHECK (age >= 18),
  department_id integer REFERENCES departments (id) ON DELETE CASCADE,
  start_date date NOT NULL DEFAULT CURRENT_DATE
);

INSERT INTO departments (name) VALUES ('Sales');
INSERT INTO employees (email, age, department_id) VALUES ('a@example.com', 30, 1);

-- error-start
INSERT INTO employees (email, age, department_id) VALUES ('a@example.com', 25, 1);
-- duplicate key value violates unique constraint "employees_email_key"
INSERT INTO employees (email, age, department_id) VALUES ('b@example.com', 16, 1);
-- new row for relation "employees" violates check constraint "employees_age_check"
INSERT INTO employees (email, age, department_id) VALUES ('c@example.com', 40, 99);
-- insert or update on table "employees" violates foreign key constraint "employees_department_id_fkey"
-- error-end

DELETE FROM departments WHERE id = 1; -- also deletes the employee: ON DELETE CASCADE
```

## Follow-up Questions

- What is the difference between `PRIMARY KEY` and `UNIQUE`? A table has one
  primary key and it cannot be `NULL`; it can have many `UNIQUE` constraints,
  and they allow `NULL`.
- Natural or surrogate primary key? A surrogate key (identity or UUID) does not
  change when business data changes; natural candidates such as email become
  `UNIQUE` constraints.
- Why index a foreign key column? Joins and `ON DELETE` checks scan the child
  table by that column; PostgreSQL does not create the index automatically. See
  [Indexes](./indexes.md).
- Can a `CHECK` look at another table? No, only at the current row. Use a
  foreign key or a trigger.

## Common Mistakes

- Relying only on application checks for uniqueness.
- Expecting `CHECK` or `UNIQUE` to reject `NULL`: add `NOT NULL`.
- Using `ON DELETE CASCADE` everywhere: one delete can silently remove large
  amounts of data.
- Forgetting the index on a foreign key column.

## See Also

- [Relationships Between Tables](./relationships.md)
- [Indexes](./indexes.md)
- [Data Types](./data-types.md)
- [Transactions](./transactions.md)
