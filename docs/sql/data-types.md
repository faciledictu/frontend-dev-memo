---
sidebar_position: 1
---

# Data Types in SQL

In SQL, data types specify the type of data that a column can hold.

:::info

Different SQL database management systems (DBMS) may have variations in their
supported data types, but the general categories and most common types are
similar across platforms.

:::

## Numeric Data Types

- `INT`: Integer data type. Stores whole numbers. Common variants include
  `TINYINT`, `SMALLINT`, and `BIGINT`.

  Example: `INT` (-2,147,483,648 to 2,147,483,647), `SMALLINT` (-32,768 to
  32,767), `BIGINT`, `TINYINT`

- `FLOAT`: Floating-point data type. Stores approximate numeric values with
  floating decimal points.

- `DECIMAL`: Exact numeric data type. Stores fixed-point numbers with exact
  precision.

## String Data Types

- `CHAR`: Fixed-length character string. Example: `CHAR(10)` (always 10
  characters, padded with spaces if necessary)

- `VARCHAR`: Variable-length character string. Example: `VARCHAR(255)` (up to
  255 characters)

- `TEXT`: Variable-length string for large amounts of text.

## Date and Time Data Types

- `DATE`: Date value in the format _YYYY-MM-DD_.

- `TIME`: Time value in the format _HH:MM:SS_

- `DATETIME`: Date and time in the format _YYYY-MM-DD HH:MM:SS_

- `TIMESTAMP`: The number of seconds since the Unix epoch (_1970-01-01 00:00:00
  UTC_). Format: _YYYY-MM-DD HH:MM:SS_.

Here is the dirrefence between data types in MySQL

| Format    | Desctiption | Bytes | Min                 | Max                 |
| --------- | ----------- | ----- | ------------------- | ------------------- |
| DATE      | Date only   | 3     | 1000-01-01          | 9999-12-31          |
| DATETIME  | Date + time | 8     | 1000-01-01 00:00:00 | 9999-12-31 23:59:59 |
| TIMESTAMP | Date + time | 4     | 1970-01-01 00:00:00 | 2038-01-19 03:14:17 |
| YEAR      | Year only   | 1     | 1901                | 2155                |
| TIME      | Time only   | 3     | -838:59:59          | 838:59:59           |

:::info TIMESTAMP in MySQL

Internally it keeps the value as UTC timezone and converts it to
server time on each request[^1].

  <details>
  <summary>Examples</summary>

```sql
CREATE TABLE timezone_test (
  time_stamp TIMESTAMP,
  date_time DATETIME
);


SET SESSION time_zone = '+00:00';

INSERT INTO timezone_test VALUES ('2029-02-14 08:47', '2029-02-14 08:47');

SELECT * FROM timezone_test;
-- | times_tamp          | date_time           |
-- |---------------------|---------------------|
-- | 2029-02-14 08:47:00 | 2029-02-14 08:47:00 |


SET SESSION time_zone = '-05:00';

SELECT * FROM timezone_test;
-- | times_tamp          | date_time           |
-- |---------------------|---------------------|
-- | 2029-02-14 03:47:00 | 2029-02-14 08:47:00 |
```

  </details>

:::

## Boolean Data Type

- `BOOLEAN`: Stores _TRUE_ or _FALSE_ values. Zero is considered as false,
  nonzero values are considered as true.

## Binary Data Types

- `BLOB`: Binary Large Object. Stores large binary data. Common variants include
  `BLOB`, `MEDIUMBLOB`, `LONGBLOB`

-

[^1]:
    https://dev.mysql.com/doc/refman/8.0/en/datetime.html#:~:text=MySQL%20converts%20TIMESTAMP%20values%20from,connection%20is%20the%20server's%20time.
