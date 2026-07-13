# Skill 09: Styling & Design System

> **Goal**: Create a complete, cohesive CSS design system with global styles, component styles, responsive design, dark theme, animations, and visual polish. The app should look premium and modern.

---

## Step 9.1: Design Tokens & Global Styles

### File: `frontend/src/styles/index.css`

**Replace the minimal CSS from Skill 06** with a comprehensive design system. This file should contain:

#### CSS Custom Properties (Variables)
```css
:root {
  /* Primary Palette */
  --color-primary-50: #EEF2FF;
  --color-primary-100: #E0E7FF;
  --color-primary-200: #C7D2FE;
  --color-primary-300: #A5B4FC;
  --color-primary-400: #818CF8;
  --color-primary: #6366F1;
  --color-primary-600: #4F46E5;
  --color-primary-700: #4338CA;
  
  /* Secondary (Pink) */
  --color-secondary: #EC4899;
  --color-secondary-light: #F472B6;
  --color-secondary-dark: #DB2777;
  
  /* Accent (Emerald) */
  --color-accent: #10B981;
  --color-accent-light: #34D399;
  --color-accent-dark: #059669;
  
  /* Neutral/Slate */
  --color-slate-50: #F8FAFC;
  --color-slate-100: #F1F5F9;
  --color-slate-200: #E2E8F0;
  --color-slate-300: #CBD5E1;
  --color-slate-400: #94A3B8;
  --color-slate-500: #64748B;
  --color-slate-600: #475569;
  --color-slate-700: #334155;
  --color-slate-800: #1E293B;
  --color-slate-900: #0F172A;
  --color-slate-950: #020617;
  
  /* Semantic */
  --color-error: #EF4444;
  --color-error-light: #FCA5A5;
  --color-error-dark: #DC2626;
  --color-warning: #F59E0B;
  --color-warning-light: #FCD34D;
  --color-success: #10B981;
  --color-success-light: #6EE7B7;
  --color-info: #3B82F6;
  
  /* Backgrounds */
  --bg-primary: #0F172A;
  --bg-secondary: #1E293B;
  --bg-tertiary: #334155;
  --bg-card: rgba(30, 41, 59, 0.8);
  --bg-card-hover: rgba(30, 41, 59, 0.95);
  --bg-input: #0F172A;
  --bg-overlay: rgba(0, 0, 0, 0.6);
  
  /* Text */
  --text-primary: #F8FAFC;
  --text-secondary: #94A3B8;
  --text-tertiary: #64748B;
  --text-inverse: #0F172A;
  
  /* Borders */
  --border-color: #334155;
  --border-color-light: rgba(148, 163, 184, 0.15);
  --border-color-focus: #6366F1;
  
  /* Spacing Scale */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  
  /* Border Radius */
  --radius-xs: 4px;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-2xl: 24px;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.3);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3);
  --shadow-glow: 0 0 20px rgba(99, 102, 241, 0.3);
  --shadow-glow-pink: 0 0 20px rgba(236, 72, 153, 0.3);
  
  /* Typography */
  --font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;
  --font-size-5xl: 3rem;
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
  
  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 250ms ease;
  --transition-slow: 350ms ease;
  --transition-spring: 400ms cubic-bezier(0.34, 1.56, 0.64, 1);
  
  /* Layout */
  --sidebar-width: 260px;
  --sidebar-collapsed-width: 72px;
  --header-height: 64px;
  --max-content-width: 1200px;
  
  /* Z-Index Scale */
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-overlay: 300;
  --z-modal: 400;
  --z-toast: 500;
}
```

#### CSS Reset & Base Styles
Include a complete reset and base element styles:
- `*` box-sizing, margin, padding reset
- `body` with background, font, color, antialiasing
- `a` styles, `button` reset, `input/textarea/select` reset
- `img` max-width, display block
- Scrollbar custom styling (webkit and Firefox):
  - Thin scrollbar (8px)
  - Dark track, slightly lighter thumb
  - Thumb with border-radius
