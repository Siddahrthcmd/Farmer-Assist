# FarmerAssist Design Guidelines

## Design Approach: Reference-Based + Government Standards
Drawing inspiration from modern agricultural platforms like FarmLogs and AgriWebb, combined with Kerala government digital service standards for accessibility and trust.

## Core Design Elements

### Color Palette
**Primary Colors:**
- Forest Green: 140 60% 25% (primary brand - represents agriculture)
- Kerala Gold: 45 85% 55% (accent - represents prosperity)
- Slate Blue: 215 25% 35% (secondary - professional government tone)

**Supporting Colors:**
- Light Green: 140 40% 92% (backgrounds)
- Warm Gray: 30 8% 95% (neutral backgrounds)
- Deep Red: 0 70% 45% (alerts/warnings)

### Typography
- **Primary:** Inter (Google Fonts) - clean, readable for government use
- **Headers:** Poppins (Google Fonts) - friendly yet professional
- **Body:** 16px base, 1.5 line height for accessibility

### Layout System
Tailwind spacing units: 2, 4, 6, 8, 12, 16 for consistent rhythm
- Mobile-first responsive grid
- Maximum content width: 1200px
- Generous whitespace for government accessibility standards

### Component Library

**Navigation:**
- Clean top navigation with Kerala government branding
- Breadcrumb navigation for deep content
- Mobile hamburger menu with full-screen overlay

**Forms:**
- Large touch-friendly inputs (min 44px height)
- Clear field labels and validation states
- Multi-step forms with progress indicators

**Data Display:**
- Card-based layouts for crop recommendations
- Weather widgets with visual icons
- Data tables with sorting and filtering
- Charts using muted green color scheme

**Core Components:**
- Primary buttons: Forest green with white text
- Outline buttons: Green border with transparent background
- Alert banners: Contextual colors with icons
- Loading states: Subtle green shimmer effects

## Visual Treatment

**Gradients:**
- Subtle green-to-light-green gradients for hero sections
- Avoid overuse - limit to 1-2 strategic placements

**Imagery:**
- Hero section: Large landscape image of Kerala farmland
- Feature sections: High-quality crop and farming imagery
- Iconography: Agriculture-themed icons (Heroicons library)
- Illustrations: Simple, Kerala-cultural agricultural scenes

**Backgrounds:**
- Primary: Clean whites and light greens
- Accent sections: Very subtle gradient overlays
- Government footer: Kerala Gold accent stripe

## Government Requirements
- High contrast ratios (WCAG AA compliance)
- Large clickable areas for accessibility
- Clear visual hierarchy
- Consistent government branding placement
- Multi-language support considerations (Malayalam/English)

## Images
- **Hero Image:** Wide landscape shot of Kerala rice paddies or spice plantations
- **Feature Icons:** Agriculture symbols (plant growth, weather, analytics)
- **Profile Avatars:** Default farmer silhouettes
- **Background Patterns:** Subtle agricultural motifs (rice grain patterns, very low opacity)

This design balances modern web standards with government accessibility requirements while maintaining agricultural authenticity.