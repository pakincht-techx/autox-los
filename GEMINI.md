# AutoX LOS (Loan Origination System)

A front-end prototype for the **Chaiyo** brand's Loan Origination System, built for staff (Maker/Checker/Approver) to process loan applications efficiently.

## Tech Stack

- **Framework**: Next.js 16 (App Router) with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with custom `@theme` tokens in `src/app/globals.css`
- **UI Library**: shadcn/ui (Radix primitives) — components live in `src/components/ui/`
- **Animation**: Framer Motion
- **Icons**: Lucide React (standard stroke width, rounded line caps)
- **Font**: IBM Plex Sans Thai (primary), loaded via `next/font`
- **Date Library**: date-fns (Buddhist Era conversion: year + 543)

## Project Structure

```
src/
├── app/                   # Next.js App Router pages
│   ├── globals.css        # Theme tokens & global styles
│   ├── layout.tsx         # Root layout (font, sidebar)
│   └── dashboard/         # All dashboard routes
│       ├── pre-question/  # Pre-screening questionnaire
│       └── new-application/ # Multi-step application form
├── components/
│   ├── ui/                # shadcn/ui base components (Button, Input, Dialog, etc.)
│   ├── layout/            # Sidebar, header, breadcrumbs
│   ├── dashboard/         # Dashboard-specific components
│   ├── calculator/        # Loan calculator components
│   ├── application/       # Application detail components
│   └── applications/      # Application list components
├── data/                  # Static/mock data (vehicle-data.ts, etc.)
├── services/              # Service layer (API calls, business logic)
└── lib/                   # Utilities (cn helper, etc.)
```

## Design System — "Nova Style"

Optimized for **high-density data applications**. Underwriters need to scan vast amounts of information quickly.

- **Compact Density**: Reduced padding/margins to fit more data without clutter.
- **Clear Boundaries**: Borders and subtle background differences separate data sections.
- **Function over Form**: Every pixel conveys information or actionable status.

Full design rules: `.agent/workflows/design-rules.md` — run `/design-rules` to review.

## Color Palette

### Brand Colors
| Token | Hex | Usage |
|---|---|---|
| `--color-chaiyo-blue` | `#10069F` | Primary buttons, active states, focus rings |
| `--color-chaiyo-gold` | `#FFD100` | Accent highlights, "recommended" tags |

### Status Colors
| Status | Hex | Usage |
|---|---|---|
| Approved / Success | `#10B981` (Emerald) | Approved apps, successful saves |
| Pending / Warning | `#F59E0B` (Amber) | Apps in review, missing info |
| Rejected / Error | `#EF4444` (Red) | Rejected apps, critical errors |

### Structural Colors
| Token | Hex | Usage |
|---|---|---|
| Background | `#F9FAFB` | Page canvas (light gray) |
| Surface/Card | `#FFFFFF` | Content containers |
| Text Primary | `#111827` | Main readable text |
| Text Muted | `#6B7280` | Labels, help text, secondary info |
| `--color-border-color` | `#E5E7EB` | Default borders |
| `--color-border-subtle` | `#F3F4F6` | Card borders, separators |
| `--color-border-strong` | `#D1D5DB` | High-contrast boundaries |

### Border Rules
- `border-gray-200` — default for inputs.
- `border-border-subtle` — outer card borders, inner separators.
- `border-border-strong` — table containers (`border border-border-strong rounded-xl overflow-hidden bg-white`).
- **Never** use bare `border` without an explicit color class (Tailwind v4 defaults to `currentColor`).

## Typography

**Font**: IBM Plex Sans Thai → `ui-sans-serif` fallback.

| Level | Size | Usage |
|---|---|---|
| Heading 1 | 24–30px | Page titles |
| Heading 2 | 20px | Section headers |
| Heading 3 | 16–18px | Card titles |
| Body | 14px | Standard text |
| Small | 12px | Labels, table metadata |

## Component Conventions

### Buttons
- **Primary (Solid Blue)**: Main action on screen (e.g., "Submit Application").
- **Secondary (Outline)**: Alternative actions (e.g., "Save Draft", "Back").
- **Destructive (Red)**: Warns of consequence (e.g., "Reject", "Delete").
- **Ghost (Transparent)**: Low-friction actions (e.g., "Edit" icon in a table row).

