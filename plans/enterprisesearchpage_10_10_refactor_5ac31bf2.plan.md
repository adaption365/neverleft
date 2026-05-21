---
name: EnterpriseSearchPage 10/10 Refactor
overview: Comprehensive refactoring plan to transform EnterpriseSearchPage.tsx from 4.5/10 to 10/10 by addressing security vulnerabilities, performance issues, and maintainability problems through server-side architecture, React Query integration, component decomposition, and best practices implementation.
todos:
  - id: create-server-client
    content: Create src/lib/supabase/server.ts with createServerSupabaseClient() following @supabase/ssr best practices
    status: completed
  - id: create-saved-employees-rpc
    content: Create migration 108_add_saved_employees_rpc.sql with save_employee() RPC function
    status: completed
  - id: create-server-actions
    content: Create src/app/actions/savedEmployees.ts with saveEmployee() Server Action
    status: completed
    dependencies:
      - create-server-client
      - create-saved-employees-rpc
  - id: install-react-query
    content: Install @tanstack/react-query and @tanstack/react-query-devtools packages
    status: completed
  - id: create-query-provider
    content: Create or update src/app/providers.tsx with QueryClientProvider
    status: completed
    dependencies:
      - install-react-query
  - id: extract-use-employees-hook
    content: Create src/hooks/useEmployees.ts with useInfiniteQuery for paginated employee loading
    status: completed
    dependencies:
      - install-react-query
  - id: extract-use-search-results-hook
    content: Create src/hooks/useSearchResults.ts with useQuery for search results with request cancellation
    status: completed
    dependencies:
      - install-react-query
  - id: extract-use-filter-counts-hook
    content: Create src/hooks/useFilterCounts.ts with useQuery for filter counts
    status: completed
    dependencies:
      - install-react-query
  - id: split-search-filters
    content: Extract SearchFilters component (~300 lines) from EnterpriseSearchPage.tsx
    status: completed
  - id: split-search-results
    content: Extract SearchResults component (~400 lines) from EnterpriseSearchPage.tsx
    status: completed
  - id: split-employee-results
    content: Extract EmployeeResults component (~200 lines) from EnterpriseSearchPage.tsx
    status: completed
  - id: create-server-wrapper
    content: Create src/app/search/page.tsx as Server Component wrapper that validates auth and passes user to client component
    status: completed
    dependencies:
      - create-server-client
  - id: refactor-to-client-component
    content: Rename EnterpriseSearchPage.tsx to EnterpriseSearchPageClient.tsx and update to use custom hooks and receive user as prop
    status: pending
    dependencies:
      - extract-use-employees-hook
      - extract-use-search-results-hook
      - extract-use-filter-counts-hook
      - split-search-filters
      - split-search-results
      - split-employee-results
  - id: replace-direct-queries
    content: Replace direct saved_employees table queries (lines 890-915) with Server Action call
    status: pending
    dependencies:
      - create-server-actions
      - refactor-to-client-component
  - id: implement-pagination
    content: Update employee loading to use pagination (50 per page) instead of loading 1000 upfront
    status: pending
    dependencies:
      - extract-use-employees-hook
  - id: add-request-cancellation
    content: Add AbortController support to all data fetching hooks and services
    status: completed
    dependencies:
      - extract-use-search-results-hook
  - id: batch-filter-counts
    content: Create get_all_filter_counts RPC function to batch 8 parallel calls into 1 (optional optimization)
    status: pending
  - id: centralize-error-handling
    content: Create src/utils/errorHandler.ts and update all error handling to use centralized approach
    status: completed
  - id: add-error-boundary
    content: Create ErrorBoundary component and wrap search page
    status: completed
  - id: improve-type-safety
    content: Add strict TypeScript types, remove any types, add runtime validation
    status: completed
  - id: add-unit-tests
    content: Write unit tests for custom hooks, Server Actions, and utility functions
    status: completed
    dependencies:
      - extract-use-employees-hook
      - extract-use-search-results-hook
      - create-server-actions
  - id: add-integration-tests
    content: Write integration tests for search flow, filters, and pagination
    status: pending
    dependencies:
      - refactor-to-client-component
  - id: write-documentation
    content: Document component architecture, hook usage patterns, and create migration guide
    status: pending
---

#EnterpriseSearchPage.tsx: 4.5/10 to 10/10 Refactoring Plan

## Current State Analysis

