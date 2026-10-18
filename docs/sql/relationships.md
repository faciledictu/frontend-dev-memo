---
sidebar_position: 4
description:
  One-to-one, one-to-many and many-to-many relationships, how each is built with
  foreign keys, junction tables, querying with JOIN
tags: [junior, middle]
---

# Relationships Between Tables

A relationship links rows of two tables through a **foreign key**: a column
whose value is the primary key (or another unique key) of a row in another
table, or of the same table. There are three kinds. **One-to-many** (1:M, the
most common): the foreign key is on the "many" side, for example
`books.author_id`. **One-to-one** (1:1): the same foreign key plus a `UNIQUE`
constraint, or the foreign key is the primary key itself (strictly,
one-to-zero-or-one: a user may have no profile yet). **Many-to-many** (M:M): it
cannot be stored in either table, so a third **junction table** holds pairs of
foreign keys. Related rows are read back with `JOIN`.

Applies to: PostgreSQL 18.

## Details

| Relationship | Example            | How it is built                                                                   |
| ------------ | ------------------ | --------------------------------------------------------------------------------- |
| One-to-one   | User → profile     | FK in the dependent table with `UNIQUE`, or FK that is also its `PRIMARY KEY`     |
| One-to-many  | Author → books     | FK in the "many" table (`books.author_id`)                                        |
| Many-to-many | Students ↔ courses | Junction table `enrollments (student_id, course_id)` with a composite primary key |

- Without `UNIQUE` on the foreign key, a "one-to-one" table is really
  one-to-many: nothing stops a second profile for the same user.
- One-to-one is used to split rarely read or sensitive columns from a wide
  table, or for optional data that most rows do not have.
- A junction table can carry its own data about the link: `enrolled_at`,
  `grade`, `role`.
- `NOT NULL` on the foreign key makes the relationship mandatory (every book has
  an author); without it the link is optional.
- Index the foreign key columns: they are used in every `JOIN` and `ON DELETE`
  check. The composite primary key `(student_id, course_id)` already covers
  lookups by `student_id`, so only `course_id` needs its own index.

## Example

<details>
<summary>One-to-one</summary>

```sql
CREATE TABLE users (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL
);

CREATE TABLE user_profiles (
  user_id integer PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE,
  address text,
  phone text
);
-- user_id is both the primary key and the foreign key: at most one profile per user
```

</details>

<details>
<summary>One-to-many</summary>

```sql
CREATE TABLE authors (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL
);

CREATE TABLE books (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title text NOT NULL,
  author_id integer NOT NULL REFERENCES authors (id)
);

CREATE INDEX ON books (author_id);
```

</details>

<details>
<summary>Many-to-many</summary>

```sql
CREATE TABLE students (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL
);

CREATE TABLE courses (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title text NOT NULL
);

CREATE TABLE enrollments (
  student_id integer REFERENCES students (id) ON DELETE CASCADE,
  course_id integer REFERENCES courses (id) ON DELETE CASCADE,
  enrolled_at date NOT NULL DEFAULT CURRENT_DATE,
  -- highlight-next-line
  PRIMARY KEY (student_id, course_id) -- a student enrolls in a course once
);

CREATE INDEX ON enrollments (course_id);

-- Who takes which course: two joins through the junction table
SELECT s.name, c.title
FROM students s
JOIN enrollments e ON e.student_id = s.id
JOIN courses c ON c.id = e.course_id;
```

</details>

## Follow-up Questions

- Why not store a list of course IDs in a `students` column? The database could
  not enforce foreign keys on it, and queries "who takes course X" would need to
  scan and parse every row. An array or `jsonb` column is acceptable only for
  data that is never joined.
- What is normalization? Organizing tables so each fact is stored once: no
  repeating groups in a column (1NF), and no column that depends on only part of
  the key (2NF) or on another non-key column (3NF). Denormalization trades this
  for fewer joins on reads.
- What is the N+1 problem? Loading a list (1 query) and then the related rows
  for each item separately (N queries). Fix it with a `JOIN` or one
  `WHERE id = ANY($1)` query; ORMs call it eager loading.

## Common Mistakes

- Calling a table one-to-one when its foreign key has no `UNIQUE` constraint.
- Modeling many-to-many with a comma-separated string or an array column.
- A junction table without a primary key or `UNIQUE (a_id, b_id)`: the same pair
  can be inserted twice.
- No indexes on foreign key columns.

## See Also

- [Constraints](./constraints.md)
- [Indexes](./indexes.md)
- [SQL Commands: JOIN](./commands.mdx#join)
