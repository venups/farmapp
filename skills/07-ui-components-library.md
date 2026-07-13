# Skill 07: UI Components Library

> **Goal**: Build all reusable UI components used across multiple pages. Each component must be fully styled, accessible, and production-ready. NO placeholder content.

---

## Step 7.1: Common Components

Create these files in `frontend/src/components/common/`:

### `Button.tsx`
A versatile button component with variants:
- **Props**: `variant: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline'`, `size: 'sm' | 'md' | 'lg'`, `isLoading: boolean`, `disabled: boolean`, `fullWidth: boolean`, `icon: ReactNode` (optional leading icon), `children`, `onClick`, all standard button HTML attributes
- **Styling**:
  - Primary: indigo gradient background (`linear-gradient(135deg, #6366F1, #8B5CF6)`)
  - Secondary: slate background
  - Danger: red background
  - Ghost: transparent with hover background
  - Outline: border only
  - All have hover state with slight scale transform (`transform: scale(1.02)`) and brightness increase
  - Loading state shows a small spinner and disables the button
  - Focus state with visible ring
- Use CSS modules or inline styles (import from a CSS file in `styles/components/`)

### `Input.tsx`
A styled form input:
- **Props**: `label: string`, `error: string` (error message), `helperText: string`, `icon: ReactNode` (left icon), `type`, `required`, all standard input attributes
- **Styling**:
  - Dark background (`#0F172A`), subtle border (`#334155`), focus border turns indigo
  - Label above the input, animated float-up on focus (optional but impressive)
  - Error state: red border, red error text below
  - Icon positioned inside left side of input
- Must forward ref with `React.forwardRef`

### `TextArea.tsx`
Same as Input but for `<textarea>`:
- **Props**: `label`, `error`, `rows: number`, `maxLength: number`, `showCount: boolean` (show character count)
- Show "X / maxLength" counter when `showCount` is true

### `Select.tsx`
A styled select dropdown:
- **Props**: `label`, `error`, `options: Array<{value: string, label: string}>`, `placeholder`
- Same styling approach as Input

### `Modal.tsx`
A reusable modal dialog:
- **Props**: `isOpen: boolean`, `onClose: () => void`, `title: string`, `size: 'sm' | 'md' | 'lg'`, `children`
- **Behavior**:
  - Renders into a portal (`createPortal`)
  - Dark overlay backdrop with `backdrop-filter: blur(4px)`
  - Centered content with glassmorphism card style
  - Close on overlay click, close on Escape key
  - Smooth fade-in and scale-up animation
  - Close button (X) in top-right corner
  - Traps focus within the modal for accessibility

### `ConfirmDialog.tsx`
Extends Modal for confirmation:
- **Props**: `isOpen`, `onClose`, `onConfirm`, `title`, `message`, `confirmText: string`, `confirmVariant: 'primary' | 'danger'`, `isLoading`
- Shows title, message, Cancel and Confirm buttons

### `Card.tsx`
A glassmorphism card container:
- **Props**: `children`, `className`, `hoverable: boolean`, `onClick`, `padding: 'sm' | 'md' | 'lg'`
- **Styling**:
  - Background: `rgba(30, 41, 59, 0.8)`
  - `backdrop-filter: blur(10px)`
  - Border: `1px solid rgba(148, 163, 184, 0.1)`
  - Border-radius: `var(--radius-lg)`
  - When `hoverable`: slight lift on hover (`translateY(-2px)`, shadow increase)

### `Badge.tsx`
A status/category badge:
- **Props**: `variant: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'`, `size: 'sm' | 'md'`, `children`
- Pill-shaped, colored background with matching text

### `Avatar.tsx`
User avatar display:
- **Props**: `src: string | null`, `name: string`, `size: 'sm' | 'md' | 'lg' | 'xl'`
- If `src` is provided, show image in a circle
- If no `src`, show initials (first letter of first and last name) on a gradient background
- Sizes: sm=32px, md=40px, lg=56px, xl=80px

### `EmptyState.tsx`
For when lists are empty:
- **Props**: `icon: ReactNode`, `title: string`, `description: string`, `action: ReactNode` (optional CTA button)
- Centered layout with large icon, title, description, and optional action button

