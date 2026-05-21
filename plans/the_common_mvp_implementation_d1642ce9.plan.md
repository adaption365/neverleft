---
name: The Common MVP Implementation
overview: Build a minimalist MVP for intentional human gatherings using Next.js App Router + Supabase, implementing the core Gathering OS with steward setup, invitation system, RSVP management, and the Pass system for continuity without surveillance.
todos:
  - id: setup
    content: Initialize Next.js 15 project with TypeScript, configure Supabase, set up environment variables, and create database schema with migrations
    status: completed
  - id: auth
    content: Implement magic link authentication for stewards using Supabase Auth, create login page and auth callback handler, set up middleware for session management
    status: completed
    dependencies:
      - setup
  - id: database
    content: Create all database tables (stewards, gatherings, invitations, passes, reflections, ritual_templates), implement RLS policies, and seed ritual templates
    status: completed
    dependencies:
      - setup
  - id: onboarding
    content: Build multi-step steward onboarding wizard with email auth, preferences collection, and Stripe payment setup integration
    status: completed
    dependencies:
      - auth
      - database
  - id: gatherings
    content: "Create gathering management system: creation form with artefact/vibe/ritual selection, gathering detail pages, and edit functionality"
    status: completed
    dependencies:
      - onboarding
  - id: invitations
    content: Build invitation system with email sending and shareable link generation, create RSVP acceptance page with token validation
    status: completed
    dependencies:
      - gatherings
  - id: rsvp
    content: Implement RSVP system with seat limit enforcement, time-based guardrails (RSVP closure, event windows), and gathering state management
    status: completed
    dependencies:
      - invitations
  - id: passes
    content: "Implement Pass system: anonymous identifier generation, pass creation after gatherings, and UI for pass holders to view returner gatherings"
    status: completed
    dependencies:
      - rsvp
  - id: reflections
    content: Build private reflection system for stewards with markdown editor and storage, accessible only post-gathering
    status: completed
    dependencies:
      - gatherings
  - id: payments
    content: "Integrate Stripe for Host Stewardship Fees: set up checkout flow, webhook handler, and link payments to gathering creation"
    status: completed
    dependencies:
      - onboarding
  - id: cleanup
    content: Implement scheduled data cleanup (delete invitations 7 days after gathering ends) and verify intentional forgetting policies
    status: completed
    dependencies:
      - database
  - id: polish
    content: Add error handling, loading states, test all flows end-to-end, verify data retention policies, and ensure minimalist UI aligns with philosophy
    status: completed
    dependencies:
      - passes
      - reflections
      - payments
      - cleanup
---

# The Common MVP Implementation Plan

## Architecture Overview

**Tech Stack:**
- Next.js 15 (App Router) with Server Components and Server Actions
- Supabase (PostgreSQL database + Auth for magic link authentication)
- Stripe (Host Stewardship Fees)
- TypeScript throughout

**Core Philosophy:**
- Platform is active before/after gatherings, dormant during them
- Intentional forgetting: attendance data deleted after gatherings
- No feeds, profiles, or social graphs
- Minimalist, focused UI

## Database Schema (Supabase)

### Core Tables

1. **`stewards`** - Minimal host accounts
   - `id` (uuid, primary key, references auth.users)
   - `email` (text, unique)
   - `created_at` (timestamptz)
   - RLS: Users can only read/update their own record

2. **`gatherings`** - Event definitions
   - `id` (uuid, primary key)
   - `steward_id` (uuid, references stewards)
   - `artefact_type` (text: 'book', 'essay', 'question', 'film', etc.)
   - `artefact_reference` (text: title, URL, or description)
   - `vibe` (text: 'campfire', 'salon', 'lab', 'arena')
   - `ritual_structure` (jsonb: opening, collision, integration prompts)
   - `social_contract` (text)
   - `max_seats` (integer)
   - `rsvp_closes_at` (timestamptz)
   - `gathering_starts_at` (timestamptz)
   - `gathering_ends_at` (timestamptz)
   - `open_to_returners` (boolean)
   - `created_at` (timestamptz)
   - RLS: Public read for active gatherings, steward-only for management

3. **`invitations`** - Time-bound access
   - `id` (uuid, primary key)
   - `gathering_id` (uuid, references gatherings)
   - `token` (text, unique) - for shareable links
   - `email` (text, nullable) - for email invitations
   - `rsvp_status` (text: 'pending', 'accepted', 'declined')
   - `expires_at` (timestamptz) - matches rsvp_closes_at
   - `created_at` (timestamptz)
   - RLS: Public read with token, steward can manage

