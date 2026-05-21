---
name: 360-Degree Entity Cards
overview: Build out comprehensive entity cards for all Knowledge Graph entities (Client, Project, Skill, Product, Opportunity, Company) following the EnhancedEmployeeCard pattern. Each card will show related entities and relationships, providing a complete 360-degree view of any entity in the graph.
todos:
  - id: rpc-client-people
    content: Create RPC function get_client_people_rpc.sql to fetch people who worked with a client via projects (Client ← FOR_CLIENT ← Work Item ← CONTRIBUTED_TO ← Person)
    status: completed
  - id: rpc-client-projects
    content: Create RPC function get_client_projects_rpc.sql to fetch all projects for a client (Client ← FOR_CLIENT ← Work Item)
    status: completed
  - id: rpc-project-team
    content: Create RPC function get_project_team_rpc.sql to fetch team members on a project (Project ← CONTRIBUTED_TO ← Person)
    status: completed
  - id: rpc-project-client
    content: Create RPC function get_project_client_rpc.sql to fetch client for a project (Project → FOR_CLIENT → Client)
    status: completed
  - id: rpc-skill-experts
    content: Create RPC function get_skill_experts_rpc.sql to fetch people with a skill from person_skill_expertise materialized view
    status: completed
  - id: rpc-skill-projects
    content: Create RPC function get_skill_projects_rpc.sql to fetch projects using a skill (via ABOUT_TOPIC or Person → Projects)
    status: completed
  - id: service-client-functions
    content: Add getClientPeople() and getClientProjects() functions to kgService.ts
    status: completed
  - id: service-project-functions
    content: Add getProjectTeam() and getProjectClient() functions to kgService.ts
    status: completed
  - id: service-skill-functions
    content: Add getSkillExperts() and getSkillProjects() functions to kgService.ts
    status: completed
  - id: enhance-client-card
    content: Transform ClientResultCard to show People, Projects, Skills, and Products sections with clickable pills, following EnhancedEmployeeCard pattern
    status: completed
  - id: enhance-project-card
    content: Transform ProjectResultCard to show Client, Team, Skills, and Related Projects sections
    status: completed
  - id: enhance-skill-card
    content: Transform SkillResultCard to show Experts (with levels), Projects, and Clients sections with skill level indicators
    status: completed
  - id: enhance-product-card
    content: Transform ProductResultCard to show Experts, Projects, and Clients sections
    status: pending
  - id: enhance-opportunity-card
    content: Transform OpportunityResultCard to show Client, Team, Skills, and Related Opportunities sections
    status: pending
  - id: hooks-client-people
    content: Create useClientPeople() hook in src/hooks/ using TanStack Query to fetch people who worked with a client
    status: completed
  - id: hooks-client-projects
    content: Create useClientProjects() hook in src/hooks/ using TanStack Query to fetch projects for a client
    status: completed
  - id: hooks-project-team
    content: Create useProjectTeam() hook in src/hooks/ using TanStack Query to fetch team members on a project
    status: completed
  - id: hooks-project-client
    content: Create useProjectClient() hook in src/hooks/ using TanStack Query to fetch client for a project
    status: completed
  - id: hooks-skill-experts
    content: Create useSkillExperts() hook in src/hooks/ using TanStack Query to fetch experts with a skill
    status: completed
  - id: hooks-skill-projects
    content: Create useSkillProjects() hook in src/hooks/ using TanStack Query to fetch projects using a skill
    status: completed
  - id: hooks-product-experts
    content: Create useProductExperts() hook in src/hooks/ using TanStack Query to fetch experts with a product
    status: pending
  - id: hooks-product-projects
    content: Create useProductProjects() hook in src/hooks/ using TanStack Query to fetch projects using a product
    status: pending
---

# 360-D

egree Entity Cards Implementation Plan

## Overview

Transform all entity cards from basic displays into rich, comprehensive views that show all related entities and relationships, following the pattern established by `EnhancedEmployeeCard`. This enables users to enter the knowledge graph at any point and see a complete 360-degree view.

## Entity Types & Current State

### ✅ Employee (Complete)

- **Component**: `EnhancedEmployeeCard.tsx`
- **Shows**: Skills, Projects, Clients, Collaborators, Industries, Location, Bio
- **Status**: Fully implemented with rich UI