### Form Inputs
- Always use **shadcn/ui** components from `@/components/ui/`. Never create custom HTML elements when a shadcn component exists.
- Height: `h-12`, Background: `bg-white`, Radius: `rounded-xl`.
- Focus state: `border-chaiyo-blue` with subtle blue ring.
- Mandatory fields: red asterisk `<span className="text-red-500">*</span>` in `<Label>`.
- **Amount Inputs**: Use comma formatting (e.g., `1,000.00`) for all currency/amount fields to improve readability.

### Dialogs & Sheets
- **No top-right close (X) icon.** Close via footer buttons only.
- Overlay: `bg-black/10 backdrop-blur-sm`.
- **Sheet**: Slides from right — for long forms where user references the underlying page.
- **Dialog**: Centered modal — for short, critical decisions.

### Tables
- Container: `border border-border-strong rounded-xl overflow-hidden bg-white`.
- Headers: `bg-gray-50/50`, muted text.
- Row hover: `hover:bg-gray-50/50` + `transition-colors`.
- Separators: `border-border-subtle`.

## Shadows & Depth

| Level | Class | Usage |
|---|---|---|
| Level 1 | `shadow-sm` | Cards |
| Level 2 | `shadow-lg` | Dropdowns, popovers, sticky headers |
| Level 3 | `shadow-xl` + overlay | Modals, sheets |

## Spacing System

4px grid, leaning compact:
- `gap-2` (8px): Between related buttons.
- `gap-4` (16px): Between form fields.
- `p-4` (16px): Standard card padding.
- `p-6` (24px): Page container padding.

## Z-Index Layering

| Level | Z-Index | Elements |
|---|---|---|
| Base (0) | — | Main content, cards, tables |
| Navigation (1) | `z-40` | Sidebar toggle |
| Modals (2) | `z-50+` | Dialogs, sheets, alert dialogs |
| Top (3) | Above z-50 | Tooltips, global notifications |

## Dates & Calendar

- **Buddhist Era (พ.ศ.) only** — never show A.D. years in the UI.
- Day ≤ 31, Month ≤ 12 — validated internally.
- All date storage is in **ISO A.D. format** (`YYYY-MM-DD`) internally; conversion is done at the component level.

### `DatePickerBE` — Standard Date Input Component

**Always use `<DatePickerBE />` for any date field** — never use a plain `<Input>` with manual date formatting.

```tsx
import { DatePickerBE } from "@/components/ui/DatePickerBE";

// value: stored as "YYYY-MM-DD" (A.D.) in formData
// Displays to user as "วว/ดด/ปปปป (พ.ศ.)"
<DatePickerBE
    value={formData.someDate ?? ""}
    onChange={(val) => handleChange("someDate", val)}
    inputClassName="h-12 rounded-xl"
/>
```

**Props:**
| Prop | Type | Description |
|---|---|---|
| `value` | `string` | ISO A.D. date string `YYYY-MM-DD` (or `""`) |
| `onChange` | `(val: string) => void` | Fires with ISO A.D. date after user completes 8 digits |
| `placeholder` | `string` | Defaults to `"วว/ดด/ปปปป (พ.ศ.)"` |
| `inputClassName` | `string` | Class applied to the inner `<Input>` |
| `disabled` / `readOnly` | `boolean` | Disables interaction |
| `error` | `boolean` | Applies red border |

**Behavior:**
- User types 8 digits (no slashes needed); slashes are auto-inserted.
- If user types an A.D. year (< 2400), it auto-converts to B.E. (`+543`).
- `onChange` only fires when all 8 digits are complete and the date is valid.
- On blur, display resyncs to match the stored A.D. value.


## Language & Locale

- UI language is **Thai** (ภาษาไทย). All labels, buttons, and user-facing text are in Thai.
- Code (variables, comments, component names) is in **English**.

## Development

```bash
npm run dev    # Start dev server at http://localhost:3000
npm run build  # Production build
npm run lint   # ESLint
```
