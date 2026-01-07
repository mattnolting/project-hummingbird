/**
 * Data Layer Abstraction
 * 
 * This module provides a clean, abstracted interface for interacting with
 * multiple APIs (Quay.io, CVE scanning, SBOM, Pyxis) while maintaining
 * separation of concerns and enabling easy testing, mocking, and future API additions.
 * 
 * Architecture:
 * - domain/     : Normalized, API-agnostic domain models
 * - adapters/   : Transform API responses to domain models
 * - clients/    : Raw HTTP requests to external APIs
 * - sources/    : Business logic, orchestration, caching
 * - cache/      : Caching layer for performance
 * - hooks/      : React hooks for data fetching
 * - errors/     : Error handling and transformation
 */

// Domain models
export * from './domain';

// Data sources
export * from './sources';

// React hooks
export * from './hooks';

// Error handling
export * from './errors';

