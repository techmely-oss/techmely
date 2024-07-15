# @techmely/domain-driven

Domain driven design for all techmely apps

## Core concepts about Domain Driven Design

Please read docs carefully before using this lib

Note alias word

```
Domain services = DS

```

### 1. Ubiquitous language

- The language/terms agreed upon by both business-developer side, within a bounded context
- Entities with the same name in a different context can have different behavior and data
- Bounded context helps in single responsibility for domain models

### 2. Rich domain model

- Models(aggregates, entities, value objects) with the rich behavior are preferred over anemic domain models(entities without behavior, which only keep data and represent the DB tables)

- Due to single responsibility principle (a class or method should have only one reason to change), non-cohesive behavior should delegated to other classes(or even handled inside DS) when necessary

- Model methods can also delegate the task to DS by raising domain events

### 3. Thin domain service working on rich domain models

- DS should not hold state(different with application services, they are on the outer layer close to the UI layer, and can hold application/task state)

- DS should not contain behavior, only which does not fit cohesively in any domain model

- DS should locate in the core domain layer and expose domain models in their interfaces ???

### 4. Layers in a DDD App

- Core domain layer: aggregates, entities, value objects, events
- Core domain layer is surrounded by the UI/Application layer: UI & application service facade with messaging, JSON, XML, capabilities, session, etc...
- Infra layer: Persistence, file system, network, mail, logging, etc...

### 5. Anti-corruption layer

- Used to translate models from outside system or legacy apps to models inside the bounded context and vice versa. Also to ease the communication with legacy services

- Can use service facades and model adapters

## Details Domain Driven Design

### Entities
### Value Objects
### Factories
### Aggregates
### Repositories
### Shared Kernel
### Domain Events

## Folder structures

Folders structure suggestion

- Application layer
- Domain layer
  - Contexts
- Infra layer

## License

MIT &copy; [TechMeLy](https://github.com/sponsors/TechMeLy)