### `SearchInput.tsx`
A search input with debounce:
- **Props**: `value`, `onChange`, `placeholder`, `debounceMs: number = 300`
- Search icon on the left
- Clear button (X) on the right when there's text
- Uses a `useDebounce` hook for onChange

### `Skeleton.tsx`
Loading skeleton placeholders:
- **Props**: `variant: 'text' | 'circle' | 'rect'`, `width`, `height`, `count: number`
- Animated shimmer effect (CSS gradient animation sliding left to right)
- If `count > 1`, renders multiple skeletons

### `Tabs.tsx`
Tab navigation component:
- **Props**: `tabs: Array<{id: string, label: string, icon?: ReactNode}>`, `activeTab: string`, `onTabChange: (id: string) => void`
- Horizontal tab bar with animated underline indicator that slides to the active tab

### `ProgressBar.tsx`
A progress indicator:
- **Props**: `value: number` (0-100), `color: string`, `showLabel: boolean`, `size: 'sm' | 'md'`
- Animated fill with gradient
- Optional percentage label

---

## Step 7.2: Trip-Specific Components

Create in `frontend/src/components/trips/`:

### `TripCard.tsx`
A card displaying trip summary:
- **Props**: `trip: Trip`, `onClick: () => void`
- Shows: cover image (or gradient placeholder), title, destination, dates, status badge, duration, budget
- Gradient overlay on the image area
- Hover lift effect
- Status badge in top-right corner
- Date range formatted nicely (e.g., "Jan 15 - Jan 22, 2024")

### `TripForm.tsx`
Reusable form for creating/editing trips:
- **Props**: `initialData?: TripUpdate`, `onSubmit: (data: TripCreate | TripUpdate) => Promise<void>`, `isLoading: boolean`, `submitLabel: string`
- Fields: title, destination, country, description, start_date, end_date, budget, currency (select), tags (comma-separated input), notes, is_public (toggle switch)
- All fields have validation
- Submit button with loading state

### `TripStatusBadge.tsx`
- **Props**: `status: TripStatus`
- Color-coded badge using TRIP_STATUSES constants

---

## Step 7.3: Itinerary Components

Create in `frontend/src/components/itinerary/`:

### `DayColumn.tsx`
A day container for the itinerary builder:
- **Props**: `dayNumber: number`, `date: string`, `activities: Activity[]`, `onAddActivity: () => void`, `onEditActivity: (activity: Activity) => void`, `onDeleteActivity: (id: string) => void`
- Header with "Day X" and formatted date
- List of ActivityCard components
- "Add Activity" button at the bottom
- Droppable zone for drag-and-drop (use @hello-pangea/dnd `Droppable`)

### `ActivityCard.tsx`
A draggable activity card:
- **Props**: `activity: Activity`, `index: number`, `onEdit: () => void`, `onDelete: () => void`
- Shows: category emoji, title, time range, location, estimated cost
- Category-colored left border
- Drag handle icon
- Edit and delete buttons on hover
- Draggable (use @hello-pangea/dnd `Draggable`)

### `ActivityForm.tsx`
Form for creating/editing activities:
- **Props**: `tripId: string`, `dayNumber: number`, `totalDays: number`, `initialData?: ActivityUpdate`, `onSubmit`, `isLoading`, `onCancel`
- Renders inside a Modal
- Fields: title, category (select with emojis), description, start_time, end_time, location_name, address, latitude, longitude, estimated_cost, booking_url, notes
- Category select should show the emoji next to each option

---

## Step 7.4: Expense Components

Create in `frontend/src/components/expenses/`:

### `ExpenseCard.tsx`
- **Props**: `expense: Expense`, `onEdit`, `onDelete`
- Shows: category emoji, title, amount (formatted with currency), date, payment method
- Actions: edit, delete buttons

### `ExpenseForm.tsx`
- **Props**: `tripId`, `initialData?`, `onSubmit`, `isLoading`, `onCancel`
- Fields: title, amount, currency, category, date, notes, payment_method
- Renders inside a Modal

