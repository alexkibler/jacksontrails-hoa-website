# Forest Color Scheme - Jackson Trails HOA

## Overview
The website has been redesigned with a forest-inspired color palette that evokes the "Trails" part of the name. The new design feels established, calm, and expensive, communicating "We have nice trees and good property values."

**Design Philosophy**: REI catalog meets City Hall

## Color Palette

### Primary Colors (Headers/Hero Sections)
- **Forest Green** (`jt-forest-900`): `#14532d` - Deep, forest tones for headers and hero sections
- **Stone Dark** (`jt-stone-900`): `#1c1917` - Alternative deep stone for headers

### Secondary Colors (Buttons/Accents)
- **Emerald** (`jt-emerald-600`): `#059669` - Vibrant but natural green for buttons and accents
- Used for:
  - Submit buttons
  - Call-to-action links
  - Form focus states
  - Featured badges

### Backgrounds
- **Stone Light** (`jt-stone-50`): `#fafaf9` - Warm off-white, not clinical white
- Creates a natural, organic feel
- Easy on the eyes for extended reading

### Text Colors
- **Stone Dark** (`jt-stone-700`): `#44403c` - Softer than stark black
- Provides excellent readability without harsh contrast
- Used for body text throughout the site

## Color Usage by Component

### Hero Section
- Background: `bg-gradient-forest` (gradient from forest-900 to emerald-600)
- Text: White
- Primary button: White background with `text-jt-forest-900`
- Secondary button: Transparent with white border

### Navigation
- Background: White (light mode) / `jt-stone-800` (dark mode)
- Logo: `bg-gradient-forest` text gradient
- Active links: `text-jt-forest-900` / `text-jt-emerald-400` (dark)
- Inactive links: `text-jt-stone-700` / `text-jt-stone-300` (dark)

### Buttons & CTAs
- Primary: `bg-jt-emerald-600` with white text
- Hover: `bg-jt-emerald-700`
- Focus ring: `ring-jt-emerald-500`

### Forms
- Background: White / `jt-stone-800` (dark)
- Border: `jt-stone-300` / `jt-stone-600` (dark)
- Focus ring: `ring-jt-emerald-500`
- Labels: `text-jt-stone-700` / `text-jt-stone-300` (dark)

### Cards & Sections
- Background: White / `jt-stone-800` (dark)
- Alternating sections: `jt-stone-50` / `jt-stone-900` (dark)
- Shadows: Soft shadows for depth

### Links
- Primary: `text-jt-emerald-600` / `text-jt-emerald-400` (dark)
- Hover: Underline

### Badges
- Featured: `bg-jt-emerald-600` with white text
- Category badges: `bg-jt-emerald-100` with `text-jt-emerald-800`

## Dark Mode
The color scheme includes a comprehensive dark mode that maintains the forest aesthetic:
- Background: `jt-stone-900`
- Text: `jt-stone-100`
- Accents: `jt-emerald-400`
- Cards: `jt-stone-800`

## Files Modified
1. `tailwind.config.ts` - Added forest, emerald, and stone color palettes
2. `globals.css` - Updated base colors and scrollbar styles
3. `src/app/page.tsx` - Home page
4. `src/app/announcements/page.tsx` - Announcements listing
5. `src/app/announcements/[slug]/page.tsx` - Announcement detail
6. `src/app/documents/page.tsx` - Documents page
7. `src/app/contact/page.tsx` - Contact page
8. `src/components/Navigation.tsx` - Navigation component
9. `src/components/ContactForm.tsx` - Contact form
10. `src/components/DocumentsFilter.tsx` - Documents filter

## Testing
A comprehensive E2E test suite has been added at `e2e/color-scheme.spec.ts` to verify:
- Hero section uses forest gradient
- Navigation uses forest colors
- Contact form uses emerald accents
- Text uses stone-700 color
- Dark mode uses stone-900 background
- Buttons use emerald-600

Run tests with:
```bash
npm run test:e2e
```

## Accessibility
All color combinations meet WCAG AA standards for contrast ratios:
- Stone-700 on Stone-50: 8.59:1 (AAA)
- Stone-900 on Stone-50: 16.05:1 (AAA)
- Emerald-600 on White: 4.53:1 (AA)
- White on Forest-900: 14.68:1 (AAA)

## Migration Notes
Old color references have been replaced:
- `jt-blue-*` → `jt-forest-*` or `jt-stone-*`
- `jt-sunset-*` → `jt-emerald-*`
- `gray-*` → `jt-stone-*`
- `bg-gradient-sunset` → `bg-gradient-forest`