4. **`passes`** - Anonymous continuity (no user linkage)
   - `id` (uuid, primary key)
   - `steward_id` (uuid, references stewards)
   - `anonymous_identifier` (text, unique) - client-side generated
   - `created_at` (timestamptz)
   - RLS: Public read with anonymous_identifier match

5. **`reflections`** - Private steward reflections
   - `id` (uuid, primary key)
   - `steward_id` (uuid, references stewards)
   - `gathering_id` (uuid, references gatherings)
   - `content` (text)
   - `created_at` (timestamptz)
   - RLS: Steward-only access

6. **`ritual_templates`** - Curated library
   - `id` (uuid, primary key)
   - `vibe` (text)
   - `opening_prompt` (text)
   - `collision_prompt` (text)
   - `integration_prompt` (text)
   - `social_contract_template` (text)
   - `is_default` (boolean)

### Data Retention Policy
- Implement scheduled cleanup: Delete `invitations` records 7 days after `gathering_ends_at`
- Passes persist indefinitely (anonymous, no privacy concern)
- Gatherings persist (historical record for stewards)

## Application Structure

```
/app
  /(auth)
    /login                    # Magic link auth for stewards
    /auth/callback            # Supabase auth callback
  /(steward)
    /setup                    # Multi-step steward onboarding wizard
    /gatherings
      /new                    # Create gathering flow
      /[id]                   # View/manage gathering
      /[id]/reflection        # Private post-gathering reflection
  /invite/[token]             # Public invitation acceptance page
  /gathering/[id]             # Public gathering details (pre-event)
  /api
    /stripe/webhook           # Stripe payment webhooks
    /invitations              # Create invitations (steward-only)
    /passes                   # Pass generation/validation
```

## Key Features Implementation

### 1. Steward Onboarding Wizard (`/setup`)

Multi-step form using React Server Actions + `useActionState`:
- **Step 1**: Email collection (triggers magic link)
- **Step 2**: After auth, gather steward preferences
- **Step 3**: Payment setup (Stripe Connect or simple checkout)
- **Step 4**: Welcome/onboarding complete

**Files:**
- `app/(steward)/setup/page.tsx` - Wizard container
- `app/actions/steward.ts` - Server actions for each step
- `app/components/setup/` - Step components

### 2. Gathering Creation Flow (`/gatherings/new`)

Guided flow for creating gatherings:
- Artefact selection (type + reference)
- Vibe selection with preview of ritual templates
- Ritual structure customization (from templates or custom)
- Social contract editor
- Time windows (RSVP close, gathering start/end)
- Seat limits
- Invitation method (email list or shareable link)

**Files:**
- `app/(steward)/gatherings/new/page.tsx`
- `app/actions/gatherings.ts` - Create/update gathering
- `app/components/gatherings/` - Form components

### 3. Invitation System

**Email Invitations:**
- Steward provides email list
- System generates unique tokens per email
- Sends email via Supabase Edge Function or Resend
- Email contains link to `/invite/[token]`

**Shareable Links:**
- Generate single token for gathering
- Shareable URL: `/invite/[token]`
- Anyone with link can RSVP (until seat limit/time limit)

**Files:**
- `app/invite/[token]/page.tsx` - RSVP page
- `app/actions/invitations.ts` - Create invitations, handle RSVP
- `app/api/invitations/route.ts` - API for invitation management

### 4. RSVP & Time Guardrails

- Check `rsvp_closes_at` before allowing RSVP
- Enforce `max_seats` limit
- Show gathering details only before `gathering_starts_at`
- After `gathering_ends_at`, show completion message

**Implementation:**
- Server-side validation in RSVP action
- Client-side UI updates based on time windows

### 5. Pass System

**Generation:**
- After gathering ends, generate Pass for attendees (if steward enabled `open_to_returners`)
- Pass = anonymous database record with client-side identifier
- Store identifier in localStorage/cookie

**Usage:**
- Steward creates new gathering with `open_to_returners=true`
- Pass holders can view these gatherings (read-only list)
- No tracking of which gatherings a pass holder attended

**Files:**
- `app/api/passes/route.ts` - Pass generation/validation
- `app/components/passes/` - Pass display components
- Client-side utilities for pass management

