# Signal Design System

Resend-inspired B2B SaaS aesthetic for technical founders. Near-black canvas, off-white type, hairline borders, restrained glow accents, sharp hierarchy.

## Dials
- **VARIANCE**: 5 (medium variety in layout, restrained palette)
- **MOTION**: 3 (subtle transitions, no animations)
- **DENSITY**: 3 (breathing room, focused content)

## Color Palette

### Canvas & Surfaces
- `canvas`: `#000000` — Pure black base
- `surface`: `#0a0a0c` — Near-black raised surface
- `panel`: `#101012` — Slightly elevated panel
- `line`: `rgba(255, 255, 255, 0.06)` — Hairline border (white 6% opacity)
- `line-hover`: `rgba(255, 255, 255, 0.12)` — Hairline hover state

### Typography
- `ink`: `#fcfdff` — Off-white primary text
- `ink-dim`: `#a1a1aa` — Secondary text (zinc-400)
- `ink-subdued`: `#71717a` — Tertiary text (zinc-500)

### Accent Colors (Status Only)
- `status-orange`: `#fb923c` — Warnings, price-related
- `status-blue`: `#3b82f6` — Info, neutral actions
- `status-green`: `#10b981` — Success, approvals
- `status-red`: `#ef4444` — Errors, rejections

**No purple gradients. No teal/violet accent sludge.**

## Typography

### Fonts
- **Primary**: Geist Sans (via next/font/google) or Inter fallback
- **Display**: System sans (no custom serif unless explicitly licensed)

### Hierarchy
- `hero`: 56–72px, bold, tight leading
- `h1`: 48px, bold
- `h2`: 32–40px, semibold
- `h3`: 24px, semibold
- `body-large`: 20px, regular
- `body`: 16px, regular
- `caption`: 14px, regular
- `tiny`: 12px, medium

## Components

### Logo
**Text-only wordmark "Signal"** in primary font, semibold, 18px. No mascot, no icon, no face.svg.

### Buttons
- **Primary**: White bg, black text, pill radius (999px), medium font-weight
- **Secondary**: `surface` bg, white text, hairline border, pill radius
- **Ghost**: Transparent bg, ink-dim text, hover → ink

### Cards
- Rounded corners: 24px (3xl) or 32px (4xl)
- Background: `surface` or `panel`
- Border: `line` (hairline)
- Padding: 32–48px for large cards, 16–24px for compact

### Inputs & Forms
- Rounded: 24px (3xl)
- Border: `line`
- Focus: `status-blue` or `status-green` (1px)
- Background: `panel`
- Text: `ink`

## Anti-Slop Rules

### Forbidden
1. ❌ Purple gradients
2. ❌ 3 equal icon cards in a row (vary card sizes/layouts)
3. ❌ Glassmorphism (no blur + gradient sludge)
4. ❌ Inter + slate-500 default mush
5. ❌ Pulsing dots or loading spinners everywhere
6. ❌ Fake metrics or placeholder numbers
7. ❌ Mascots, rainbow arcs, cute illustrations in B2B SaaS context

### Required
1. ✅ Sharp hierarchy (clear visual weight differences)
2. ✅ Restrained accents (status colors only, not decorative)
3. ✅ Hairline borders (6% white opacity)
4. ✅ Off-white text on near-black (not pure white on pure black)
5. ✅ Pill-shaped buttons and tags
6. ✅ Generous whitespace
7. ✅ Monospace for code/technical identifiers

## Layout

### Max-width
- Content: 1120px

### Spacing Scale
- xs: 8px
- sm: 16px
- md: 24px
- lg: 32px
- xl: 48px
- 2xl: 64px
- 3xl: 96px

### Grid
- 2-column layout for features/pricing (not 3)
- Asymmetric layouts preferred over equal columns
- Breathing room between sections (80–120px vertical)