**Component**: `aperture-next/src/components/EnterpriseSearchPage.tsx`

- **Lines**: 2,474
- **Type**: Client Component (`'use client'`)
- **Score**: 4.5/10
- **Critical Issues**: Security vulnerabilities, performance problems, monolithic structure

## Target State (10/10)

### Security (10/10)

- All database operations use server-side clients
- Zero direct table queries in components
- All mutations via Server Actions
- Server-side session validation
- RPC functions for all data access

### Performance (10/10)

- Initial page load < 1 second
- Paginated data loading (50 items per page)
- React Query caching (80%+ hit rate)
- Request cancellation for stale queries
- Optimized bundle size

### Maintainability (10/10)

- Largest component < 300 lines
- Clear separation of concerns
- Reusable custom hooks
- Comprehensive error handling
- Full TypeScript coverage

## Implementation Plan

### Phase 1: Foundation & Security (Week 1)

#### 1.1 Create Server-Side Supabase Client Utilities

**File**: `src/lib/supabase/server.ts` (NEW)Create server-side client factory following `@supabase/ssr` best practices:

```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
        remove(name, options) {
          cookieStore.set(name, '', { ...options, maxAge: 0 });
        },
      },
    }
  );
}

export async function createServerSupabaseClientForOrg(orgId: string) {
  const client = await createServerSupabaseClient();
  // Org validation happens in RPC functions
  return client;
}
```



#### 1.2 Create RPC Functions for saved_employees

**File**: `supabase/migrations/108_add_saved_employees_rpc.sql` (NEW)

```sql
-- RPC function to save/unsave employee
CREATE OR REPLACE FUNCTION public.save_employee(
  p_tenant_id UUID,
  p_user_id UUID,
  p_employee_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, auth
AS $$
DECLARE
  v_tenant_id UUID;
  v_existing_id UUID;
  v_result JSONB;
BEGIN
  -- Verify tenant membership
  v_tenant_id := public.current_tenant_id();
  IF v_tenant_id IS NULL OR v_tenant_id != p_tenant_id THEN
    RAISE EXCEPTION 'Access denied: Invalid tenant';
  END IF;

  -- Verify user is member of tenant
  IF NOT public.is_user_member_of_org(p_tenant_id) THEN
    RAISE EXCEPTION 'Access denied: Not a member of organization';
  END IF;

  -- Check if already saved
  SELECT id INTO v_existing_id
  FROM public.saved_employees
  WHERE user_id = p_user_id
    AND employee_id = p_employee_id
    AND organization_id = p_tenant_id
  LIMIT 1;

  IF v_existing_id IS NOT NULL THEN
    -- Remove from saved
    DELETE FROM public.saved_employees WHERE id = v_existing_id;
    v_result := jsonb_build_object('action', 'removed', 'id', v_existing_id);
  ELSE
    -- Add to saved
    INSERT INTO public.saved_employees (user_id, employee_id, organization_id)
    VALUES (p_user_id, p_employee_id, p_tenant_id)
    RETURNING id INTO v_existing_id;
    v_result := jsonb_build_object('action', 'saved', 'id', v_existing_id);
  END IF;

  RETURN v_result;
END;
$$;
```



#### 1.3 Create Server Actions

**File**: `src/app/actions/savedEmployees.ts` (NEW)

```typescript
'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getCurrentOrgId } from '@/lib/orgContext';

export async function saveEmployee(employeeId: string) {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    throw new Error('Unauthorized');
  }

  const orgId = getCurrentOrgId();
  if (!orgId) {
    throw new Error('Organization context required');
  }

  const { data, error } = await supabase.rpc('save_employee', {
    p_tenant_id: orgId,
    p_user_id: user.id,
    p_employee_id: employeeId,
  });

  if (error) throw error;
  return data;
}
```



#### 1.4 Install React Query

**Action**: Add `@tanstack/react-query` to dependencies

```bash
npm install @tanstack/react-query
```

**File**: `src/app/providers.tsx` (NEW or UPDATE)

```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```



### Phase 2: Component Decomposition (Week 1-2)

#### 2.1 Extract Custom Hooks

**File**: `src/hooks/useEmployees.ts` (NEW)