- Selection color (`::selection`)
- Focus-visible outline style (indigo ring with offset)

---

## Step 9.2: Component-Specific Stylesheets

Create CSS files in `frontend/src/styles/components/` for each component group. Import them all in `index.css`.

### `frontend/src/styles/components/buttons.css`
```css
/* All button variant styles */
.btn { /* base */ }
.btn-primary { /* indigo gradient */ }
.btn-secondary { /* slate background */ }
.btn-danger { /* red */ }
.btn-ghost { /* transparent */ }
.btn-outline { /* border only */ }
.btn-sm, .btn-md, .btn-lg { /* sizes */ }
.btn-full-width { /* width: 100% */ }
.btn-loading { /* opacity, disabled state */ }
.btn:hover { /* scale, brightness */ }
.btn:active { /* scale down slightly */ }
.btn:focus-visible { /* ring */ }
.btn-icon { /* icon-only button variant */ }
```

### `frontend/src/styles/components/inputs.css`
```css
/* Input, textarea, select styling */
.input-group { /* wrapper with label */ }
.input-label { /* label styling */ }
.input-field { /* base input */ }
.input-field:focus { /* focus state */ }
.input-field.error { /* error state */ }
.input-error-text { /* error message */ }
.input-helper-text { /* helper text */ }
.input-icon { /* positioned icon */ }
.input-with-icon { /* padding adjustment */ }
.textarea { /* textarea specific */ }
.select { /* select specific with custom arrow */ }
.search-input { /* search with icon */ }
.toggle-switch { /* custom toggle switch */ }
```

### `frontend/src/styles/components/cards.css`
```css
/* Card and glassmorphism styles */
.card { /* glassmorphism base */ }
.card-hoverable:hover { /* lift effect */ }
.card-sm, .card-md, .card-lg { /* padding sizes */ }
.stat-card { /* dashboard stat card */ }
.trip-card { /* trip grid card */ }
.trip-card-image { /* cover image area */ }
.trip-card-content { /* text content */ }
.trip-card-meta { /* date, duration info */ }
.activity-card { /* itinerary activity */ }
.expense-card { /* expense list item */ }
```

### `frontend/src/styles/components/modals.css`
```css
/* Modal, dialog styles */
.modal-overlay { /* dark backdrop */ }
.modal-container { /* centered flex */ }
.modal-content { /* glassmorphism card */ }
.modal-header { /* title + close button */ }
.modal-body { /* content area */ }
.modal-footer { /* action buttons */ }
.modal-enter { /* animation in */ }
.modal-exit { /* animation out */ }
```

### `frontend/src/styles/components/navigation.css`
```css
/* Sidebar, header, tabs */
.sidebar { /* fixed sidebar */ }
.sidebar-collapsed { /* collapsed state */ }
.sidebar-nav-item { /* nav link */ }
.sidebar-nav-item.active { /* active state */ }
.sidebar-header { /* logo area */ }
.sidebar-footer { /* user info */ }
.header { /* top bar */ }
.mobile-menu-toggle { /* hamburger */ }
.tabs { /* tab bar */ }
.tab { /* individual tab */ }
.tab.active { /* active tab */ }
.tab-indicator { /* animated underline */ }
```

### `frontend/src/styles/components/badges.css`
```css
.badge { /* base badge */ }
.badge-primary { ... }
.badge-success { ... }
.badge-warning { ... }
.badge-danger { ... }
.badge-info { ... }
.badge-neutral { ... }
.badge-sm, .badge-md { /* sizes */ }
```

### `frontend/src/styles/components/skeletons.css`
```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton {
  background: linear-gradient(90deg, var(--bg-secondary) 25%, var(--bg-tertiary) 50%, var(--bg-secondary) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-md);
}
.skeleton-text { /* text line */ }
.skeleton-circle { /* avatar */ }
.skeleton-rect { /* rectangle */ }
```

