---
sidebar_position: 5
description:
  What an index is, B-tree and other index types, composite, partial and
  expression indexes, when an index is not used, EXPLAIN
---

# Indexes

An **index** is a separate data structure that lets the database find rows by
the values of some columns without reading the whole table. The default type is
a **B-tree**: a sorted tree that answers `=`, `<`, `>`, `BETWEEN`, `ORDER BY`
and prefix searches in logarithmic time. Indexes speed up reads but cost disk
space and slow down every `INSERT`, `UPDATE` and `DELETE`, because each index
has to be updated too. `PRIMARY KEY` and `UNIQUE` create an index automatically;
foreign keys and other filtered columns need one created by hand. Whether an
index is actually used is shown by **`EXPLAIN`**.

Applies to: PostgreSQL 18.

## Details

### Kinds of Indexes

| Index         | Example                                                        | Use for                                                    |
| ------------- | -------------------------------------------------------------- | ---------------------------------------------------------- |
| Single column | `CREATE INDEX ON orders (user_id)`                             | Filters and joins on one column, foreign keys              |
| Composite     | `CREATE INDEX ON orders (user_id, created_at)`                 | Filter by the first column, sort or filter by the next one |
| Unique        | `CREATE UNIQUE INDEX ON users (email)`                         | The same as a `UNIQUE` constraint                          |
| Partial       | `CREATE INDEX ON orders (created_at) WHERE status = 'pending'` | Queries on a small subset of rows; the index stays small   |
| Expression    | `CREATE INDEX ON users (lower(email))`                         | Queries that filter by the same expression                 |
| Covering      | `CREATE INDEX ON orders (user_id) INCLUDE (total)`             | Index-only scans: the answer is read from the index alone  |

Index types other than B-tree:

| Type | Use for                                                     |
| ---- | ----------------------------------------------------------- |
| GIN  | `jsonb` (`@>`), arrays, full-text search                    |
| GiST | Geometry, ranges, nearest-neighbor search                   |
| BRIN | Huge tables whose rows are physically ordered, e.g. by time |
| Hash | Equality only; rarely better than B-tree                    |

### Column Order in a Composite Index

An index on `(user_id, created_at)` is sorted by `user_id`, then by `created_at`
within each `user_id`, like a phone book sorted by last name, then first name.
So it helps:

- `WHERE user_id = 42`;
- `WHERE user_id = 42 ORDER BY created_at DESC LIMIT 10`;
- but usually **not** `WHERE created_at > …` alone. (Since PostgreSQL 18, a skip
  scan can use it if `user_id` has few distinct values.)

Put columns compared with `=` first and the range or sort column last.

### When an Index Is Not Used

- The column is wrapped in a function: `WHERE lower(email) = …` needs an
  expression index on `lower(email)`.
- `LIKE '%text'` with a leading wildcard. A plain B-tree also skips
  `LIKE 'text%'` unless the database uses the `C` collation or the index was
  created with `text_pattern_ops`.
- The query returns a large share of the table: reading the table sequentially
  is cheaper than jumping through the index.
- The table is small, or the statistics are outdated (`ANALYZE` updates them).

### Reading `EXPLAIN`

| Plan node        | Meaning                                                                           |
| ---------------- | --------------------------------------------------------------------------------- |
| Seq Scan         | Reads the whole table                                                             |
| Index Scan       | Finds rows through the index, then reads them from the table                      |
| Index Only Scan  | Answers from the index without touching the table                                 |
| Bitmap Heap Scan | Collects matching row locations from the index, then reads them in physical order |

`EXPLAIN` shows the plan and estimates; `EXPLAIN ANALYZE` also runs the query
and shows the actual time and row counts.

## Example

```sql
CREATE TABLE orders (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id integer NOT NULL,
  status text NOT NULL,
  created_at timestamptz NOT NULL
);

INSERT INTO orders (user_id, status, created_at)
SELECT i % 10000, CASE WHEN i % 100 = 0 THEN 'pending' ELSE 'done' END,
       now() - i * interval '1 minute'
FROM generate_series(1, 200000) AS i;
ANALYZE orders;

EXPLAIN ANALYZE SELECT * FROM orders WHERE user_id = 42;
-- Seq Scan on orders … Rows Removed by Filter: 199980 … Execution Time: 3.5 ms

CREATE INDEX orders_user_id_created_at_idx ON orders (user_id, created_at);

EXPLAIN ANALYZE SELECT * FROM orders WHERE user_id = 42;
-- Bitmap Index Scan on orders_user_id_created_at_idx … Execution Time: 0.08 ms

EXPLAIN SELECT * FROM orders WHERE user_id = 42 ORDER BY created_at DESC LIMIT 10;
-- Index Scan Backward using orders_user_id_created_at_idx: no separate sort
```

## Follow-up Questions

- Why not index every column? Each index slows down writes, takes space and
  memory, and must be maintained; unused indexes are pure cost.
- How do you add an index to a large table in production?
  `CREATE INDEX CONCURRENTLY`: it does not block writes, but takes longer and
  cannot run inside a transaction.
- What is a clustered index? In MySQL InnoDB and SQL Server, the table itself is
  stored in primary key order. PostgreSQL tables are heaps; all indexes are
  separate.
- How do you find slow queries? `pg_stat_statements` for the most expensive
  queries, then `EXPLAIN ANALYZE` on them.

## Common Mistakes

- Expecting an index on `(a, b)` to help a query filtered only by `b`.
- Forgetting indexes on foreign key columns.
- Adding an index for a query that returns most of the table.
- Filtering by `lower(column)` or `column::text` with an index on the bare
  column.

## See Also

- [Constraints](./constraints.md)
- [Relationships Between Tables](./relationships.md)
- [SQL Commands](./commands.mdx)