### 6. Private Reflection System

- Post-gathering form for stewards only
- Stored in `reflections` table
- No sharing, no aggregation
- Simple markdown editor

**Files:**
- `app/(steward)/gatherings/[id]/reflection/page.tsx`

### 7. Ritual & Prompt Library

- Seed database with curated templates
- Organized by vibe
- Stewards can use templates or create custom

**Files:**
- `supabase/migrations/seed_ritual_templates.sql`
- `app/components/gatherings/ritual-selector.tsx`

## Design & UI Philosophy

**Design Principles:**
- Minimalist, text-first
- No feeds or infinite scroll
- Focused, single-purpose pages
- Mobile-responsive but desktop-optimized
- Typography and whitespace over graphics

**Component Library:**
- Minimal custom components (buttons, forms, cards)
- No complex UI libraries (avoid heavy dependencies)
- Server Components by default, Client Components only when needed

## Payment Integration (Stripe)

**Host Stewardship Fees:**
- One-time payment per gathering creation (or subscription model)
- Stripe Checkout for payment collection
- Webhook handler for payment confirmation
- Link payment to gathering creation

**Files:**
- `app/api/stripe/webhook/route.ts`
- `app/actions/payments.ts`

## Security & Privacy

**RLS Policies:**
- Stewards can only manage their own gatherings
- Public can read active gatherings (before start time)
- Invitations are token-based (no auth required)
- Reflections are steward-only
- Passes are anonymous (no user linkage)

**Data Minimization:**
- No analytics beyond aggregate usage
- No tracking of individual behavior
- Scheduled cleanup of attendance data
- Passes contain no personal information

## Implementation Todos

1. **Project Setup**
   - Initialize Next.js 15 project with TypeScript
   - Configure Supabase project and environment variables
   - Set up database schema and migrations
   - Configure Supabase SSR client utilities

2. **Authentication**
   - Implement magic link auth for stewards
   - Create auth callback handler
   - Set up middleware for session refresh
   - Build login page

3. **Database & RLS**
   - Create all tables with proper constraints
   - Implement RLS policies
   - Seed ritual templates
   - Set up scheduled cleanup functions

4. **Steward Onboarding**
   - Build multi-step wizard UI
   - Implement server actions for each step
   - Integrate Stripe payment setup
   - Create steward profile creation

5. **Gathering Management**
   - Build gathering creation form
   - Implement ritual template selector
   - Create gathering detail/view pages
   - Add gathering edit functionality

6. **Invitation System**
   - Build invitation creation UI
   - Implement email sending (Resend or Supabase Edge Function)
   - Create shareable link generation
   - Build RSVP acceptance page

7. **RSVP & Guardrails**
   - Implement seat limit enforcement
   - Add time-based validation
   - Create RSVP status management
   - Build gathering state UI (pre/during/post)

8. **Pass System**
   - Implement pass generation logic
   - Create anonymous identifier system
   - Build pass validation API
   - Create UI for pass holders to view returner gatherings

9. **Reflection System**
   - Build private reflection form
   - Implement markdown editor
   - Create reflection storage

10. **Payment Integration**
    - Set up Stripe account and API keys
    - Implement checkout flow
    - Create webhook handler
    - Link payments to gathering creation

11. **Polish & Testing**
    - Add error handling throughout
    - Implement loading states
    - Test all flows end-to-end
    - Verify data retention policies

## Key Files to Create

**Core Infrastructure:**
- `lib/supabase/server.ts` - Server-side Supabase client
- `lib/supabase/middleware.ts` - Middleware client
- `lib/supabase/client.ts` - Browser client
- `lib/validations.ts` - Zod schemas

**Server Actions:**
- `app/actions/steward.ts`
- `app/actions/gatherings.ts`
- `app/actions/invitations.ts`
- `app/actions/passes.ts`
- `app/actions/reflections.ts`

**Database:**
- `supabase/migrations/001_initial_schema.sql`
- `supabase/migrations/002_seed_templates.sql`

**Components:**
- `app/components/gatherings/` - Gathering-related components
- `app/components/setup/` - Onboarding wizard components
- `app/components/ui/` - Minimal UI primitives

This plan maintains the philosophy of The Common: minimal infrastructure that enables gatherings without capturing attention or building social graphs. The platform disappears when it should, and remembers only what's necessary for stewardship.