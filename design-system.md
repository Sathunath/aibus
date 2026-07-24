# Design System v1.2 — Token Specifications & Shell Standard

## Component Tokens v1.2

```css
:root {
  --stat-chip-height: 28px;
  --header-bar-height: 30px;
  --filter-bar-height: 28px;
  --micro-input-height: 22px;
  --micro-pill-height: 22px;
  --table-row-height: 28px;
  --primary-cta-height: 26px;

  /* Shell & Fluid Layout Tokens */
  --sidebar-width-desktop: 240px;
  --sidebar-width-mobile: 0px;
  --hamburger-icon-size: 24px;
  --slide-panel-width: clamp(260px, 80vw, 320px);
  --slide-panel-transition: 250ms ease-out;

  --fluid-text-body: clamp(11px, 1.2vw, 13px);
  --fluid-text-meta: clamp(8px, 0.9vw, 10px);
  --fluid-el-height: clamp(24px, 3vw, 30px);
  --fluid-gap: clamp(4px, 1vw, 8px);
  --fluid-padding: clamp(8px, 2vw, 16px);
  --fluid-header-height: clamp(30px, 4vw, 44px);
}
```

Rule going forward for the ENTIRE app: no inline/hardcoded height values anywhere. Every height must reference one of these tokens.

## Global Component Sizing Rules (v1.2 Tokens)
- `--stat-chip-height` (28px): Used for stat chips/metric badges (`[VALUE] [LABEL]`).
- `--header-bar-height` (30px): Used for single-line compact module header bars.
- `--filter-bar-height` (28px): Used for single-line search & filter bars and quick-add bars.
- `--micro-input-height` (22px): Used for micro text inputs, selects, and search inputs inside filter bars.
- `--micro-pill-height` (22px): Used for micro buttons, category badges, and micro-pill action triggers.
- `--table-row-height` (28px): Used for table headers and compact data rows.
- Note: Primary/destructive confirmation buttons maintain 26px-28px height or accessibility floor. On touch devices (<640px), 22px interactive elements scale to 24px minimum accessibility floor.

## Facebook-Style Mobile Shell Pattern

1. **Navigation Across Breakpoints**:
   - **Desktop (>1024px)**: Fixed full sidebar visible (`var(--sidebar-width-desktop)`), expanded menu tree.
   - **Tablet (640px-1024px)**: Sidebar collapses into a sleek icon-only rail (64px wide).
   - **Mobile (<640px)**: Sidebar fully hidden by default (`0px`). Hamburger icon (24px) in sticky header opens a 250ms slide-in overlay drawer with dark scrim background.

2. **Top Bar Header**:
   - Persistent top bar (44px on mobile, 30-36px on desktop) with Hamburger toggle (mobile/tablet), Logo/Brand Switcher, and Profile/Emergency Status controls.

3. **Bottom Navigation Bar (Mobile Only)**:
   - Fixed bottom tab bar on mobile screens for 4-5 core quick-access modules (RC Suppliers, Finance, Family, Emails, Command Center) alongside full Hamburger drawer for all modules.

4. **Auto-Adjust Layout Shell & Full Width Standard**:
   - Implemented via a central `<AdminShell>` layout wrapper component.
   - Content area automatically expands to 100% full width (`w-full`) with zero or minimal horizontal padding (`p-0` or `p-1`/`px-1` max) and NO artificial `max-w-*` constraints.
   - Body scroll lock (`overflow: hidden`) active when slide-in menu drawer is open.

## Fluid Rules (Size/Space Continuity)

1. **Fluid Typography (`--fluid-text-body`, `--fluid-text-meta`)**:
   - Text continuously scales smoothly between 320px (mobile min) and 2560px (ultra-wide max) using `clamp()`.
   - Prevents sudden breakpoint font size jumps between desktop (11px) and mobile (13px).

