---
sidebar_position: 5
description:
  ACID, BEGIN / COMMIT / ROLLBACK and savepoints, isolation levels and read
  anomalies, how PostgreSQL actually implements them, lost updates and locking
---

# Transactions in SQL

A **transaction** is a group of statements that the database executes as one
unit: either all of their changes are saved (`COMMIT`) or none are (`ROLLBACK`).
Transactions give the **ACID** guarantees: **atomicity** (all or nothing),
**consistency** (constraints hold after every commit), **isolation** (concurrent
transactions do not see each other's unfinished work) and **durability**
(committed data survives a crash). How strong the isolation is depends on the
**isolation level**: Read Uncommitted, Read Committed, Repeatable Read,
Serializable. Weaker levels allow more anomalies but fail less often under
concurrency. PostgreSQL defaults to **Read Committed**.

Applies to: PostgreSQL 18.

## Details

### ACID

| Property    | Guarantee                                                      | Example                                                                     |
| ----------- | -------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Atomicity   | All statements of a transaction take effect, or none do        | A transfer never debits one account without crediting the other             |
| Consistency | A committed transaction leaves every constraint satisfied      | `CHECK (balance >= 0)` cannot be broken by a commit                         |
| Isolation   | Concurrent transactions behave as the isolation level promises | A report does not see a half-done transfer                                  |
| Durability  | After `COMMIT` returns, the data survives a crash              | PostgreSQL writes the change to the write-ahead log (WAL) before confirming |

### Commands

| Command                       | What it does                                                              |
| ----------------------------- | ------------------------------------------------------------------------- |
| `BEGIN` (`START TRANSACTION`) | Starts a transaction; `BEGIN ISOLATION LEVEL SERIALIZABLE` sets the level |
| `COMMIT`                      | Saves all changes of the current transaction                              |
| `ROLLBACK`                    | Discards all of them                                                      |
| `SAVEPOINT name`              | Marks a point inside the transaction                                      |
| `ROLLBACK TO SAVEPOINT name`  | Discards changes made after the savepoint; the transaction continues      |
| `RELEASE SAVEPOINT name`      | Forgets the savepoint, keeping its changes                                |

- Without `BEGIN`, every statement is its own transaction (**autocommit**).
- In PostgreSQL, an error inside a transaction **aborts** it: every following
  statement fails with `current transaction is aborted`, and `COMMIT` performs a
  `ROLLBACK`. To continue after an expected error, use a savepoint.
- DDL (`CREATE`, `ALTER`, `DROP`) is transactional in PostgreSQL, so a migration
  can be rolled back as a whole. MySQL commits DDL implicitly.

### Read Anomalies

| Anomaly                            | What happens                                                                                       |
| ---------------------------------- | -------------------------------------------------------------------------------------------------- |
| Dirty read                         | Reading another transaction's uncommitted changes                                                  |
| Non-repeatable read                | Reading the same row twice gives different values because another transaction committed in between |
| Phantom read                       | Re-running a query with a condition returns a different set of rows                                |
| Lost update                        | Two transactions read a value, both write a new value based on it, and one write is lost           |
| Serialization anomaly (write skew) | Each transaction is valid alone, but their combination could not happen in any serial order        |

### Isolation Levels

What the SQL standard **allows** at each level, and what PostgreSQL actually
does:

| Level            | Dirty read                     | Non-repeatable read | Phantom read                   | Serialization anomaly |
| ---------------- | ------------------------------ | ------------------- | ------------------------------ | --------------------- |
| Read Uncommitted | Allowed; **not in PostgreSQL** | Possible            | Possible                       | Possible              |
| Read Committed   | No                             | Possible            | Possible                       | Possible              |
| Repeatable Read  | No                             | No                  | Allowed; **not in PostgreSQL** | Possible              |
| Serializable     | No                             | No                  | No                             | No                    |

How PostgreSQL implements them (**MVCC**: readers see a snapshot and never block
writers):

- **Read Uncommitted** behaves exactly like Read Committed.
- **Read Committed** (default): each **statement** sees a snapshot of data
  committed before it started.
- **Repeatable Read**: the whole **transaction** sees one snapshot taken at its
  first statement (snapshot isolation), so phantoms do not appear either. If it
  tries to update a row that another transaction changed and committed, it fails
  with `could not serialize access due to concurrent update`.
- **Serializable**: Repeatable Read plus detection of dangerous dependencies
  between transactions (SSI). It does **not** lock ranges of rows; instead, one
  of the conflicting transactions fails with a serialization error.
- At Repeatable Read and Serializable the application must be ready to **retry**
  the whole transaction on error code `40001`.
- Other databases differ: MySQL InnoDB defaults to Repeatable Read and uses
  locks against phantoms; SQL Server's Serializable uses range locks.

### Preventing Lost Updates

At Read Committed, "read, compute in the application, write back" loses updates.
Options:

- **Atomic update:** `UPDATE accounts SET balance = balance - 30 WHERE id = 1`.
  The database re-reads the row under a lock.
- **Pessimistic lock:** `SELECT … FOR UPDATE` locks the rows until the end of
  the transaction; other writers wait.
- **Optimistic lock:** a `version` column,
  `UPDATE … WHERE id = 1 AND version = 7`; zero updated rows means someone else
  changed it, retry.
- **Higher isolation level:** Repeatable Read or Serializable plus retries.

## Example

```sql
CREATE TABLE accounts (
  id integer PRIMARY KEY,
  balance numeric NOT NULL CHECK (balance >= 0)
);
INSERT INTO accounts VALUES (1, 100), (2, 50);

BEGIN;
UPDATE accounts SET balance = balance - 500 WHERE id = 1;
-- ERROR: new row for relation "accounts" violates check constraint "accounts_balance_check"
UPDATE accounts SET balance = balance + 500 WHERE id = 2;
-- ERROR: current transaction is aborted, commands ignored until end of transaction block
COMMIT; -- reported as ROLLBACK: no change is saved, balances stay 100 and 50
```

In application code, the driver wraps the statements:

```javascript
// node-postgres (pg)
const client = await pool.connect();
try {
  await client.query('BEGIN');
  await client.query(
    'UPDATE accounts SET balance = balance - $1 WHERE id = $2',
    [amount, from]
  );
  await client.query(
    'UPDATE accounts SET balance = balance + $1 WHERE id = $2',
    [amount, to]
  );
  await client.query('COMMIT');
} catch (err) {
  await client.query('ROLLBACK');
  throw err;
} finally {
  client.release();
}
```

## Follow-up Questions

- What is the default isolation level? Read Committed in PostgreSQL, Oracle and
  SQL Server; Repeatable Read in MySQL InnoDB.
- Why not always use Serializable? Transactions fail more often under load and
  must be retried; for most workloads Read Committed with atomic updates or row
  locks is enough.
- What is a deadlock? Two transactions each wait for a row the other has locked.
  PostgreSQL detects it and aborts one of them; lock rows in a consistent order
  to avoid it.
- How long should a transaction be? As short as possible: never wait for user
  input or an external HTTP call inside one, since it holds locks and old row
  versions.

## Common Mistakes

- "Repeatable Read allows phantom reads": the standard allows it, PostgreSQL and
  InnoDB prevent them.
- "Serializable locks the whole range of rows": that is one implementation;
  PostgreSQL uses SSI and aborts a conflicting transaction instead.
- Expecting the remaining statements to run after an error inside a PostgreSQL
  transaction.
- Running the statements of one transaction through different pooled
  connections: `BEGIN` and `COMMIT` must go through the same client.
- Not retrying on serialization errors at Repeatable Read or Serializable.

## See Also

- [SQL Commands](./commands.mdx)
- [Constraints](./constraints.md)
- [NoSQL Databases](./nosql.md)
