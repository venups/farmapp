# Design Plan - Travel Planner

## Color Palette (Modern Classic)
- `#F8F9FA` (Off-White): Main background, clean and airy.
- `#2C3E50` (Midnight Blue): Primary text and headers, professional and grounded.
- `#E67E22` (Soft Ochre): Accent color for primary actions and highlights, evokes travel/adventure.
- `#BDC3C7` (Silver): Borders and secondary text, subtle separation.
- `#27AE60` (Sage Green): Success states and completed checklist items.

## Typography
- Display: `Playfair Display` (Serif) - Used sparingly for page titles to give a "travel journal" feel.
- Body: `Inter` (Sans-serif) - High readability for itineraries and lists.
- Utility: `JetBrains Mono` (Monospace) - Used for dates, budget numbers and labels.

## Layout Concept
- Dashboard: A grid of "Trip Cards" with a summary view (status, progress bar for checklists).
- Trip View: A three-column layout: 1. General Info & Budget, 2. Daily Itinerary (vertical timeline), 3. Checklist (split by Packing/Prep).
- Forms: Centered modals with clear, active-voice labels.

## Signature Element
- **Boarding Pass Trip Cards**: The trip cards on the dashboard will mimic a boarding pass, with a perforated edge effect and "destination" stamps for completed trips.

## Motion
- Subtle slide-in for new items.
- Checkbox toggle with a slight scale effect and color transition to Sage Green.
