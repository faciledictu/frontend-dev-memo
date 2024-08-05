---
sidebar_position: 10
---

# Appendix: NoSQL Databases

Unlike traditional relational databases (SQL), which use structured tables and
schemas, NoSQL databases use a variety of data models that allow for more
dynamic and flexible data storage and retrieval.

## Features

## Schema Flexibility

Non-relational databases like MongoDB and DynamoDB do not require a fixed
schema, allowing you to store data in a flexible, dynamic format. This is
particularly useful for applications with rapidly changing requirements.

## Horizontal Scalability

These databases are designed to scale out by adding more servers (nodes) to the
cluster, making them suitable for handling large volumes of data and high
traffic loads.

## Variety of Data Models

Non-relational databases support various data models, including key-value,
document, column-family, and graph models, allowing you to choose the best fit
for your application's needs.

## Distributed Architecture

Both MongoDB and DynamoDB are designed for distributed environments, providing
high availability and fault tolerance.

## High-Performance Queries

These databases often provide fast read and write operations, especially for
large datasets, by leveraging in-memory caching and efficient indexing.

## Types

### Key-Value Stores

Data is stored as a collection of key-value pairs.

**Examples:** Redis, Amazon DynamoDB.

**Use Cases:** Caching, session management, and storing user profiles.

### Document Stores

Data is stored in documents, typically in JSON or BSON format.

**Examples:** MongoDB and CouchDB.

**Use Cases:** Content management systems, catalogs, and user data storage.

### Column-Family Stores

Data is stored in columns rather than rows, optimized for read and write
operations on large datasets.

**Examples:** Apache Cassandra and HBase.

**Use Cases:** Real-time analytics, time-series data, and recommendation
engines.

### Graph Databases

Data is stored as nodes, edges, and properties, representing complex
relationships between data points.

**Examples:** Neo4j and Amazon Neptune.

**Use Cases:** Social networks, recommendation engines, and fraud detection.

## Considerations

### Advantages

- Flexibility: Easily handle changes in data structures without requiring schema
  modifications.

- Scalability: Efficiently manage large volumes of data by scaling horizontally.

- Performance: Provide fast data access and high throughput for specific
  workloads.

- Diverse Use Cases: Support various data models to fit different application
  needs.

### Disadvantages

- Limited ACID Transactions: Often sacrifice consistency for availability and
  partition tolerance.

- Complex Querying: Lack the powerful querying capabilities of SQL, making
  complex queries more challenging.

- Data Duplication: May require denormalization, leading to potential data
  duplication and increased storage costs.

- Learning Curve: Different data models and querying languages can present a
  learning curve for developers accustomed to SQL.
