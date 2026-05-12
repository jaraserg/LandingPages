# HELIO Landing Page Selector - Specification

## 1. Project Overview

- **Project Name**: HELIO - Landing Page Selector
- **Type**: Static website (HTML/CSS/JS)
- **Core Functionality**: A curated gallery of landing page templates that clients can browse and filter based on their profile, role, company size, or business type
- **Target Users**: Business clients seeking landing page templates tailored to their industry and role

---

## 2. UI/UX Specification

### Layout Structure

**Header**
- Fixed navigation bar
- Logo/brand name "HELIO" on left
- Minimal nav: "About" | "Contact" on right
- Height: 72px

**Hero Section**
- Full-width, centered content
- Main headline: "First page in your history"
- Subheadline explaining the concept
- Subtle scroll indicator

**Filter Bar**
- Sticky below header on scroll
- Filter categories: Profile, Role, Company Size, Business Type
- Horizontal scrollable on mobile
- Active filter state indicators

**Template Gallery**
- CSS Grid: 3 columns desktop, 2 tablet, 1 mobile
- Cards with hover effects
- Template preview thumbnail
- Template name and category tags

**Footer**
- Minimal: Copyright, HELIO branding
- Height: 80px

### Visual Design

**Color Palette (Monochrome)**
- Background: `#0A0A0A` (near black)
- Surface: `#141414` (card backgrounds)
- Surface Elevated: `#1A1A1A` (hover states)
- Border: `#2A2A2A`
- Text Primary: `#FAFAFA`
- Text Secondary: `#888888`
- Accent: `#FFFFFF` (for CTAs and highlights)

**Typography**
- Headings: "Instrument Serif", serif (elegant, distinctive)
- Body: "DM Sans", sans-serif (clean, readable)
- Hero Title: 72px desktop / 40px mobile
- Section Titles: 32px desktop / 24px mobile
- Body: 16px
- Small/Tags: 12px

**Spacing System**
- Section padding: 120px vertical desktop / 80px mobile
- Card padding: 24px
- Grid gap: 32px desktop / 20px mobile
- Container max-width: 1200px

**Visual Effects**
- Cards: Subtle border, lift on hover with shadow
- Transitions: 300ms ease-out for all interactions
- Hero: Subtle gradient overlay
- Filter tags: Pill-shaped with border highlight on active

### Components

**Filter Pills**
- Default: transparent bg, border, gray text
- Hover: light bg
- Active: white bg, black text

**Template Cards**
- Aspect ratio: 16:10 preview area
- Rounded corners: 12px
- Border: 1px solid #2A2A2A
- Hover: translateY(-4px), border brightens
- Contains: Preview image placeholder, title, tags

**Buttons**
- Primary: White bg, black text, no border
- Secondary: Transparent, white border, white text
- Hover: invert colors

---

## 3. Functionality Specification

### Core Features

1. **Filter System**
   - Filter by Profile: Startup, Enterprise, Agency, Freelancer
   - Filter by Role: CEO, Marketer, Developer, Designer
   - Filter by Company Size: Small, Medium, Large, Enterprise
   - Filter by Business Type: Tech, Finance, Healthcare, E-commerce, Education, Real Estate
   - Multiple filters can be active simultaneously
   - "Clear All" button when filters active

2. **Template Gallery Display**
   - 9 sample template cards with placeholder previews
   - Smooth fade-in animation on filter change
   - "No results" message when filters yield empty

3. **Responsive Behavior**
   - Mobile: Single column, horizontal filter scroll
   - Tablet: 2-column grid
   - Desktop: 3-column grid, full filter bar visible

### User Interactions
- Click filter → instant toggle with visual feedback
- Click card → could link to template detail (future)
- Scroll → header remains fixed, filter bar sticks

### Edge Cases
- No matching templates: Show friendly "No templates match your criteria" message
- All filters cleared: Show all templates

---

## 4. Acceptance Criteria

- [ ] Page loads without errors
- [ ] HELIO branding visible in header
- [ ] Hero section displays "First page in your history"
- [ ] All 4 filter categories present and functional
- [ ] 9 template cards display in grid
- [ ] Filtering updates displayed cards correctly
- [ ] Responsive: looks good on mobile, tablet, desktop
- [ ] Monochrome color scheme throughout
- [ ] Smooth hover transitions on cards and filters
- [ ] Ready for GitHub Pages deployment (no server needed)
