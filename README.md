# Drift Line

**Drift Line** is a custom Shopify Online Store 2.0 theme built from scratch as a real-world frontend and Shopify development portfolio project.

The project explores how a premium streetwear storefront can feel experimental and memorable without sacrificing usability, accessibility, or shopping clarity.

> **Modern enough to shop. Crazy enough to remember.**

## Project Goal

Drift Line is being built to demonstrate practical Shopify theme development rather than simple theme customization.

The project focuses on:

- Shopify theme architecture
- Liquid and Shopify data flow
- reusable sections and snippets
- merchant-configurable storefront features
- responsive frontend development
- accessibility-conscious interaction design
- purposeful motion
- ecommerce UX
- Git-based development
- AI-assisted engineering without replacing developer judgment

## Current Features

### Storefront Foundation

- Shopify Online Store 2.0 architecture
- JSON templates
- reusable Liquid sections and snippets
- responsive layout system
- configurable light and dark themes
- merchant-selectable display and body typography
- visible keyboard focus states
- reduced-motion support

### Responsive Header

- Shopify Navigation integration
- desktop navigation beside the brand logo
- responsive hamburger navigation
- merchant-selectable mobile menu styles:
  - Full screen
  - Side drawer
  - Dropdown
- optional editorial menu numbering
- configurable navigation text scale
- compact light/dark mode toggle
- accessible keyboard and focus behavior

### Collections Directory

- merchant-curated collections
- automatic Shopify collections fallback
- alternating editorial desktop layout
- mobile-first stacked layout
- optional product count
- configurable CTA label
- responsive collection imagery
- collection image fallback handling
- 12 collections per page
- native Liquid pagination

### Individual Collection Pages

- collection title and description
- optional product count
- merchant controls for description and count visibility
- responsive product grid:
  - 2 columns on mobile
  - 3 columns on tablet
  - 4 columns on desktop
- 24 products per page
- native Liquid pagination
- empty collection state
- reusable product-card component
- responsive product imagery

### Product Cards

- featured product image
- optional secondary image
- product title and price
- compare-at pricing
- Sold Out, Sale, and New states
- responsive image loading
- whole-card product navigation
- keyboard focus support
- reduced-motion-aware image interaction

### Product Detail Page

- responsive media and product-information layout
- stacked Shopify product media
- product title
- selected-variant pricing
- compare-at pricing
- availability and sold-out states
- quantity input
- native Shopify product form
- Add to Cart submission
- optional product description
- progressive-enhancement variant architecture
- responsive mobile and desktop layouts

### Motion System

Motion is treated as part of the UX rather than decoration.

Drift Line distinguishes between:

1. **UX-improving motion**
2. **Brand-expressive motion**
3. **Distracting or harmful motion**

Current motion includes restrained navigation entrances, CTA feedback, product-card interactions, and reduced-motion fallbacks.

## Tech Stack

- Shopify Online Store 2.0
- Liquid
- HTML5
- CSS3
- Vanilla JavaScript
- JSON templates
- Shopify CLI
- Git & GitHub
- VS Code

No React, Vue, Next.js, or frontend framework is used in the theme.

## Development Workflow

Development follows a structured AI-assisted workflow:

**UNDERSTAND → QUESTION → PLAN → SPECIFY → IMPLEMENT → VERIFY → REFLECT → DOCUMENT → COMMIT**

AI is used for repository inspection, implementation support, debugging, and review, while architecture, UX decisions, verification, and final product decisions remain developer-led.

The repository is treated as the source of truth.

## Current Status

🚧 **Active development**

Currently verified:

- responsive global header
- light/dark theme system
- configurable typography
- Collections Directory
- individual collection pages
- Product Detail Page
- sold-out product state
- native Shopify Add to Cart submission

Still in progress or intentionally deferred:

- Cart page / cart drawer
- advanced filtering and sorting
- product recommendations
- advanced product-gallery interactions
- broader accessibility and performance audit
- final SEO and production-readiness review

Some functionality has been implemented but still requires broader runtime testing with larger or more varied store data, including:

- collection pagination with more than 24 products
- multi-variant product behavior
- additional Shopify product media types

## Repository

This project is developed incrementally using small Git milestones so that individual features can be inspected, tested, explained, and reviewed independently.