```typescript
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { getPersonNodes, transformPersonToEmployee } from '@/services/kgService';
import { Employee } from '@/types';

const EMPLOYEES_PAGE_SIZE = 50;

export function useEmployees(orgId: string | null) {
  return useInfiniteQuery({
    queryKey: ['employees', orgId],
    queryFn: async ({ pageParam = 0 }) => {
      if (!orgId) return { employees: [], hasMore: false };
      
      const personNodes = await getPersonNodes(orgId, {
        limit: EMPLOYEES_PAGE_SIZE,
        offset: pageParam * EMPLOYEES_PAGE_SIZE,
      });

      const employees = await Promise.all(
        personNodes.map(node => transformPersonToEmployee(node, orgId))
      );

      return {
        employees,
        hasMore: personNodes.length === EMPLOYEES_PAGE_SIZE,
        nextPage: pageParam + 1,
      };
    },
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextPage : undefined,
    enabled: !!orgId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAllEmployees(orgId: string | null): Employee[] {
  const { data } = useEmployees(orgId);
  return data?.pages.flatMap(page => page.employees) ?? [];
}
```

**File**: `src/hooks/useSearchResults.ts` (NEW)

```typescript
import { useQuery } from '@tanstack/react-query';
import { unifiedSearch } from '@/services/unifiedSearchService';
import { SearchFilters, EntityType } from '@/types';

export function useSearchResults(
  query: string,
  filters: SearchFilters,
  entityTypes: EntityType[],
  orgId: string | null
) {
  return useQuery({
    queryKey: ['search', query, filters, entityTypes, orgId],
    queryFn: async () => {
      if (!orgId) return [];
      
      return unifiedSearch(query, {
        organizationId: orgId,
        entityTypes: entityTypes.length > 0 ? entityTypes : ['employee'],
        limitPerType: 200,
        maxResults: 1000,
        minRelevance: 0.01,
        enableFuzzySearch: true,
        filters,
      });
    },
    enabled: !!orgId && (!!query.trim() || hasActiveFilters(filters)),
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
  });
}

function hasActiveFilters(filters: SearchFilters): boolean {
  return !!(
    filters.skill?.length ||
    filters.industry?.length ||
    filters.location?.length ||
    filters.client?.length ||
    filters.product?.length ||
    filters.department?.length
  );
}
```

**File**: `src/hooks/useFilterCounts.ts` (NEW)

```typescript
import { useQuery } from '@tanstack/react-query';
import { getKGCounts } from '@/services/filterLookupService';
import { FilterLookups } from '@/services/filterLookupService';

export function useFilterCounts(filterLookups: FilterLookups | null) {
  return useQuery({
    queryKey: ['filterCounts', filterLookups],
    queryFn: async () => {
      if (!filterLookups) return {};

      const [skills, industries, sectors, locations, clients, products, roles, departments] = 
        await Promise.all([
          getKGCounts('skill', filterLookups.skills).catch(() => ({})),
          getKGCounts('industry', filterLookups.industries).catch(() => ({})),
          getKGCounts('sector', filterLookups.sectors).catch(() => ({})),
          getKGCounts('location', filterLookups.locations).catch(() => ({})),
          getKGCounts('client', filterLookups.clients).catch(() => ({})),
          getKGCounts('product', filterLookups.products.map(p => p.name)).catch(() => ({})),
          getKGCounts('role', filterLookups.roles).catch(() => ({})),
          getKGCounts('department', filterLookups.departments).catch(() => ({})),
        ]);

      return {
        skills,
        industries,
        sectors,
        locations,
        clients,
        products,
        roles,
        departments,
      };
    },
    enabled: !!filterLookups,
    staleTime: 10 * 60 * 1000, // 10 minutes for filter counts
  });
}
```



#### 2.2 Split Component into Smaller Pieces

**File**: `src/components/search/SearchFilters.tsx` (NEW, ~300 lines)Extract filter UI and logic from EnterpriseSearchPage.**File**: `src/components/search/SearchResults.tsx` (NEW, ~400 lines)Extract results rendering logic.**File**: `src/components/search/EmployeeResults.tsx` (NEW, ~200 lines)Extract employee-specific rendering.**File**: `src/components/search/FilterCounts.tsx` (NEW, ~150 lines)Extract filter count display logic.

#### 2.3 Create Server Component Wrapper

**File**: `src/app/search/page.tsx` (UPDATE or NEW)

```typescript
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import EnterpriseSearchPageClient from '@/components/EnterpriseSearchPageClient';

export default async function SearchPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login');
  }

  return <EnterpriseSearchPageClient user={user} />;
}
```

