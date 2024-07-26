---
sidebar_position: 3
---

# Relationships Between Tables

In a relational database, the concept of relationships between tables is crucial
for organizing and structuring data effectively. Relationships define how tables
connect and interact with each other, enabling complex queries and data
integrity.

There are three types of relationships between tables:

1. One-to-One
2. One-to-Many
3. Many-to-Many

## One-to-One (1:1) Relationship

It occurs when a single row in Table A is linked to a single row in Table B, and
vice versa. This type of relationship is not very common but can be useful for
dividing a table with many columns or sensitive data.

Organization: Use a primary key in one table and reference it as a foreign key
in the other table.

Suppose you have a Users table and a UserDetails table. Each user has one
corresponding detail record.

```sql
CREATE TABLE Users (
    UserID INT PRIMARY KEY,
    UserName VARCHAR(100)
);

CREATE TABLE UserDetails (
    UserDetailID INT PRIMARY KEY,
    UserID INT,
    Address VARCHAR(255),
    PhoneNumber VARCHAR(15),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);
```

## One-to-Many (1:M) Relationship

A one-to-many relationship is when a single row in _Table A_ can be related to
one or more rows in _Table B_, but each row in _Table B_ is related to only one
row in _Table A_. This is the most common type of relationship.

Organization: Use a primary key in the parent table (_Table A_) and a foreign
key in the child table (_Table B_).

Consider an Authors table and a Books table. One author can write multiple
books.

```sql
CREATE TABLE Authors (
    AuthorID INT PRIMARY KEY,
    AuthorName VARCHAR(100)
);

CREATE TABLE Books (
    BookID INT PRIMARY KEY,
    BookTitle VARCHAR(100),
    AuthorID INT,
    FOREIGN KEY (AuthorID) REFERENCES Authors(AuthorID)
);
```

## One-to-Many (M:M) Relationship

A many-to-many relationship occurs when multiple rows in Table A can be related
to multiple rows in Table B. This requires a junction table (or associative
table) to manage the relationships.

Organisation: Create a junction table with foreign keys referencing the primary
keys of the two tables to manage the relationships.

```sql
CREATE TABLE Students (
    StudentID INT PRIMARY KEY,
    StudentName VARCHAR(100)
);

CREATE TABLE Courses (
    CourseID INT PRIMARY KEY,
    CourseName VARCHAR(100)
);

CREATE TABLE StudentCourses (
    StudentID INT,
    CourseID INT,
    PRIMARY KEY (StudentID, CourseID),
    FOREIGN KEY (StudentID) REFERENCES Students(StudentID),
    FOREIGN KEY (CourseID) REFERENCES Courses(CourseID)
);
```