### ❌ Client (Basic)

- **Component**: `ClientResultCard.tsx`
- **Currently Shows**: Name, industry, sector, employee count, project count
- **Needs**: People who worked with client, projects, skills used, industries, products

### ❌ Project (Basic)

- **Component**: `ProjectResultCard.tsx`
- **Currently Shows**: Name, status, complexity, team size
- **Needs**: Client, team members, skills used, related projects, timeline

### ❌ Skill (Basic)

- **Component**: `SkillResultCard.tsx`
- **Currently Shows**: Name, employee count, project count, client count
- **Needs**: Experts (with levels), projects using skill, clients, related skills

### ❌ Product (Basic)

- **Component**: `ProductResultCard.tsx`
- **Currently Shows**: Name, category, type, employee count
- **Needs**: Experts, projects, clients, related products, industries

### ❌ Opportunity (Basic)

- **Component**: `OpportunityResultCard.tsx`
- **Currently Shows**: Name, outcome, industry, value
- **Needs**: Client, team members, related projects, skills required, timeline

### ❌ Company (Basic)

- **Component**: `CompanyResultCard.tsx`
- **Needs**: Full analysis

## Relationship Mapping

Based on KG canonical patterns (`docs/KG_CANONICAL_QUERIES.md`):

### Client Card Should Show:

1. **People** (via: Client ← FOR_CLIENT ← Work Item ← CONTRIBUTED_TO ← Person)

- Team members who worked with this client
- Roles on projects
- Recency (last worked together)
- Relationship strength

2. **Projects** (via: Client ← FOR_CLIENT ← Work Item)

- All projects for this client
- Status, dates, complexity
- Team sizes

3. **Skills** (via: Client → Work Item → Person → Skills)

- Skills brought to this client
- Expert levels
- Frequency of use

4. **Industries & Sectors**

- Industry classification
- Sector (if applicable)

5. **Products**

- Products used in client projects

### Project Card Should Show:

1. **Client** (via: Project → FOR_CLIENT → Client)

- Client name and details
- Industry

2. **Team Members** (via: Project ← CONTRIBUTED_TO ← Person)

- All contributors
- Roles on project
- Time periods

3. **Skills** (via: Project → ABOUT_TOPIC → Skill OR Project → Person → Skills)

- Skills used in project
- Expert levels

4. **Related Projects**

- Same client projects
- Similar skills/technologies

5. **Timeline & Status**

- Start/end dates
- Current status
- Complexity, budget, duration

### Skill Card Should Show:

1. **Experts** (via: Skill ← HAS_EXPERTISE ← Person)

- People with this skill
- Expertise levels (Expert/Advanced/Intermediate/Beginner)
- Years of experience
- From `person_skill_expertise` materialized view

2. **Projects** (via: Skill ← ABOUT_TOPIC ← Work Item OR Skill ← Person → Projects)

- Projects using this skill
- Client context

3. **Clients** (via: Skill → Person → Projects → Client)

- Clients where skill was used

4. **Related Skills**

- Skills often used together
- Skill taxonomy relationships

### Product Card Should Show:

1. **Experts** (via: Product → Person expertise)

- People with product expertise
- Experience levels

2. **Projects** (via: Product → Work Item)

- Projects using this product
- Client context

3. **Clients** (via: Product → Projects → Client)

- Clients using product

4. **Related Products**

- Similar or complementary products

### Opportunity Card Should Show:

1. **Client** (via: Opportunity → FOR_CLIENT → Client)

- Client details

2. **Team Members** (via: Opportunity ← CONTRIBUTED_TO ← Person)

- People working on opportunity
- Roles

3. **Skills Required**

- Skills needed for opportunity

4. **Related Projects**

- Similar opportunities
- Won/lost projects

5. **Value & Timeline**

- Deal value
- Status (Won/Lost/In Progress)
- Dates

## Frontend-Backend Interaction Pattern

**CRITICAL**: All data fetching must follow this single, consistent pattern:

### For READ Operations (Queries):

```javascript
Component → TanStack Query Hook → Service Function → Supabase RPC → Database
```

**Why this pattern:**

