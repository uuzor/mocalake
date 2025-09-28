# MocaLake - Decentralized Fan Verification Platform

## Overview

MocaLake is a Web3 identity-first platform that revolutionizes fan engagement and event ticketing through decentralized identity verification. Built on Moca Network's AIR Kit infrastructure, the platform eliminates traditional smart contracts in favor of verifiable credentials for anti-scalping protection and cross-platform fan reputation management. The system uses identity-linked tickets as verifiable credentials rather than NFTs, with privacy-preserving zero-knowledge proofs enabling fans to verify their status without revealing personal data.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for development tooling
- **Styling**: Tailwind CSS with shadcn/ui component library following Web3/crypto design patterns
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state and custom hooks for local state
- **Design System**: Custom Web3-inspired theme with glassmorphism elements, supporting both light and dark modes

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Storage Layer**: Abstracted storage interface supporting both in-memory (development) and database (production) implementations
- **API Design**: RESTful endpoints for users, events, tickets, and fan credentials
- **Authentication**: JWT-based authentication integrated with AIR Kit identity services

### Identity & Credential Management
- **Core Service**: Moca Network's AIR Kit for decentralized identity and credential issuance
- **Credential Types**: Event tickets and fan status represented as verifiable credentials instead of smart contracts
- **Anti-Scalping**: Identity verification through non-transferable credential linking rather than blockchain enforcement
- **Privacy**: Zero-knowledge proofs for fan verification without exposing personal information

### Data Models
- **Users**: Wallet addresses, Moca IDs, reputation scores, and verification status
- **Events**: Artist information, venue details, ticket pricing, and capacity management
- **Tickets**: Credential-based tickets linked to user identity with purchase history
- **Fan Credentials**: Cross-platform reputation tracking with artist-specific engagement metrics

## External Dependencies

### Primary Infrastructure
- **Moca Network AIR Kit**: Decentralized identity provider and credential management system
- **Neon Database**: Serverless PostgreSQL hosting for production data persistence
- **Drizzle ORM**: Type-safe database operations and schema management

### Development & UI
- **Radix UI**: Headless component primitives for accessible UI development
- **Tailwind CSS**: Utility-first styling with custom Web3-themed configuration
- **React Hook Form**: Form state management with Zod validation schemas
- **Date-fns**: Date manipulation and formatting utilities

### Build & Deployment
- **Vite**: Frontend build tooling with React plugin and development server
- **TypeScript**: Static type checking across the entire application
- **ESBuild**: Fast bundling for production server builds
- **Replit**: Development environment with integrated deployment capabilities