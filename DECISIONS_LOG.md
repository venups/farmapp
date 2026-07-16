# Travel Planner - Decisions Log

## Decision Entries

### Decision 1: Project Structure Organization
**What decided**: Organize project into `backend/` and `frontend/` directories with clear separation of concerns.
**Alternatives considered**: 
- Monorepo structure with shared root
- Nested structure under src/
- Separate repositories
**Why chosen**: Clear separation makes it easier to manage different tech stacks (Python vs JavaScript) and allows independent development/deployment if needed. The FARM stack naturally lends itself to this separation.

### Decision 2: Database Fallback Strategy
**What decided**: Use mongomock as the in-process fallback database for both development and testing, with clear documentation of the substitution.
**Alternatives considered**:
- mongodb-memory-server (more complete but heavier)
- Mongita (lighter but less feature-complete)
- Motor sync driver with thread pool
**Why chosen**: mongomock provides a good balance - it's lightweight, has good compatibility with PyMongo async API, and doesn't require additional processes or complex setup. It satisfies the requirement to use the same repository interface regardless of storage backend.

### Decision 3: Frontend Framework Setup
**What decided**: Use Vite for React scaffolding with npm as package manager.
**Alternatives considered**:
- Create React App (CRA)
- Next.js
- pnpm or yarn instead of npm
**Why chosen**: Vite provides faster development experience and better performance. npm is the most widely used and has good compatibility. This combination aligns with modern frontend best practices.

### Decision 4: Styling Approach
**What decided**: Use CSS Modules for styling with a custom design system.
**Alternatives considered**:
- Tailwind CSS (utility-first)
- Plain CSS with BEM naming
- Styled Components
**Why chosen**: CSS Modules provide scoped styles without the complexity of a utility-first framework, and they integrate well with React's component-based architecture. This allows for a clean, maintainable design system.

### Decision 5: Database Driver Fallback
**What decided**: Use Motor as fallback when PyMongo async API is not available, with mongomock for in-memory testing.
**Alternatives considered**:
- Stick with sync PyMongo and thread pool
- Use only mongomock for all environments
- Require specific PyMongo version
**Why chosen**: Motor provides async support that's compatible with FastAPI while maintaining the same interface. This allows the application to work in environments where the latest PyMongo isn't available, ensuring maximum compatibility.

### Decision 6: Frontend Testing Framework
**What decided**: Use Vitest with React Testing Library for frontend testing.
**Alternatives considered**:
- Jest (traditional choice)
- Cypress component testing
- Playwright
**Why chosen**: Vitest provides fast test execution and integrates seamlessly with Vite. React Testing Library encourages testing behavior rather than implementation details, which aligns with the application's focus on user experience.
