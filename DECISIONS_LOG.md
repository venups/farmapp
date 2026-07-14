# Decisions Log

## Architecture Decisions

### 1. Async Database Driver (Motor)
- **Decision**: Use motor (async MongoDB driver) instead of pymongo
- **Rationale**: FastAPI is async-native; motor allows non-blocking database operations
- **Trade-off**: More complex testing due to event loop management

### 2. Lazy Database Client
- **Decision**: Create MongoDB client lazily on first use
- **Rationale**: Required for pytest-asyncio compatibility; each test gets a fresh event loop
- **Trade-off**: Slightly more complex initialization code

### 3. UUID for Embedded Documents
- **Decision**: Generate UUIDs for checklist items, budget items, and itinerary days
- **Rationale**: MongoDB doesn't auto-generate _id for embedded documents
- **Trade-off**: Slightly different ID format (UUID vs ObjectId) for nested items

### 4. Manual _id to id Serialization
- **Decision**: Create _serialize_doc() function to convert ObjectIds to strings and rename _id to id
- **Rationale**: Pydantic alias handling was unreliable for nested models; manual approach is more predictable
- **Trade-off**: More code in CRUD layer but clearer behavior

### 5. Vite for Frontend Build Tool
- **Decision**: Use Vite instead of Create React App
- **Rationale**: Faster HMR, smaller bundle size, modern tooling
- **Trade-off**: Slightly different configuration than CRA

### 6. CSS Custom Properties for Theming
- **Decision**: Use CSS variables for all colors, shadows, and transitions
- **Rationale**: Easy theming, consistent design system, no CSS-in-JS overhead
- **Trade-off**: Less dynamic theming capability than CSS-in-JS

### 7. Inline Styles for Component-Specific Styling
- **Decision**: Use inline styles for layout and component-specific styling
- **Rationale**: Quick development, no additional build step, collocated with component
- **Trade-off**: Less maintainable for very large components

### 8. Single-Page App with React Router
- **Decision**: Use React Router for client-side routing
- **Rationale**: Smooth navigation, no page reloads, standard React pattern
- **Trade-off**: Requires JavaScript enabled

### 9. Docker Compose for Local Development
- **Decision**: Use Docker Compose to orchestrate all services
- **Rationale**: Reproducible environment, easy to start/stop entire stack
- **Trade-off**: Slightly slower startup than native tools

### 10. FastAPI Response Models
- **Decision**: Use Pydantic response models on all endpoints
- **Rationale**: Automatic validation, OpenAPI docs, type safety
- **Trade-off**: Serialization quirks with MongoDB ObjectIds
