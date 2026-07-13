# Skill 08: Pages & Views

> **Goal**: Implement all application pages with full functionality. Replace every placeholder page from Skill 06 with a complete, working implementation. Each page must use the components from Skill 07 and handle all user interactions.

---

## Step 8.1: Authentication Pages

### File: `frontend/src/pages/LoginPage.tsx`

**Full-page layout** (NOT inside the Layout — this page has its own design):

- **Left side** (60% on desktop): Decorative illustration area
  - Large gradient background (indigo → pink → purple)
  - App logo (use Compass icon from lucide-react) and name "TripForge"
  - Tagline: "Forge Your Perfect Journey"
  - 3 feature bullet points with icons: "Plan Every Detail", "Track Expenses", "Share With Friends"
  - Decorative floating circles with CSS animations (subtle, slow movement)

- **Right side** (40% on desktop, full width on mobile): Login form
  - Heading: "Welcome Back"
  - Subheading: "Sign in to continue planning your adventures"
  - Email input with Mail icon
  - Password input with Lock icon and show/hide toggle
  - "Remember me" checkbox (stores token preference)
  - "Forgot password?" link (can be non-functional, just styled)
  - Login button (primary, full width)
  - Loading state during authentication
  - Error display for failed login
  - "Don't have an account? Sign up" link to /register
  - Uses `useAuth().login()` on submit
  - On successful login, redirect to the page they came from (using `location.state.from`) or /dashboard

### File: `frontend/src/pages/RegisterPage.tsx`

Same layout structure as LoginPage but with registration form:
- Heading: "Create Account"
- Subheading: "Start planning your next adventure"
- Fields: Full Name, Username, Email, Password, Confirm Password
- Password strength indicator (visual bar that changes color: red → yellow → green)
- Password requirements list with check marks as each requirement is met
- Terms of service checkbox (mock, just for UI completeness)
- Register button
- "Already have an account? Sign in" link
- Inline validation: check if username/email is unique (debounced API call — or just client-side validation for now)
- Uses `useAuth().register()` on submit

---

## Step 8.2: Dashboard Page

### File: `frontend/src/pages/DashboardPage.tsx`

The main landing page after login. Shows an overview of the user's travel world:

**Header Section**:
- Greeting: "Good [morning/afternoon/evening], {user.full_name}!" (based on time of day)
- Subtitle showing current date
- "Plan a New Trip" button (links to /trips/new)

**Stats Cards Row** (4 cards in a grid):
1. Total Trips — number with Map icon
2. Upcoming Trips — number with Calendar icon
3. Countries Visited — count unique countries from completed trips
4. Total Spent — sum of all expenses with currency

Each stat card:
- Glassmorphism card with subtle gradient
- Large number, label below, icon in top-right
- Slight hover animation

**Upcoming Trips Section**:
- Heading: "Upcoming Adventures" with a "View All" link
- Horizontal scrollable row of TripCard components (max 5)
- If no upcoming trips: EmptyState with "No upcoming trips. Time to plan!" and CTA button

**Recent Activity Feed** (optional but impressive):
- List of recent actions: "You added 3 activities to Tokyo Trip", "Budget updated for Europe 2024"
- Each item has an icon, description, and relative timestamp
- If no activity: show a subtle "Your activity will appear here" message

**Quick Actions Grid**:
- 4 action cards: "New Trip", "Browse Trips", "View Expenses", "Edit Profile"
- Each has an icon, label, and navigates to the appropriate page

Fetch all data on mount using service functions. Show skeletons while loading.

---

## Step 8.3: Trips List Page

### File: `frontend/src/pages/TripsPage.tsx`

**Header**:
- Title: "My Trips"
- "New Trip" button (links to /trips/new)
- Search input (filters trips by title/destination)

**Filter Bar**:
- Status filter tabs: All, Planning, Ongoing, Completed, Cancelled
- Sort dropdown: Newest, Oldest, Departure Date, Name

**Trip Grid**:
- CSS Grid of TripCard components (3 columns desktop, 2 tablet, 1 mobile)
- Each card navigates to `/trips/{tripId}` on click
- Pagination at the bottom (Previous, page numbers, Next)
- Loading state shows Skeleton grid
- Empty state when no trips match filters

**Fetch trips** on mount and when filters change. Use pagination params.

---

## Step 8.4: Trip Detail Page

### File: `frontend/src/pages/TripDetailPage.tsx`

**Uses `useParams()` to get `tripId` from URL.**

**Hero Section**:
- Large cover image (or gradient placeholder if no image)
- Trip title overlay on the image
- Destination and country
- Date range and duration badge
- Status badge
- Edit button (pencil icon) linking to `/trips/{tripId}/edit`
- Delete button with confirmation dialog

**Tab Navigation** (using Tabs component):
- Overview | Itinerary | Expenses | Packing | Map | Photos

**Overview Tab** (default):
- Trip description (if any)
- Key details in a grid: dates, budget, currency, status
- Collaborators list with avatars
- "Add Collaborator" button — opens a modal with email input
- Trip notes section
- Tags displayed as badges
- Quick links to other tabs

**Itinerary Tab**: Renders `<ItineraryPage />` content inline (or navigates to the itinerary page)

**Expenses Tab**: Renders `<ExpensesPage />` content inline

**Packing Tab**: Renders `<PackingPage />` content inline

**Map Tab**: Renders `<TripMap />` with all activities

**Photos Tab**: Renders `<PhotoGallery />` with upload capability

Fetch trip data on mount. Handle 404 (trip not found).

---

## Step 8.5: Trip Create/Edit Pages

### File: `frontend/src/pages/TripCreatePage.tsx`

- Title: "Plan a New Trip"
- Renders `<TripForm />` component
- On successful creation, redirect to `/trips/{newTripId}`
- Show toast on success/error