- ✅ **Performance**: No HTTP overhead, direct database connection
- ✅ **Security**: RLS enforces security at database level
- ✅ **Caching**: TanStack Query handles automatic caching and refetching
- ✅ **Type Safety**: Full TypeScript support through service layer
- ✅ **Consistency**: Single pattern for all read operations

**Example Pattern:**

```typescript
// 1. Service function (src/services/kgService.ts)
export async function getClientPeople(orgId: string, clientNodeId: string, limit?: number) {
  const client = createSupabaseClientForOrg(orgId);
  const { data, error } = await client.rpc('get_client_people', {
    p_tenant_id: orgId,
    p_client_node_id: clientNodeId,
    p_limit: limit ?? 10,
  });
  // Transform and return data
}

// 2. Custom hook (src/hooks/useClientPeople.ts)
import { useQuery } from '@tanstack/react-query';
import { getClientPeople } from '@/services/kgService';

export function useClientPeople(clientNodeId: string, orgId: string | null, limit?: number) {
  return useQuery({
    queryKey: ['client-people', clientNodeId, orgId, limit],
    queryFn: () => getClientPeople(orgId!, clientNodeId, limit),
    enabled: !!clientNodeId && !!orgId,
  });
}

// 3. Component usage
function ClientCard({ clientId }: { clientId: string }) {
  const orgId = getCurrentOrgId();
  const { data: people, isLoading, error } = useClientPeople(clientId, orgId);
  // Render card with data
}
```



### For WRITE Operations (Mutations):

```javascript
Component → TanStack Query Mutation → API Route → Service Function → Supabase RPC → Database
```

**Why API routes for writes:**

- ✅ **Server-side validation**: Complex business logic validation
- ✅ **Audit logging**: Track all mutations server-side
- ✅ **Side effects**: Email notifications, webhooks, external API calls
- ✅ **Security**: Additional authorization checks beyond RLS

**Note**: For this entity cards project, we're primarily doing READ operations, so we'll use the direct service pattern.

### Key Principles:

1. **Never call Supabase directly from components** - Always use service functions
2. **Never use API routes for reads** - Use service functions + TanStack Query
3. **Always wrap service calls in custom hooks** - Provides consistent caching and error handling
4. **Use TanStack Query for all async data** - Automatic caching, refetching, loading states

## Implementation Strategy

### Phase 1: RPC Functions (Database Layer)

Create RPC functions following the pattern of `get_person_projects` and `get_person_collaborators`:

1. **`get_client_people_rpc.sql`**

- Returns: People who worked with client via projects
- Pattern: Client ← FOR_CLIENT ← Work Item ← CONTRIBUTED_TO ← Person
- Fields: person_id, person_name, project_name, role, start_date, end_date, is_current

2. **`get_client_projects_rpc.sql`**

- Returns: All projects for a client
- Pattern: Client ← FOR_CLIENT ← Work Item
- Fields: project_id, project_name, status, start_date, end_date, team_size, complexity

3. **`get_project_team_rpc.sql`**

- Returns: Team members on a project
- Pattern: Project ← CONTRIBUTED_TO ← Person
- Fields: person_id, person_name, role, start_date, end_date, is_current

4. **`get_project_client_rpc.sql`**

- Returns: Client for a project
- Pattern: Project → FOR_CLIENT → Client
- Fields: client_id, client_name, industry, sector

5. **`get_skill_experts_rpc.sql`**

- Returns: People with this skill (from `person_skill_expertise`)
- Fields: person_id, person_name, level, years_experience, strength, confidence

6. **`get_skill_projects_rpc.sql`**

- Returns: Projects using this skill
- Pattern: Skill ← ABOUT_TOPIC ← Work Item OR Skill ← Person → Projects
- Fields: project_id, project_name, client_name, start_date, end_date

7. **`get_product_experts_rpc.sql`**

- Returns: People with product expertise
- Similar to skill experts

8. **`get_product_projects_rpc.sql`**

- Returns: Projects using this product

### Phase 2: Service Layer Functions

Add functions to `src/services/kgService.ts` following the pattern of `getPersonProjects` and `getPersonCollaborators`:**Required Functions:**

