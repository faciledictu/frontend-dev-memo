# SOLID principles

SOLID are a set of five design principles that aim to make software designs more
understandable, flexible, and maintainable. They were introduced by Robert C.
Martin (also known as Uncle Bob) to provide guidelines for writing better
object-oriented code.

1. **Single Responsibility Principle (SRP)**. This principle states that a class
   should have only one reason to change, meaning it should have only one job or
   responsibility. In other words, a class should focus on doing one thing well,
   rather than trying to do too much.
2. **Open/Closed Principle (OCP)**. The Open/Closed Principle suggests that
   software entities (such as classes, modules, functions, etc.) should be open
   for extension but closed for modification. This means that you should be able
   to extend the behavior of a module without modifying its source code.
3. **Liskov Substitution Principle (LSP)**. The Liskov Substitution Principle
   states that objects of a superclass should be replaceable with objects of its
   subclasses without affecting the correctness of the program. In simpler
   terms, any object should be able to be substituted with an object of its
   subtype without altering the behavior of the program.
4. **Interface Segregation Principle (ISP)**. The Interface Segregation
   Principle suggests that clients should not be forced to depend on interfaces
   they do not use. It advocates for the creation of smaller, specific
   interfaces rather than large, monolithic ones, to prevent clients from being
   forced to implement methods they don't need.
5. **Dependency Inversion Principle (DIP)**. The Dependency Inversion Principle
   encourages the use of abstractions (such as interfaces or abstract classes)
   to decouple high-level modules from low-level modules. It states that
   high-level modules should not depend on low-level modules directly, but both
   should depend on abstractions. Adhering to these principles can lead to more
   modular, maintainable, and scalable software designs, making it easier to
   understand, extend, and modify code over time.