---

## Step 9.3: Page-Specific Stylesheets

### `frontend/src/styles/pages/auth.css`
```css
/* Login/Register page styles */
.auth-page { /* full viewport, split layout */ }
.auth-decorative { /* left gradient side */ }
.auth-form-container { /* right form side */ }
.auth-logo { /* logo + app name */ }
.auth-features { /* feature bullets */ }
.floating-circle { /* decorative animations */ }
.password-strength { /* strength bar */ }
.password-requirements { /* checklist */ }
```

### `frontend/src/styles/pages/dashboard.css`
```css
.dashboard { /* page layout */ }
.dashboard-greeting { /* greeting header */ }
.stats-grid { /* 4-column grid */ }
.upcoming-trips { /* horizontal scroll */ }
.quick-actions { /* action cards grid */ }
```

### `frontend/src/styles/pages/trips.css`
```css
.trips-page { ... }
.trips-header { ... }
.trips-filters { ... }
.trips-grid { /* responsive CSS Grid */ }
.pagination { ... }
```

### `frontend/src/styles/pages/itinerary.css`
```css
.itinerary-builder { ... }
.day-column { ... }
.day-header { ... }
.activity-list { ... }
.add-activity-btn { ... }
.drag-handle { ... }
```

### `frontend/src/styles/pages/expenses.css`
```css
.expenses-page { ... }
.expense-summary { ... }
.expense-charts { ... }
.expense-list { ... }
```

### `frontend/src/styles/pages/packing.css`
```css
.packing-page { ... }
.packing-progress { ... }
.packing-categories { ... }
.packing-item { ... }
.packing-item.packed { /* strikethrough, faded */ }
```

### `frontend/src/styles/pages/profile.css`
```css
.profile-page { ... }
.profile-header { ... }
.profile-form { ... }
.danger-zone { /* red border section */ }
```

### `frontend/src/styles/pages/not-found.css`
```css
.not-found-page { ... }
.not-found-number { /* large 404 with gradient text */ }
```

---

## Step 9.4: Animations & Keyframes

### `frontend/src/styles/animations.css`

```css
/* Page transition */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Modal */
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes slideInRight {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes slideInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Floating decorative elements */
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-10px) rotate(1deg); }
  66% { transform: translateY(5px) rotate(-1deg); }
}

@keyframes floatSlow {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

/* Pulse for notifications */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Spin for loading */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Gradient background animation */
@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Checkbox check animation */
@keyframes checkmark {
  0% { stroke-dashoffset: 24; }
  100% { stroke-dashoffset: 0; }
}

/* Toast slide in */
@keyframes toastIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

/* Utility classes for animations */
.animate-fadeIn { animation: fadeIn 0.3s ease forwards; }
.animate-scaleIn { animation: scaleIn 0.2s ease forwards; }
.animate-slideInRight { animation: slideInRight 0.3s ease forwards; }
.animate-slideInUp { animation: slideInUp 0.3s ease forwards; }
.animate-float { animation: float 6s ease-in-out infinite; }
.animate-pulse { animation: pulse 2s ease-in-out infinite; }
.animate-spin { animation: spin 1s linear infinite; }

/* Staggered animation for lists */
.stagger-item { animation: fadeIn 0.3s ease forwards; opacity: 0; }
.stagger-item:nth-child(1) { animation-delay: 0ms; }
.stagger-item:nth-child(2) { animation-delay: 50ms; }
.stagger-item:nth-child(3) { animation-delay: 100ms; }
.stagger-item:nth-child(4) { animation-delay: 150ms; }
.stagger-item:nth-child(5) { animation-delay: 200ms; }
.stagger-item:nth-child(6) { animation-delay: 250ms; }
.stagger-item:nth-child(7) { animation-delay: 300ms; }
.stagger-item:nth-child(8) { animation-delay: 350ms; }
.stagger-item:nth-child(9) { animation-delay: 400ms; }
```

