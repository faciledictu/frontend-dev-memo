---
sidebar_position: 5
---

# Transactions in SQL

A transaction is a sequence of one or more SQL operations that are executed as a
single unit of work. A transaction ensures that all operations within it are
completed successfully before making any changes permanent. If any operation
within the transaction fails, the entire transaction can be rolled back, leaving
the database in its original state.

## ACID Properties

ACID defines the key characteristics that ensure transactions are processed
reliably.

### Atomicity

Ensures that all operations within a transaction are treated as a single unit.
They either all succeed or all fail.

**Example:** In a bank transfer, if money is deducted from one account, it must
be added to another. Atomicity ensures both steps are completed or neither is.

### Consistency

Ensures that a transaction brings the database from one valid state to another,
maintaining database invariants.

**Example:** If a transaction modifies data in a way that violates database
constraints, it must be rolled back to maintain consistency.

### Isolation

Ensures that transactions are executed in isolation from each other, so that
concurrent transactions do not affect each other’s execution.

**Example:** While one transaction is updating a record, another transaction
should not be able to see the intermediate state of that record.

### Durability

Ensures that once a transaction is committed, its changes are permanent, even in
the event of a system failure.

**Example:** After a transaction commits, the changes should be saved to disk
and remain even if the system crashes immediately after.

## Commands

- `BEGIN TRANSACTION` Starts a new transaction.

- `COMMIT`

  Permanently saves all changes made in the current transaction.

- `ROLLBACK`

  Undoes all changes made in the current transaction.

- `SAVEPOINT savepoint_name`

  Sets a savepoint within a transaction to which you can roll back later.

- `RELEASE SAVEPOINT savepoint_name`

  Removes a savepoint, making it no longer available for rollback.

- `ROLLBACK TO SAVEPOINT savepoint_name`

  Rolls back to the specified savepoint without affecting the rest of the
  transaction.

Consider a banking application where a transaction involves transferring money
from one account to another.

```sql
BEGIN TRANSACTION;

UPDATE accounts
SET balance = balance - 100
WHERE account_id = 1;

UPDATE accounts
SET balance = balance + 100
WHERE account_id = 2;

-- Check for any errors and rollback if necessary
IF @@ERROR <> 0
    ROLLBACK;
ELSE
    COMMIT;
```

- The transaction ensures **atomicity** by treating the debit and credit as a
  single unit of work.

- **Consistency** is maintained by checking constraints and rolling back in case
  of errors.

- **Isolation** levels can be set to prevent other transactions from
  interfering.

- **Durability** ensures that once the transaction commits, the changes persist.

## Transaction Isolation Levels

:::info Definitions

**Dirty Read:** Reading uncommitted changes made by another transaction.

**Non-Repeatable Read:** Data changes between reads within the same transaction
due to another committed transaction.

**Phantom Read:** New rows added by another transaction are visible when rows
are re-read within a transaction.

:::

### 1. Read Uncommitted

Allows a transaction to read data that has been modified by other transactions
but not yet committed. This can lead to dirty reads.

**Use Case:** Rarely used due to potential data inconsistencies.

### 2. Read Committed

Ensures a transaction only reads data that has been committed. Prevents dirty
reads but allows non-repeatable reads.

**Use Case:** Commonly used in many database systems for a balance between
performance and consistency.

### 3. Repeatable Read

Ensures that if a transaction reads a row, it will read the same value
throughout the transaction. Prevents dirty and non-repeatable reads but allows
phantom reads.

**Use Case:** Used when it’s important to maintain consistency in read
operations within the same transaction.

### 4. Serializable

The strictest isolation level, ensuring complete isolation from other
transactions. Prevents dirty reads, non-repeatable reads, and phantom reads by
locking the entire range of rows.

**Use Case:** Used when full consistency is critical, but can impact performance
due to increased locking.
