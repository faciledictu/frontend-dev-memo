---
sidebar_position: 7
description:
  NoSQL data models (key-value, document, wide-column, graph), SQL vs NoSQL,
  transactions and consistency, CAP theorem, when to choose which
tags: [middle]
---

# NoSQL Databases

**NoSQL** is an umbrella term for databases that do not use the relational model
of tables joined by foreign keys. The main models are **key-value** (Redis,
DynamoDB), **document** (MongoDB), **wide-column** (Cassandra) and **graph**
(Neo4j). They usually have a **flexible schema** and are built to **scale
horizontally** across many servers, at the cost of weaker joins and often weaker
or more limited consistency guarantees. Data is modeled around the queries the
application runs, often by **denormalizing**: storing related data together
instead of joining it. "NoSQL" does not mean "no transactions": MongoDB and
DynamoDB support multi-item ACID transactions.

## Details

### Data Models

| Model       | Data looks like                                        | Examples                      | Good for                                               |
| ----------- | ------------------------------------------------------ | ----------------------------- | ------------------------------------------------------ |
| Key-value   | A key and an opaque value                              | Redis, Valkey, DynamoDB       | Caches, sessions, rate limits, queues                  |
| Document    | JSON-like documents with nested fields, in collections | MongoDB, Couchbase, Firestore | Catalogs, content, user profiles: data read as a whole |
| Wide-column | Rows with many columns, grouped by a partition key     | Cassandra, ScyllaDB, HBase    | Very high write volume: events, time series, IoT       |
| Graph       | Nodes and edges with properties                        | Neo4j, Amazon Neptune         | Social graphs, recommendations, fraud detection        |

### SQL vs NoSQL

|              | Relational (PostgreSQL, MySQL)                         | NoSQL (typical)                                                             |
| ------------ | ------------------------------------------------------ | --------------------------------------------------------------------------- |
| Schema       | Fixed, enforced by the database                        | Flexible; the application is responsible for the shape                      |
| Relations    | Foreign keys and `JOIN`                                | Embedded data or references resolved by the application                     |
| Queries      | Any ad-hoc query in SQL                                | Efficient only for the access patterns the data was designed for            |
| Transactions | ACID across any rows and tables                        | Single-item atomicity by default; multi-item transactions exist with limits |
| Scaling      | Mostly vertical; read replicas, sharding is extra work | Horizontal by design: partitioning and replication built in                 |

### Consistency and the CAP Theorem

- **CAP theorem:** when the network between nodes is partitioned (P), a
  distributed database must choose between **consistency** (C: every read sees
  the latest write, or fails) and **availability** (A: every request gets an
  answer, possibly stale).
- **Eventual consistency:** replicas converge over time; a read right after a
  write may return the old value. DynamoDB reads are eventually consistent by
  default, with a strongly consistent option; Cassandra lets you pick the
  consistency level per query.
- **BASE** (basically available, soft state, eventually consistent) is the
  informal opposite of ACID used to describe such systems.
- MongoDB has multi-document ACID transactions since 4.0 (replica sets) and 4.2
  (sharded clusters); DynamoDB has `TransactWriteItems`. Both are designed so
  that most operations touch a single document or item.

### When to Choose What

- **Relational by default:** most applications have related data, need
  constraints and ad-hoc queries, and fit on one server for a long time.
  PostgreSQL's `jsonb` covers many "flexible schema" needs inside a relational
  database.
- **NoSQL** when there is a concrete reason: a cache or session store (Redis),
  write volume or data size beyond one server (Cassandra, DynamoDB), documents
  that are always read and written as a whole, or graph traversals.
- Systems often combine them: PostgreSQL as the source of truth, Redis as a
  cache, a search engine (Elasticsearch, OpenSearch) for full-text search.

## Follow-up Questions

- Is MongoDB schemaless? The database does not require a schema, but the
  application always has one; MongoDB can enforce it with JSON Schema
  validation.
- How do you model a one-to-many relationship in MongoDB? Embed the "many" side
  when it is small and read together with the parent (order items in an order);
  reference by ID when it is large or shared.
- What is sharding? Splitting data across servers by a key; a poor shard key
  sends most traffic to one server (a hot partition).
- Why is Redis fast? Data is in memory and commands are executed one at a time
  on a single thread, without disk I/O on reads.

## Common Mistakes

- "NoSQL databases have no transactions": MongoDB and DynamoDB do, with limits.
- "NoSQL is faster": it is faster for the access patterns it was modeled for,
  and slower or impossible for others.
- "Schemaless means no schema design": data modeling matters more, because it
  must follow the queries.
- Choosing NoSQL for scale the project will never reach and then rebuilding
  joins in application code.

## See Also

- [Transactions](./transactions.md)
- [Data Types: jsonb](./data-types.md#other-types)
- [Relationships Between Tables](./relationships.md)
