# Advertising Campaign Management System

## Overview

This is a full-stack web application for managing advertising campaigns, specifically designed for live streaming promotional systems. The application provides a step-by-step interface for creating and configuring marketing campaigns with features like product management, user targeting, budget scheduling, and performance analytics.

## User Preferences

Preferred communication style: Simple, everyday language.
User requested local server deployment capability.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **State Management**: React hooks for local state, TanStack Query for server state
- **Routing**: Wouter for lightweight client-side routing
- **Charts**: Recharts for data visualization

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Pattern**: RESTful API with JSON responses
- **Validation**: Zod for schema validation
- **Development**: In-memory storage fallback for development

### Build and Development
- **Development Server**: Vite dev server with HMR
- **Production Build**: Bundled with esbuild for server, Vite for client
- **Type Checking**: TypeScript compiler with strict mode
- **Path Mapping**: Absolute imports with @ and @shared aliases

## Key Components

### Campaign Management
- **Step-by-step Configuration**: Multi-step wizard interface for campaign creation
- **Marketing Goals**: Brand exposure, lead generation, live commerce options
- **Promotion Scenarios**: Live room, video, and feed promotion types
- **User Targeting**: Age, gender, location, interests, and behavior targeting
- **Budget & Schedule**: Budget allocation and time-based scheduling

### Product Management
- **Product Catalog**: Centralized product information with images and pricing
- **Promotional Settings**: Discount management and pricing strategies
- **Category Organization**: Product categorization for better organization

### Data Analytics
- **Performance Metrics**: Exposure, clicks, conversion tracking
- **Cost Analysis**: CPC, CPM, and conversion cost calculations
- **Visualization**: Charts and graphs for campaign performance

### User Interface
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Design System**: Consistent theming with CSS variables
- **Interactive Elements**: Forms, modals, tooltips, and feedback systems
- **Accessibility**: ARIA labels and keyboard navigation support

## Data Flow

### Campaign Creation Flow
1. User selects marketing goals and objectives
2. System recommends promotion scenarios based on goals
3. User configures product settings and promotions
4. Targeting parameters are set for audience selection
5. Budget and schedule configuration
6. Campaign preview and analytics estimation
7. Final campaign creation and storage

### Data Management
- **Client-Server Communication**: REST API calls with JSON payloads
- **State Synchronization**: TanStack Query for caching and synchronization
- **Form Validation**: Client-side validation with Zod schemas
- **Error Handling**: Comprehensive error boundaries and user feedback

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React, React DOM, React Query
- **UI Framework**: Radix UI components, Tailwind CSS
- **Database**: Drizzle ORM, Neon Database serverless driver
- **Validation**: Zod for runtime type checking
- **Charts**: Recharts for data visualization
- **Utilities**: date-fns, clsx, class-variance-authority

### Development Dependencies
- **Build Tools**: Vite, esbuild, TypeScript
- **Styling**: PostCSS, Autoprefixer
- **Development**: tsx for TypeScript execution
- **Replit Integration**: Replit-specific plugins for development environment

## Deployment Strategy

### Production Build
- **Client Build**: Vite builds optimized static assets to `dist/public`
- **Server Build**: esbuild bundles server code to `dist/index.js`
- **Asset Serving**: Express serves static files in production
- **Environment Variables**: DATABASE_URL required for PostgreSQL connection

### Development Environment
- **Hot Module Replacement**: Vite HMR for instant updates
- **TypeScript Compilation**: Real-time type checking
- **Database Migrations**: Drizzle migrations for schema changes
- **Memory Storage**: Fallback storage for development without database

### Database Schema
- **MySQL 5.7.5+ Compatible**: Schema uses VARCHAR/TEXT/TINYINT instead of JSON/BOOLEAN for maximum compatibility
- **Campaigns Table**: Stores campaign data with TEXT fields for JSON arrays (placements, deviceTypes, interests, behaviors, weeklySchedule)
- **Products Table**: Product catalog with VARCHAR fields for names/categories, TEXT for descriptions
- **Field Type Strategy**: 
  - Short text fields: VARCHAR with appropriate lengths
  - Long text/JSON data: TEXT fields without default values
  - Boolean values: TINYINT(1) with 0/1 values
- **Data Conversion**: Automatic JSON parsing/stringifying in storage layer
- **Memory Storage**: Currently using in-memory storage for immediate functionality
- **MySQL Integration**: Complete MySQL schema and drivers configured with connection string auto-repair
- **Type Safety**: TypeScript types with Zod validation for data integrity

## Recent Changes (January 2025)
- ✓ **Database Migration**: Successfully converted from PostgreSQL to MySQL architecture
- ✓ **Schema Updates**: Updated shared/schema.ts to use MySQL tables and JSON columns
- ✓ **Driver Installation**: Installed MySQL2 driver, removed Neon PostgreSQL dependencies
- ✓ **Memory Storage**: Switched to reliable memory storage for immediate use
- ✓ **Type Safety**: Fixed all TypeScript errors in storage implementation
- ✓ **Top-level Await Fix**: Resolved CommonJS output format issue by refactoring database initialization
- ✓ **Auto-format Detection**: Added automatic MySQL connection string format correction
- ✓ **Documentation**: Created comprehensive database setup guide
- ✓ **Local Deployment Fix**: Fixed ERR_INVALID_ARG_TYPE error by creating server/local.ts and fixing __dirname in ES modules
- ✓ **Path Resolution**: Fixed ES module path resolution issues for local development environment
- ✓ **ES Module Fix**: Converted start-local.js and package-for-local.js from CommonJS to ES module syntax
- ✓ **require() Error Fix**: Resolved "require is not defined in ES module scope" error in local deployment scripts
- ✓ **Environment Variables**: Fixed .env file loading by installing dotenv package and configuring proper loading
- ✓ **MySQL Schema Compatibility**: Updated schema.ts to use VARCHAR/TEXT/TINYINT instead of JSON/BOOLEAN for MySQL 5.7.5+ compatibility
- ✓ **TEXT Field Default Values**: Removed illegal default values from TEXT fields in all SQL files
- ✓ **Data Type Conversion**: Implemented automatic conversion between JSON arrays/objects and TEXT strings in storage layer
- ✓ **Campaign CRUD Operations**: Implemented create vs update distinction with proper UI feedback
- ✓ **Production Build Issues**: Diagnosed and fixed dist/public directory missing, API routes working correctly
- ✓ **Type Validation**: Fixed all field type compatibility issues between frontend and backend schemas

The application follows a modern full-stack architecture with emphasis on type safety, developer experience, and scalable design patterns. The system is designed to be easily extensible for additional features like user authentication, advanced analytics, and integration with external advertising platforms.