**File**: `src/components/EnterpriseSearchPageClient.tsx` (RENAME from EnterpriseSearchPage.tsx)Convert to client component that receives user as prop, removes auth fetching.

### Phase 3: Performance Optimization (Week 2)

#### 3.1 Implement Pagination

Update `useEmployees` hook (already in Phase 2.1) to use infinite scroll.Update component to use `useInfiniteQuery`:

```typescript
const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
} = useEmployees(organizationId);

const allEmployees = data?.pages.flatMap(page => page.employees) ?? [];
```



#### 3.2 Add Request Cancellation

**File**: `src/hooks/useSearchResults.ts` (UPDATE)

```typescript
export function useSearchResults(...) {
  return useQuery({
    queryKey: ['search', ...],
    queryFn: async ({ signal }) => {
      // Pass AbortSignal to service
      return unifiedSearch(query, { ...options, signal });
    },
    // ... other options
  });
}
```

Update `unifiedSearchService` to accept and use AbortSignal.

#### 3.3 Optimize Bundle Size

- Use dynamic imports for heavy components
- Code split filter dropdowns
- Lazy load modals

#### 3.4 Batch Filter Count Queries

**File**: `supabase/migrations/109_batch_filter_counts_rpc.sql` (NEW)Create `get_all_filter_counts` RPC that returns counts for all categories in one call.

### Phase 4: Code Quality & Error Handling (Week 3)

#### 4.1 Centralized Error Handling

**File**: `src/utils/errorHandler.ts` (NEW)

```typescript
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function handleError(error: unknown, context: string) {
  console.error(`[${context}]`, error);
  
  if (error instanceof AppError) {
    return { message: error.message, code: error.code };
  }
  
  return { message: 'An unexpected error occurred', code: 'UNKNOWN' };
}
```



#### 4.2 Error Boundaries

**File**: `src/components/ErrorBoundary.tsx` (NEW)Wrap search page with error boundary for graceful error handling.

#### 4.3 Type Safety Improvements

- Add strict TypeScript types for all service responses
- Remove `any` types
- Add runtime validation with Zod

### Phase 5: Testing & Documentation (Week 4)

#### 5.1 Unit Tests

- Test custom hooks (`useEmployees`, `useSearchResults`, `useFilterCounts`)
- Test Server Actions
- Test utility functions

#### 5.2 Integration Tests

- Test search flow end-to-end
- Test filter interactions
- Test pagination

#### 5.3 Documentation

- Document component architecture
- Document hook usage patterns
- Create migration guide

## Migration Strategy

### Step-by-Step Approach

1. **Week 1**: Foundation

- Create server client utilities
- Create RPC functions
- Create Server Actions
- Install React Query

2. **Week 2**: Component Decomposition

- Extract custom hooks
- Split into smaller components
- Create Server Component wrapper
- Update to use hooks

3. **Week 3**: Performance

- Implement pagination
- Add request cancellation
- Optimize queries
- Batch operations

4. **Week 4**: Polish

- Error handling
- Type safety
- Testing
- Documentation

### Backward Compatibility

- Keep old component during migration
- Gradual rollout with feature flags
- A/B testing for performance validation

## Success Metrics

### Security

- [ ] Zero direct table queries
- [ ] All operations use RPC functions
- [ ] Server-side session validation
- [ ] Security audit score: 10/10

### Performance

- [ ] Initial page load: < 1 second
- [ ] Time to interactive: < 2 seconds
- [ ] Query cache hit rate: > 80%
- [ ] Lighthouse performance: > 95

### Maintainability

- [ ] Largest component: < 300 lines
- [ ] Code coverage: > 85%
- [ ] TypeScript strict mode: 100%
- [ ] Cyclomatic complexity: < 10 per function

## Risk Mitigation

| Risk | Mitigation ||------|------------|| Breaking changes | Feature flags, gradual rollout || Performance regression | Load testing, monitoring || Data loss | Comprehensive testing, rollback plan || User disruption | Phased migration, user communication |

## Dependencies

### New Packages

- `@tanstack/react-query` - Query caching
- `@tanstack/react-query-devtools` - Development tools
- `zod` - Runtime validation (optional)

### Database Changes

- Migration 108: `save_employee` RPC
- Migration 109: `get_all_filter_counts` RPC (optional optimization)

## Timeline

- **Week 1**: Foundation & Security (40 hours)
- **Week 2**: Component Decomposition (40 hours)
- **Week 3**: Performance Optimization (32 hours)