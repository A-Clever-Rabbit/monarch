An example of a folder structure for a Meteor application using the
Domain Driven Design (DDD) approach and the
[Screaming Architecture](https://blog.cleancoder.com/uncle-bob/2011/09/30/Screaming-Architecture.html) approach.

A masterclass of modern Web Development, this is the Gold Standard for rapid and reliable Web development.

```
/your-app-root
│
├── /imports
│   ├── /domain               # Core business logic (Screaming part)
│   │   ├── /models           # Domain models or entities
│   │   ├── /services         # Domain services (business rules, validations, etc.)
│   │   └── /events           # Domain events, if you have any
│   │
│   ├── /application          # Application services (orchestration)
│   │   ├── /services         # Application-specific services
│   │   ├── /dto              # Data Transfer Objects (for communication between layers)
│   │   └── /mappers          # To map between domain and application layers, if needed
│   │
│   ├── /repositories         # Data access (can be further divided by entity)
│   │   ├── /uom              # UOM specific repository logic
│   │   ├── /inventory        # Inventory specific repository logic
│   │   └── ...               # Other entity-specific directories
│   │
│   ├── /api                 # External interfaces (e.g., REST API, GraphQL, RPC)
│   │   ├── /routes           # If you have REST endpoints
│   │   ├── /publications     # Meteor's publication functions
│   │   └── /subscriptions    # Meteor's subscription functions
│   │
│   ├── /client              # Client-side specific code
│   │   ├── /ui               # UI components, templates
│   │   └── /subscriptions    # Client-side subscriptions
│   │
│   └── /server              # Server-side specific initialization and bootstrapping
│
├── /tests                   # Tests (can mirror the src directory structure)
│
├── /public                  # Static files like images
│
└── /config                  # Configuration files, environment-specific settings
```