2. **Fluid Sizing & Spacing (`--fluid-el-height`, `--fluid-gap`, `--fluid-padding`)**:
   - Container padding, gaps, and control heights continuously adjust relative to viewport width (`vw`).
   - Control element height floor is strictly **24px** (mobile touch minimum) and ceiling **30px** (desktop density cap).

3. **Fluid Grid Layouts**:
   - Stat chips grid: `grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))]` with fluid gap `var(--fluid-gap)`. Naturally reflows without stepped media queries.

4. **Structural Breakpoints vs. Fluid Sizing (Mandatory Boundary)**:
   - **FLUID**: Continuous size properties (font sizes, padding, gap, element height).
   - **HARD BREAKPOINT SWITCHES**: Structural UI pattern transitions (Table row → Stacked card at 640px; Filter bar → Mobile bottom sheet; Bottom nav bar visibility).

5. **Viewport Safety**:
   - All `vw` units MUST be bound inside `clamp(min, preferred-vw, max)` to guarantee legibility and touch-safety at 320px and 2560px extremes.

---

## Global Component Rules

### 1. Stat Cards → Inline Chips (`--stat-chip-height: 28px` / `--fluid-el-height`)
- Stat chips convert to fluid height chips (`height: var(--fluid-el-height)`), arranged in an auto-fitting CSS grid (`grid-cols-[repeat(auto-fit,minmax(120px,1fr))]`).
- Format: `[VALUE] [LABEL]` e.g. `412 TOTAL EMAILS`.

### 2. Page Header (`--fluid-header-height`)
- Header bar smoothly scales height between 30px (desktop compact) and 44px (mobile touch target), with fluid padding and text sizes.

### 3. Filter Bar & Micro Inputs (`--fluid-el-height`)
- Single bar containing filter controls with fluid gap (`var(--fluid-gap)`).
- Micro-inputs/selects/buttons scale smoothly with clamp-based height rules.

### 4. Buttons (`--fluid-el-height`)
- Touch target floor never drops below 24px on mobile devices.
- CTA buttons smoothly adapt width and height within clamp constraints.

### 5. Tables & Data Rows (`--table-row-height: 28px`)
- **Row Height & Padding**: Data rows strictly maintain compact 28px–30px row height (`h-[28px]` or `py-0.5`/`py-1` padding). No large vertical padding (`py-3` / `py-4` is strictly forbidden in data rows).
- **Cell Elements**: Badges, status pills, and tags inside cells MUST use micro-chips (`h-[20px]`/`h-[22px]`, `text-[9px]`/`text-[10px]`, `px-1.5`–`px-2`).
- **Data Densification**: Identifiers, emails, domain names, codes, dates, and amounts use crisp monospace font (`font-mono`) for optical alignment and maximum data clarity.
- **Mobile Cards**: At `<640px` breakpoint, switches structurally to stacked mobile cards.

---

## Audit of Modules & Status (v1.4 Fluid Ready)
1. **RcSupplierListStudio.tsx**:
   - Single fluid header, auto-fit stat chips grid with fluid gap, fluid filter bar, 28px table rows with stacked mobile view switch.

2. **EmailCommandCenter.tsx**:
   - Fluid header, auto-fit stat chips, fluid filter bar & micro-pills.

3. **CredentialsVaultStudio.tsx**:
   - Fluid header, auto-fit stat chips, fluid filter bar, 28px table rows.

4. **ProductCatalogStudio.tsx**:
   - Fluid header, auto-fit stat chips, fluid filter bar.

5. **SupplierStudio.tsx**:
   - Fluid header, auto-fit stat chips, fluid filter bar.

6. **InventorySyncEngine.tsx**:
   - Fluid header, auto-fit stat chips, fluid filter bar.

7. **GoogleSheetDepartmentHub.tsx**:
   - Fluid header, auto-fit stat chips, fluid filter bar.

8. **ProjectDetailView.tsx**:
   - Fluid header, auto-fit stat chips.

9. **MyLife Suite (LifeOverview, PeopleManager, InsuranceManager, etc.)**:
   - Fluid header, auto-fit stat chips, fluid filter bar & micro-pills.

