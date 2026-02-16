# UI/UX Pro Max - Design Intelligence

Comprehensive design guide for web and mobile applications. Contains 50+ styles, 97 color palettes, 57 font pairings, 99 UX guidelines, and 25 chart types across 9 technology stacks. Searchable database with priority-based recommendations.

## When to Apply
Reference these guidelines when:
- Designing new UI components or pages
- Choosing color palettes and typography
- Reviewing code for UX issues
- Building landing pages or dashboards
- Implementing accessibility requirements

## Rule Categories by Priority
| Priority | Category | Impact | Domain |
| :--- | :--- | :--- | :--- |
| 1 | Accessibility | CRITICAL | ux |
| 2 | Touch & Interaction | CRITICAL | ux |
| 3 | Performance | HIGH | ux |
| 4 | Layout & Responsive | HIGH | ux |
| 5 | Typography & Color | MEDIUM | typography, color |
| 6 | Animation | MEDIUM | ux |
| 7 | Style Selection | MEDIUM | style, product |
| 8 | Charts & Data | LOW | chart |

## Quick Reference

### 1. Accessibility (CRITICAL)
- **color-contrast**: Minimum 4.5:1 ratio for normal text
- **focus-states**: Visible focus rings on interactive elements
- **alt-text**: Descriptive alt text for meaningful images
- **aria-labels**: `aria-label` for icon-only buttons
- **keyboard-nav**: Tab order matches visual order
- **form-labels**: Use label with for attribute

### 2. Touch & Interaction (CRITICAL)
- **touch-target-size**: Minimum 44x44px touch targets
- **hover-vs-tap**: Use click/tap for primary interactions
- **loading-buttons**: Disable button during async operations
- **error-feedback**: Clear error messages near problem
- **cursor-pointer**: Add `cursor-pointer` to clickable elements

### 3. Performance (HIGH)
- **image-optimization**: Use WebP, srcset, lazy loading
- **reduced-motion**: Check `prefers-reduced-motion`
- **content-jumping**: Reserve space for async content

### 4. Layout & Responsive (HIGH)
- **viewport-meta**: `width=device-width, initial-scale=1`
- **readable-font-size**: Minimum 16px body text on mobile
- **horizontal-scroll**: Ensure content fits viewport width
- **z-index-management**: Define z-index scale (10, 20, 30, 50)

### 5. Typography & Color (MEDIUM)
- **line-height**: Use 1.5-1.75 for body text
- **line-length**: Limit to 65-75 characters per line
- **font-pairing**: Match heading/body font personalities

### 6. Animation (MEDIUM)
- **duration-timing**: Use 150-300ms for micro-interactions
- **transform-performance**: Use transform/opacity, not width/height
- **loading-states**: Skeleton screens or spinners

### 7. Style Selection (MEDIUM)
- **style-match**: Match style to product type
- **consistency**: Use same style across all pages
- **no-emoji-icons**: Use SVG icons, not emojis

### 8. Charts & Data (LOW)
- **chart-type**: Match chart type to data type
- **color-guidance**: Use accessible color palettes
- **data-table**: Provide table alternative for accessibility

## How to Use This Skill
When user requests UI/UX work (design, build, create, implement, review, fix, improve), follow this workflow:

### Step 1: Analyze User Requirements
Extract key information: Product type, style keywords, industry, and tech stack.

### Step 2: Generate Design System (REQUIRED)
Always start with `--design-system` to get comprehensive recommendations:
```bash
python3 skills/ui-ux-pro-max/scripts/search.py "<product_type> <industry> <keywords>" --design-system -p "Project Name"
```

### Step 2b: Persist Design System
Use `--persist` to save the design system for hierarchical retrieval:
```bash
python3 skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system --persist -p "Project Name"
```

### Step 3: Supplement with Detailed Searches
```bash
python3 skills/ui-ux-pro-max/scripts/search.py "<keyword>" --domain <domain> [-n <max_results>]
```

### Step 4: Stack Guidelines
Get implementation-specific best practices (Default: html-tailwind):
```bash
python3 skills/ui-ux-pro-max/scripts/search.py "<keyword>" --stack html-tailwind
```

## Search Reference

### Available Domains
- **product**: SaaS, e-commerce, portfolio, healthcare, beauty
- **style**: glassmorphism, minimalism, dark mode, brutalism
- **typography**: elegant, playful, professional, modern
- **color**: saas, ecommerce, healthcare, beauty, fintech
- **landing**: hero, testimonial, pricing, social-proof
- **chart**: trend, comparison, timeline, funnel, pie
- **ux**: animation, accessibility, z-index, loading
- **react**: waterfall, bundle, suspense, memo, rerender
- **web**: aria, focus, keyboard, semantic, virtualize

### Available Stacks
- html-tailwind, react, nextjs, vue, svelte, swiftui, react-native, flutter, shadcn, jetpack-compose

## Pre-Delivery Checklist
- No emojis used as icons (use SVG instead).
- All clickable elements have `cursor-pointer`.
- Light mode text has sufficient contrast (4.5:1 minimum).
- No content hidden behind fixed navbars.
- Responsive at 375px, 768px, 1024px, 1440px.
- `prefers-reduced-motion` respected.
