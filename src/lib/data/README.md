# Data Layer Abstraction

This directory contains the data layer abstraction for the Hummingbird application. It provides a clean, unified interface for interacting with multiple APIs while maintaining separation of concerns.

## Architecture

```
src/lib/data/
├── domain/          # Domain models (normalized, API-agnostic types)
├── adapters/        # API response adapters (transform API → domain)
├── clients/         # Raw API clients (HTTP requests)
├── sources/         # Data sources (business logic, orchestration)
├── cache/           # Caching layer (performance optimization)
├── hooks/           # React hooks (data fetching with state)
└── errors/          # Error handling (custom errors, transformation)
```

## Layer Responsibilities

### Domain Models (`domain/`)
- Normalized, API-agnostic types
- Business domain representation
- Independent of any specific API structure

### Adapters (`adapters/`)
- Transform API-specific responses to domain models
- Handle data normalization and mapping
- One adapter per API (Quay, CVE, SBOM, Pyxis)

### API Clients (`clients/`)
- Raw HTTP requests to external APIs
- Simple, focused on API communication
- Handle authentication, headers, request/response

### Data Sources (`sources/`)
- Business logic and orchestration
- Combine multiple API calls
- Handle caching, error handling, retry logic
- Provide unified interface for data operations

### Cache Layer (`cache/`)
- In-memory caching with TTL
- Cache key generation
- Cache invalidation strategies
- Performance optimization

### React Hooks (`hooks/`)
- React-specific data fetching
- Loading states, error states
- Refetch capabilities
- Pagination support

### Error Handling (`errors/`)
- Custom error types
- Error transformation (API errors → user-friendly)
- Logging and reporting

## Usage

### Importing Domain Models
```typescript
import { Container, SecurityInfo, CVE } from '@lib/data/domain';
```

### Using Data Sources
```typescript
import { containerDataSource } from '@lib/data/sources';

const container = await containerDataSource.getContainer('hummingbird/python');
```

### Using React Hooks
```typescript
import { useContainerList } from '@lib/data/hooks';

const { containers, isLoading, error } = useContainerList({ namespace: 'hummingbird' });
```

## Implementation Status

See [DATA-ABSTRACTION-LAYER-ROADMAP.md](../../DATA-ABSTRACTION-LAYER-ROADMAP.md) for detailed implementation phases and progress.

## Key Principles

1. **Separation of Concerns**: Each layer has a single responsibility
2. **API Independence**: Components don't know about specific APIs
3. **Type Safety**: Full TypeScript support throughout
4. **Testability**: Easy to mock and test each layer
5. **Performance**: Caching reduces API calls
6. **Extensibility**: Easy to add new APIs or data sources