### File: `frontend/src/pages/TripEditPage.tsx`

- Title: "Edit Trip"
- Fetches existing trip data on mount
- Renders `<TripForm initialData={tripData} />`
- On successful update, redirect to `/trips/{tripId}`
- Show toast on success/error
- Handle 404 (trip not found)

---

## Step 8.6: Itinerary Page

### File: `frontend/src/pages/ItineraryPage.tsx`

The main itinerary builder. Can be accessed as a standalone page or rendered within TripDetailPage.

**Layout**:
- Day-by-day columns in a horizontal scrollable container (or vertical stack on mobile)
- Each day is a `<DayColumn />` component
- The number of days equals the trip's duration_days
- Each day shows its date (calculated from trip start_date + day_number - 1)

**Drag and Drop**:
- Wrap everything in `<DragDropContext>` from @hello-pangea/dnd
- Activities can be dragged between days or reordered within a day
- On drag end, call the reorder API and update local state optimistically

**Add Activity Flow**:
- Clicking "Add Activity" on a day opens the ActivityForm modal pre-filled with that day_number
- On submit, creates the activity via API and adds it to local state

**Edit Activity Flow**:
- Clicking edit on an ActivityCard opens ActivityForm modal with existing data
- On submit, updates via API

**Delete Activity Flow**:
- Clicking delete shows ConfirmDialog
- On confirm, deletes via API and removes from local state

**Empty Day State**:
- Days with no activities show a subtle "Drag activities here or click + to add" message

Fetch activities on mount grouped by day_number.

---

## Step 8.7: Expenses Page

### File: `frontend/src/pages/ExpensesPage.tsx`

**Header**:
- Title: "Expenses"
- "Add Expense" button
- Category filter dropdown
- Sort dropdown

**Summary Section** (top):
- BudgetProgress component (if trip has a budget)
- ExpenseChart component showing pie chart and bar chart
- Total spent amount in large text

**Expense List**:
- List of ExpenseCard components sorted by date (newest first)
- Filter by category works instantly (client-side after initial fetch)
- Loading state with skeletons

**Add/Edit Expense**:
- Opens ExpenseForm modal
- On submit, creates/updates expense and refreshes the summary

**Delete Expense**:
- ConfirmDialog
- On confirm, deletes and refreshes

Fetch expenses and summary on mount.

---

## Step 8.8: Packing Page

### File: `frontend/src/pages/PackingPage.tsx`

**Header**:
- Title: "Packing List"
- ProgressBar showing packing progress (X% packed)
- "Add Item" button
- Stats: "X of Y items packed"

**Categories**:
- Items grouped by category using PackingCategory components
- Each category is collapsible
- Items within each category sorted: essentials first, then alphabetical

**Quick Add**:
- An inline input at the top for quickly adding items (just name + category select)
- Press Enter to add

**Bulk Templates** (impressive feature):
- "Add Template" button that opens a modal with predefined packing lists:
  - Beach Vacation, Winter Trip, Business Trip, Camping, Weekend Getaway
- Each template has a list of items; clicking one bulk-creates all items

**Toggle Packed**:
- Clicking the checkbox calls the toggle API
- Smooth checkbox animation
- Item text gets strikethrough with reduced opacity

Fetch packing list on mount.

---

## Step 8.9: Profile Page

### File: `frontend/src/pages/ProfilePage.tsx`

**Profile Header**:
- Large avatar (xl size)
- Full name, username, email
- Member since date
- Trip count

**Edit Profile Section**:
- Full name input
- Bio textarea (with character counter)
- Avatar upload (uses the upload API)
- Save button

**Change Password Section**:
- Current password input
- New password input
- Confirm new password input
- Password strength indicator
- Change Password button

**Danger Zone** (at bottom, red-bordered section):
- Delete Account button
- Opens ConfirmDialog asking for password
- On confirm, deletes account and redirects to /login

---

## Step 8.10: Not Found Page

### File: `frontend/src/pages/NotFoundPage.tsx`

A visually appealing 404 page:
- Large "404" text with gradient
- "Page Not Found" heading
- "The page you're looking for doesn't exist or has been moved." description
- "Go to Dashboard" button
- Subtle floating animation on the 404 text
- Does NOT use the Layout wrapper (standalone full-page)

---

## Step 8.11: Verify All Pages Render

```bash
cd frontend && npx tsc --noEmit
cd frontend && npm run dev
```

Navigate to each route and verify:
1. No TypeScript errors
2. No runtime errors in console
3. Each page renders its content (even if data is empty/mock)

---

## Step 8.12: Update Progress

1. Update `_progress/checklist.md`:
   - [x] Authentication pages (Login, Register)
   - [x] Dashboard page
   - [x] Trip creation/edit pages
   - [x] Itinerary builder page
   - [x] Expense tracker page
   - [x] Profile/settings page

2. Update `_progress/progress.md` for Skill 08
3. Log decisions about page layouts, UX flows

---

## ✅ Completion Criteria for Skill 08

- [ ] LoginPage fully implemented with split layout
- [ ] RegisterPage with password strength indicator
- [ ] DashboardPage with stats, upcoming trips, quick actions
- [ ] TripsPage with search, filters, pagination
- [ ] TripDetailPage with tabs (overview, itinerary, expenses, packing, map, photos)
- [ ] TripCreatePage and TripEditPage with form
- [ ] ItineraryPage with drag-and-drop day builder
- [ ] ExpensesPage with charts and list
- [ ] PackingPage with progress and categories
- [ ] ProfilePage with edit and danger zone
- [ ] NotFoundPage with appealing design
- [ ] All pages compile without errors
- [ ] All pages use components from Skill 07
- [ ] Progress files updated
