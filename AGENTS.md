# GOLDEN RULES — HaldiCart Admin & Operational System

## 1. Universal Layout Architecture (AdminShell Mandate)
- **Central Shell Rule**: ALL views, pages, and sub-modules MUST render inside the unified `<AdminShell>` component (`/src/components/AdminShell.tsx`). Do NOT re-create navigation, headers, or mobile drawers inside individual module files.
- **Auto-Responsive Fluidity & Full-Width Panel Mandate**: The content area automatically expands to 100% full width (`w-full`) with NO artificial max-width constraints (strictly NO `max-w-7xl`, `max-w-[1600px]`, or `max-w-3xl` wrappers).
- **Zero Viewport Padding (`p-0`)**: The main workspace container (`#main-content-workspace`), header bar, and main module view panels MUST use zero padding (`p-0` or `p-0.5`/`px-1` max) for edge-to-edge full-width layout with NO bottom padding gaps or blank grey margins in the viewport.

## 2. Facebook-Style Mobile Navigation Standard
- **Desktop (>1024px)**: Persistent sidebar (`240px`) with multi-level tree navigation.
- **Tablet (640px–1024px)**: Compact sidebar rail (64px) with quick tooltips.
- **Mobile (<640px)**:
  - Sidebar fully hidden by default.
  - Sticky 44px top header with a 24px Hamburger toggle button.
  - Hamburger opens a smooth 250ms slide-in overlay menu drawer with dark backdrop scrim and locked body scrolling.
  - Persistent bottom navigation bar with quick access to top modules + "More" drawer trigger.

## 3. Ultra-Compact 30px & Token-Based Sizing Standard (v1.2 Canonical)
- **Canonical Component Design Tokens**:
  - `--stat-chip-height`: 28px
  - `--header-bar-height`: 30px
  - `--filter-bar-height`: 28px
  - `--micro-input-height`: 22px
  - `--micro-pill-height`: 22px
  - `--table-row-height`: 28-30px
  - `--primary-cta-height`: 26-28px (Primary/destructive CTA exception for touch safety)
- **Continuous Fluid Scaling**: All fonts, gaps, heights, and padding continuously scale between 320px (mobile) and 2560px (desktop) using `clamp()` tokens defined in `index.css`.

## 4. Global UI Component Sizing & Layout Rules
- **Icons Standard**: ALL icons across the entire site MUST be imported exclusively from `lucide-react`. Raw `<svg>` tags or custom inline SVG markup are strictly prohibited.
- **Header Bar**: Single compact 30px bar (`min-h-[30px]`) with title + inline subtitle. No stacked giant headers.
- **Full-Width Panels & Cards**: All panel sections, tables, and views expand to 100% full width (`w-full`) across all screen sizes.
- **Stat Cards → Inline Chips**: Stat metrics MUST be rendered as 28px inline chips (`[VALUE] [LABEL]`) in an auto-fitting grid that wraps on smaller viewports (`flex flex-wrap gap-1` or grid with auto-fit) so chips never cut off or overflow horizontally.
- **Filter Bars & Inputs**: Single-row 28px filter bar containing 22px micro-inputs/selects or 22px micro-pills.
- **Buttons**: Standard action buttons use 22px micro-pills. Primary CTA / destructive confirmation buttons maintain 26-28px for touch safety.
- **Data Tables & Rows**:
  - Table headers and data rows MUST be strictly 28px–30px row height (`h-[28px]` / `h-[30px]` or `py-0.5`/`py-1` padding).
  - High data density: Low vertical spacing, single-line text truncation, micro-pills (`h-[20px]`/`h-[22px]`), and monospace font (`font-mono`) for emails, domains, handles, codes, numbers, dates, and IDs.
  - On screens `<640px`, switch structurally to stacked micro-cards to maintain touch accessibility floor (24px min on mobile).

## 5. Universal Database, Instant Deletion & On-Site Creation Mandate
- **Database Persistence Standard**: ALL data across ALL current and upcoming modules MUST be connected to persistent database storage (`localStorage` state hooks or backend API handlers) so all added, uploaded, edited, or deleted items persist seamlessly across page refreshes.
- **Instant 1-Click Deletion**: ALL data rows, cards, and links MUST feature an instant delete button (trash icon). Clicking delete MUST immediately remove the record from state and database without confirmation delays.
- **On-Site Creation & Uploading**: Every module MUST provide an inline or modal "+ Add / Upload" trigger enabling users to create, upload, and update new records directly on site.
- **Database Reset Safety**: Include an easily accessible "Reset DB" trigger in administrative toolbars to restore original seed data when testing.

## 6. Mandatory Safeguards & Verification
- **Touch Accessibility Floor**: On tablet/mobile (<640px), 22px interactive elements bump to 24px minimum accessibility floor.
- **Chip Wrap Test**: Stat chip rows MUST wrap on mobile (375px) without cutting off or causing horizontal page overflow.
- **Contrast & Legibility Pass**: Ensure high WCAG contrast on all 22px and `text-[9px]`/`text-[10px]` elements.
- **Zero Layout Shifts & Zero Viewport Margins**: Navigating tabs or toggling drawers must never trigger unwanted horizontal scrollbars or bottom viewport padding gaps. Always verify with linter and compilation checks.