### `ExpenseChart.tsx`
- **Props**: `summary: ExpenseSummary`
- Uses Recharts to render:
  1. A **pie chart** showing expenses by category (with labels and percentages)
  2. A **bar chart** showing expenses by date
- Include a budget progress bar if budget is set
- Use the app's color palette for chart colors
- Responsive sizing

### `BudgetProgress.tsx`
- **Props**: `spent: number`, `budget: number`, `currency: string`
- Shows a progress bar with spent/budget amounts
- Color changes: green (< 75%), yellow (75-90%), red (> 90%)

---

## Step 7.5: Map Components

Create in `frontend/src/components/maps/`:

### `TripMap.tsx`
- **Props**: `activities: Activity[]`, `center?: [number, number]`, `zoom?: number`, `height?: string`
- Uses `react-leaflet` to display a map
- Shows markers for all activities that have latitude/longitude
- Each marker has a popup showing: activity title, category, time, location name
- Auto-fit bounds to show all markers
- Uses the OpenStreetMap tile layer (free, no API key)
- If no activities have coordinates, show a centered world map with a message

Default tiles:
```typescript
<TileLayer
  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
/>
```

---

## Step 7.6: Packing Components

Create in `frontend/src/components/packing/`:

### `PackingCategory.tsx`
- **Props**: `category: string`, `items: PackingItem[]`, `onToggle: (id) => void`, `onEdit: (item) => void`, `onDelete: (id) => void`
- Collapsible category section with emoji and item count
- List of PackingItemRow components

### `PackingItemRow.tsx`
- **Props**: `item: PackingItem`, `onToggle`, `onEdit`, `onDelete`
- Checkbox, item name, quantity, essential badge
- Strikethrough text when packed
- Smooth checkbox animation

### `PackingForm.tsx`
- **Props**: `tripId`, `initialData?`, `onSubmit`, `isLoading`, `onCancel`
- Fields: name, category, quantity, is_essential, notes
- Renders inside a Modal

---

## Step 7.7: Photo Components

Create in `frontend/src/components/photos/`:

### `PhotoGallery.tsx`
- **Props**: `tripId: string`, `photos: Array<{url: string, caption?: string}>`, `onUpload: (file: File) => void`, `onDelete: (url: string) => void`
- Grid layout of photo thumbnails (CSS Grid, 3 columns on desktop, 2 on tablet, 1 on mobile)
- Click to open full-size in a lightbox modal
- Upload button with drag-and-drop zone
- Delete button overlay on hover

### `PhotoLightbox.tsx`
- **Props**: `photos: Array<{url, caption}>`, `currentIndex: number`, `isOpen`, `onClose`, `onNext`, `onPrev`
- Full-screen overlay with the photo centered
- Previous/Next arrows
- Close button
- Caption at the bottom
- Keyboard navigation (arrows, Escape)

---

## Step 7.8: Verify Components Compile

After creating all components, run:

```bash
cd frontend && npx tsc --noEmit
```

Fix any TypeScript errors. All components must compile without errors.

---

## Step 7.9: Update Progress

1. Update `_progress/checklist.md`
2. Update `_progress/progress.md` for Skill 07
3. Log decisions: component API design choices, styling approaches, library choices

---

## ✅ Completion Criteria for Skill 07

- [ ] All common components created (Button, Input, TextArea, Select, Modal, ConfirmDialog, Card, Badge, Avatar, EmptyState, SearchInput, Skeleton, Tabs, ProgressBar)
- [ ] All trip components created (TripCard, TripForm, TripStatusBadge)
- [ ] All itinerary components created (DayColumn, ActivityCard, ActivityForm)
- [ ] All expense components created (ExpenseCard, ExpenseForm, ExpenseChart, BudgetProgress)
- [ ] All map components created (TripMap)
- [ ] All packing components created (PackingCategory, PackingItemRow, PackingForm)
- [ ] All photo components created (PhotoGallery, PhotoLightbox)
- [ ] Every component has proper TypeScript types
- [ ] Every component has proper styling
- [ ] All components compile without errors
- [ ] Progress files updated