- `getClientPeople(orgId, clientNodeId, limit?)` - Returns people who worked with client
- `getClientProjects(orgId, clientNodeId, limit?)` - Returns all projects for a client
- `getProjectTeam(orgId, projectNodeId, limit?)` - Returns team members on a project
- `getProjectClient(orgId, projectNodeId)` - Returns client for a project
- `getSkillExperts(orgId, skillNodeId, limit?)` - Returns experts with a skill
- `getSkillProjects(orgId, skillNodeId, limit?)` - Returns projects using a skill
- `getProductExperts(orgId, productNodeId, limit?)` - Returns experts with a product
- `getProductProjects(orgId, productNodeId, limit?)` - Returns projects using a product

**Implementation Pattern:**

```typescript
export async function getClientPeople(
  organizationId: string,
  clientNodeId: string,
  limit?: number
): Promise<ClientPerson[]> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured');
  }

  const client = createSupabaseClientForOrg(organizationId);
  if (!client) {
    throw new Error('Supabase is not configured');
  }

  try {
    const { data, error } = await client.rpc('get_client_people', {
      p_tenant_id: organizationId,
      p_client_node_id: clientNodeId,
      p_limit: limit ?? 10,
    });

    if (error) {
      console.error('[kgService] Error fetching client people:', error);
      return [];
    }

    return (data || []).map(transformClientPerson);
  } catch (error) {
    console.error('[kgService] Exception in getClientPeople:', error);
    return [];
  }
}
```



### Phase 2.5: Custom Hooks (TanStack Query)

Create custom hooks in `src/hooks/` that wrap service functions with TanStack Query:**Required Hooks:**

- `useClientPeople(clientNodeId, orgId, limit?)` - Wraps `getClientPeople`
- `useClientProjects(clientNodeId, orgId, limit?)` - Wraps `getClientProjects`
- `useProjectTeam(projectNodeId, orgId, limit?)` - Wraps `getProjectTeam`
- `useProjectClient(projectNodeId, orgId)` - Wraps `getProjectClient`
- `useSkillExperts(skillNodeId, orgId, limit?)` - Wraps `getSkillExperts`
- `useSkillProjects(skillNodeId, orgId, limit?)` - Wraps `getSkillProjects`
- `useProductExperts(productNodeId, orgId, limit?)` - Wraps `getProductExperts`
- `useProductProjects(productNodeId, orgId, limit?)` - Wraps `getProductProjects`

**Implementation Pattern:**

```typescript
// src/hooks/useClientPeople.ts
import { useQuery } from '@tanstack/react-query';
import { getClientPeople } from '@/services/kgService';
import { getCurrentOrgId } from '@/lib/orgContext';

export function useClientPeople(
  clientNodeId: string | null,
  orgId?: string | null,
  limit?: number
) {
  const currentOrgId = orgId || getCurrentOrgId();

  return useQuery({
    queryKey: ['client-people', clientNodeId, currentOrgId, limit],
    queryFn: () => {
      if (!clientNodeId || !currentOrgId) {
        throw new Error('Client node ID and organization ID are required');
      }
      return getClientPeople(currentOrgId, clientNodeId, limit);
    },
    enabled: !!clientNodeId && !!currentOrgId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

**Benefits:**

- Automatic caching and deduplication
- Loading and error states handled
- Automatic refetching on window focus
- Query invalidation support
- Type-safe with TypeScript

### Phase 3: Enhanced Card Components

Transform each adaptive card component:

1. **EnhancedClientCard** (`src/components/shared/adaptive/ClientResultCard.tsx`)

- Add sections: People, Projects, Skills, Products
- Use violet/teal color scheme (matching employee card style)
- Clickable pills for navigation
- Stats dashboard at top

2. **EnhancedProjectCard** (`src/components/shared/adaptive/ProjectResultCard.tsx`)

- Add sections: Client, Team, Skills, Related Projects
- Timeline visualization
- Status badges

3. **EnhancedSkillCard** (`src/components/shared/adaptive/SkillResultCard.tsx`)

- Add sections: Experts (with levels), Projects, Clients
- Skill level indicators (dots like employee card)
- Related skills

4. **EnhancedProductCard** (`src/components/shared/adaptive/ProductResultCard.tsx`)

- Add sections: Experts, Projects, Clients
- Related products

5. **EnhancedOpportunityCard** (`src/components/shared/adaptive/OpportunityResultCard.tsx`)

- Add sections: Client, Team, Skills, Related Opportunities
- Value visualization
- Status timeline

### Phase 4: Data Fetching Integration

Update card components to use custom TanStack Query hooks:**Pattern for Each Card:**

```typescript
// Example: ClientResultCard.tsx
import { useClientPeople } from '@/hooks/useClientPeople';
import { useClientProjects } from '@/hooks/useClientProjects';

