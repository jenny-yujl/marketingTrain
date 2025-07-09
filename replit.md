# Advertising Campaign Management System

## Overview

This is a full-stack web application for managing advertising campaigns, specifically designed for live streaming promotional systems. The application provides a step-by-step interface for creating and configuring marketing campaigns with features like product management, user targeting, budget scheduling, and performance analytics.

## User Preferences

Preferred communication style: Simple, everyday language.
User requested cross-platform deployment capability for both Windows and Linux environments.
Port configuration: Frontend 3100, Backend 5100 to avoid conflicts with other services.

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
- **Campaigns Table**: Stores all campaign configuration data with JSONB arrays for complex data
- **Products Table**: Product catalog with pricing and descriptions
- **PostgreSQL Integration**: Neon Database with persistent storage replacing memory storage
- **Schema Export**: Complete SQL schema available in `database_schema.sql`
- **Type Safety**: Generated TypeScript types from database schema via Drizzle ORM

### Cross-Platform Deployment
- **Windows Support**: Native batch scripts with automatic dependency checking
- **Linux Support**: Shell scripts with Unix-style process management  
- **macOS Support**: Uses Linux scripts for compatibility
- **Auto-Detection**: JavaScript-based launcher that detects OS automatically
- **Port Configuration**: Frontend 3100, Backend 5100 for conflict avoidance
- **Dependencies**: cross-env package for environment variable handling across platforms

### Deployment Files
- `start-cross-platform.js`: Universal launcher with OS detection
- `start-full-windows.bat`: Interactive Windows launcher with menu options
- `start-linux.sh`: Linux/macOS shell script with process management
- `start.js`: Simplified cross-platform launcher
- `CROSS_PLATFORM_DEPLOYMENT.md`: Complete deployment documentation
- `WINDOWS_DEPLOYMENT.md`: Windows-specific installation guide

The application follows a modern full-stack architecture with emphasis on type safety, developer experience, and scalable design patterns. The system is designed to be easily extensible for additional features like user authentication, advanced analytics, and integration with external advertising platforms.