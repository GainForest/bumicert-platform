---
"bumicerts": patch
---

Polished the collapsible desktop sidebar: transparent background, centered logo when collapsed, and expand chevron moved into the sidebar itself

## Collapsible Sidebar

- Sidebar collapses to icon-only (w-16) and expands to full width (w-[240px]) with smooth CSS transition
- Collapse button (ChevronLeft) appears inside the sidebar header, visible only when expanded
- Expand chevron (ChevronRight) now appears inside the collapsed sidebar below the logo, replacing the old bottom expand button
- Logo is horizontally centered when the sidebar is collapsed
- Logo and title appear in the same line when expanded — small 20×20 icon with serif title beside it

## Navigation Items

- When collapsed, nav items show icon-only with Tooltip on hover
- When expanded, nav items show icon + text using plain link style with hover:bg-foreground/5
- Active items use primary color background in both expanded and collapsed views
- Sub-item groups (NavLinkGroup with children) preserved: expand/collapse with chevrons, auto-expand active group, max 2 groups expanded at once
- When collapsed, group items show only parent icon; clicking expands the sidebar

## Layout

- NavbarLayout always renders DesktopNavbar (not conditional on openState) — sidebar is always visible
- Main content area always has border/shadow/rounded styling
- Sidebar background is now fully transparent (bg-transparent)
- Expand chevron removed from the Header component — it now lives inside the collapsed sidebar