---

## Step 9.5: Responsive Design

### `frontend/src/styles/responsive.css`

Define media queries for all breakpoints:

```css
/* Mobile-first approach */
/* Default styles are for mobile (<640px) */

/* Small tablets (sm) */
@media (min-width: 640px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .trips-grid { grid-template-columns: repeat(2, 1fr); }
  /* ... */
}

/* Tablets (md) */
@media (min-width: 768px) {
  .sidebar { display: flex; }
  .mobile-menu-toggle { display: none; }
  .auth-page { flex-direction: row; }
  .auth-decorative { display: flex; }
  /* ... */
}

/* Small desktop (lg) */
@media (min-width: 1024px) {
  .stats-grid { grid-template-columns: repeat(4, 1fr); }
  .trips-grid { grid-template-columns: repeat(3, 1fr); }
  .itinerary-builder { flex-direction: row; overflow-x: auto; }
  /* ... */
}

/* Large desktop (xl) */
@media (min-width: 1280px) {
  /* max-width containers, larger spacing */
}
```

Key responsive behaviors:
1. **Sidebar**: Hidden on mobile, slide-in overlay on tablet, fixed on desktop
2. **Auth pages**: Full-width form on mobile, split layout on desktop
3. **Trip grid**: 1 col → 2 cols → 3 cols
4. **Stats grid**: 1 col → 2 cols → 4 cols
5. **Itinerary**: Vertical stack on mobile, horizontal scroll on desktop
6. **Charts**: Full width on mobile, side-by-side on desktop

---

## Step 9.6: Import Everything in index.css

At the top of `frontend/src/styles/index.css`, import all CSS files:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

/* Design tokens and reset are in this file */

/* Components */
@import './components/buttons.css';
@import './components/inputs.css';
@import './components/cards.css';
@import './components/modals.css';
@import './components/navigation.css';
@import './components/badges.css';
@import './components/skeletons.css';

/* Pages */
@import './pages/auth.css';
@import './pages/dashboard.css';
@import './pages/trips.css';
@import './pages/itinerary.css';
@import './pages/expenses.css';
@import './pages/packing.css';
@import './pages/profile.css';
@import './pages/not-found.css';

/* Animations */
@import './animations.css';

/* Responsive */
@import './responsive.css';
```

---

## Step 9.7: Update All Components to Use CSS Classes

Go through every component created in Skill 07 and every page created in Skill 08. Ensure they are using the CSS classes defined above rather than inline styles. Update `className` props to use the correct CSS class names.

For components that were using inline styles, migrate them to the CSS files.

---

## Step 9.8: Verify Visual Quality

```bash
cd frontend && npm run dev
```

Navigate through all pages and verify:
1. Dark theme is consistent
2. Cards have glassmorphism effect
3. Buttons have proper hover/focus states
4. Inputs have proper focus/error states
5. Animations are smooth
6. Layout is responsive at all breakpoints (resize browser)
7. Scrollbars are custom styled
8. No layout shifts or overflows

---

## Step 9.9: Update Progress

1. Update `_progress/checklist.md`:
   - [x] Styling complete and responsive
   - [x] Loading states and error handling in UI

2. Update `_progress/progress.md` for Skill 09
3. Log decisions about color choices, animation timing, responsive breakpoints

---

## ✅ Completion Criteria for Skill 09

- [ ] Complete CSS custom property system (60+ variables)
- [ ] Component stylesheets for all component groups
- [ ] Page-specific stylesheets for all pages
- [ ] 12+ keyframe animations defined
- [ ] Responsive breakpoints at 640, 768, 1024, 1280px
- [ ] Custom scrollbar styling
- [ ] All components use CSS classes (no inline styles)
- [ ] Glassmorphism cards with backdrop-filter
- [ ] Gradient buttons with hover animations
- [ ] Dark theme is consistent throughout
- [ ] No CSS conflicts or overrides needed
- [ ] Progress files updated