export default function ClientResultCard({ result }: ClientResultCardProps) {
  const orgId = getCurrentOrgId();
  const clientNodeId = result.id; // Assuming result.id is the node_id

  // Fetch related data using custom hooks
  const { data: people, isLoading: loadingPeople } = useClientPeople(clientNodeId, orgId, 5);
  const { data: projects, isLoading: loadingProjects } = useClientProjects(clientNodeId, orgId, 5);

  // Render card with data
  return (
    <div>
      {loadingPeople || loadingProjects ? (
        <SkeletonLoader />
      ) : (
        <>
          {people && people.length > 0 && (
            <PeopleSection people={people} />
          )}
          {projects && projects.length > 0 && (
            <ProjectsSection projects={projects} />
          )}
        </>
      )}
    </div>
  );
}
```

**Key Requirements:**

- ✅ Use custom hooks (not `useState`/`useEffect`)
- ✅ Show loading states (skeleton loaders or spinners)
- ✅ Handle errors gracefully (show empty state or error message)
- ✅ Enable queries only when required data is available (`enabled` option)
- ✅ Set appropriate `staleTime` for caching (5 minutes for entity relationships)

### Phase 5: Navigation & Filtering

- Make all related entity pills clickable
- Navigate to filtered search or entity detail pages
- Use `buildSearchUrl` pattern from employee card
- Support filter clicks (e.g., clicking a skill filters search by that skill)

## File Structure

```javascript
supabase/migrations/
  116_get_client_people_rpc.sql
  117_get_client_projects_rpc.sql
  118_get_project_team_rpc.sql
  119_get_project_client_rpc.sql
  120_get_skill_experts_rpc.sql
  121_get_skill_projects_rpc.sql
  122_get_product_experts_rpc.sql
  123_get_product_projects_rpc.sql

src/services/
  kgService.ts (add new functions)

src/hooks/
  useClientPeople.ts (new)
  useClientProjects.ts (new)
  useProjectTeam.ts (new)
  useProjectClient.ts (new)
  useSkillExperts.ts (new)
  useSkillProjects.ts (new)
  useProductExperts.ts (new)
  useProductProjects.ts (new)

src/components/shared/adaptive/
  ClientResultCard.tsx (enhance)
  ProjectResultCard.tsx (enhance)
  SkillResultCard.tsx (enhance)
  ProductResultCard.tsx (enhance)
  OpportunityResultCard.tsx (enhance)
```



## Design Principles

1. **Consistency**: Follow `EnhancedEmployeeCard` design patterns
2. **Color Coding**: Use entity-specific colors (green for clients, orange for projects, indigo for skills, etc.)
3. **Clickable Pills**: All related entities are clickable navigation elements
4. **Progressive Disclosure**: Show top 2-3 items, with "+X more" indicators
5. **Visual Hierarchy**: Stats dashboard at top, sections below
6. **Loading States**: Skeleton loaders while fetching
7. **Error Handling**: Graceful degradation if data unavailable

## Priority Order

1. **Client Card** (highest value - shows who knows the client)
2. **Project Card** (shows team and context)
3. **Skill Card** (shows expertise network)
4. **Product Card** (shows product usage)
5. **Opportunity Card** (shows deal context)

## Success Criteria

- Each card shows all relevant related entities
- All relationships are explainable (via work items)
- Navigation works (clicking pills filters/navigates)
- Performance is acceptable (RPC functions are optimized)
- UI is consistent with employee card design
- **Data fetching follows the single pattern**: Component → TanStack Query Hook → Service → RPC
- **No direct Supabase calls from components** - All go through service layer