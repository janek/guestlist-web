# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `bun run dev` - Start development server (port 3000)
- `bun run build` - Build for production
- `bun run lint` - Format code with Biome
- `bun run db-types` - Generate TypeScript types from Supabase schema
- `bun run create-user` - Admin script to create new users

## Project Architecture

**Guestlist Web** is a Next.js 14 App Router application for managing event guest lists and invitation links, built with TypeScript, Supabase, and shadcn/ui components.

### Tech Stack
- **Next.js 14** with App Router and Server Actions
- **Supabase** for database, auth, and real-time features
- **shadcn/ui** components with Tailwind CSS
- **Biome** for code formatting/linting (not ESLint/Prettier)
- **Bun** as the JavaScript runtime

### Key Architecture Patterns

1. **Single RPC Dashboard Query** (ADR-001): Uses `get_dashboard()` RPC function to eliminate N+1 queries and reduce database calls from 5+ to 1 for performance optimization.

2. **Owner-Based Access Control**: Events are filtered by ownership using RLS policies. All database queries should respect the `owner_id` relationship.

3. **Hydration-Aware Components**: Components render the same content on server and client to prevent layout shifts. Use conditional rendering based on authentication state carefully.

4. **Server Actions**: Form handling uses Next.js Server Actions with Zod validation rather than API routes.

### Database Schema
- **events** - Event information with `owner_id` foreign key
- **guests** - Guest records linked to events and invitation links  
- **links** - Invitation links with usage limits and analytics
- **staff** - Staff members who can create links

### File Structure
- `src/app/` - Next.js App Router pages and API routes
- `src/components/` - React components (use existing shadcn/ui patterns)
- `src/lib/` - Utilities and Supabase client configurations
- `sql/` - PostgreSQL RPC functions
- `scripts/` - Admin utility scripts
- `docs/` - Architecture Decision Records (ADRs)

## Code Conventions

### Component Patterns
- Use shadcn/ui components from `src/components/ui/`
- Follow "new-york" style configuration for new components
- Prefer Server Components unless client interactivity is needed
- Use `createClient()` for client components, `createServerComponentClient()` for server components

### Database Access
- Use the centralized `get_dashboard()` RPC for dashboard data
- Filter queries by `owner_id` for security
- Generate types with `bun run db-types` after schema changes
- Use optimistic updates with real-time synchronization

### Authentication
- Authentication is handled via Supabase Auth with middleware
- No public signup - users are created via admin scripts
- Use `auth.getUser()` for server-side auth checks
- Session management is automatic via middleware

### Styling
- Use Tailwind CSS with the existing design system
- Follow space indentation and trailing commas (Biome config)
- Use CSS variables for theming defined in `app/globals.css`

## Development Notes

- The app uses Supabase's real-time features for live guest updates
- CSV export functionality is built-in for guest lists  
- Invitation links have configurable usage limits and analytics
- Multi-event support allows users to switch between different events
- Staff can be assigned bulk invitation links for distribution

## Testing Commands
Check package.json for available test scripts - no standard test setup was found in the current configuration.