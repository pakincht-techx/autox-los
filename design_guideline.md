# Design Guidelines: AutoX LOS

This document outlines the design principles, color palette, typography, and structural elements used in the **AutoX LOS (Loan Origination System)** application. The design focuses on a clean, professional "Chaiyo" brand identity with a "Nova Style" (compact & dense) layout for high-density data presentation.

---

## 1. Design Philosophy: "Nova Style"
The "Nova Style" is a design system optimized for **high-density data applications**. Unlike consumer-facing apps that use generous ease and whitespace, an LOS (Loan Origination System) requires underwriters to scan vast amounts of information (customer data, financial records, documents) quickly.

-   **Compact Density**: Reduced padding and margins to fit more data on the viewport without feeling cluttered.
-   **Clear Boundaries**: extensive use of borders and subtle background differences to clearly separate data sections.
-   **Function over Form**: Every pixel is used to convey information or actionable status.

---

## 2. Color Palette

### Brand Colors
The primary brand colors establish the identity of the application.

| Color Name | Hex Code | Variable | Usage | Meaning |
| :--- | :--- | :--- | :--- | :--- |
| **Chaiyo Blue** | `#001275` | `--color-chaiyo-blue` | Primary buttons, active states, key headers, focus rings. | **Trust, Stability, Authority.** This is the main action color. |
| **Chaiyo Gold** | `#FFB909` | `--color-chaiyo-gold` | Accent highlights, "recommended" tags, focus indicators. | **Value, Opportunity.** Used sparingly to draw eye to high-value items. |

### Status Colors
Used to convey the state of applications, alerts, and system feedback.

| Status | Hex Code | Visual | Usage |
| :--- | :--- | :--- | :--- |
| **Approved / Success** | `#10B981` (Emerald) | Green | Approved applications, successful saves, positive financial trends. |
| **Pending / Warning** | `#F59E0B` (Amber) | Orange | Applications in review, missing information, warnings. |
| **Rejected / Error** | `#EF4444` (Red) | Red | Rejected applications, critical errors, destructive actions (delete). |

### Neutral & Structural Colors
Backgrounds and borders that form the skeleton of the UI.

-   **Background (`#F9FAFB`)**: The canvas. A very light gray to reduce eye strain compared to pure white.
-   **Surface/Card (`#FFFFFF`)**: The container. All content lives on white "Cards" or "Sheets" to pop against the background.
-   **Text Primary (`#111827`)**: Almost black, for maximum contrast and readability.
-   **Text Muted (`#6B7280`)**: Gray text for labels, help text, and secondary information.

---

## 3. Typography

The application uses **IBM Plex Thai** as the primary font family. This typeface is chosen for its excellent legibility in both English and Thai scripts, which is critical for a localized LOS.

-   **Font Family**: `IBM Plex Thai`, fallback to `ui-sans-serif`.
-   **Scale**:
    -   **Heading 1**: 24px-30px (Page Titles)
    -   **Heading 2**: 20px (Section Headers)
    -   **Heading 3**: 16px-18px (Card Titles)
    -   **Body**: 14px (Standard reading text)
    -   **Small**: 12px (Labels, table metadata)

---

## 4. Components & "Meaning"

### Buttons
Buttons tell the user *what they can do*.

-   **Primary (Solid Blue)**: The single main objective of the screen (e.g., "Submit Application").
-   **Secondary (Outline)**: Safe, alternative actions (e.g., "Save Draft", "Back").
-   **Destructive (Red)**: deeply warns the user of consequence (e.g., "Reject Application", "Delete").
-   **Ghost (Transparent)**: Low friction actions (e.g., "Edit" icon in a table row).

### Inputs & Forms
Inputs are the core interaction point for data entry.

-   **Shape**: `rounded-xl`. A softer, more modern radius (approx 12px) that feels approachable.
-   **Default State**: White background, `border-gray-200`.
-   **Focus State**: `border-chaiyo-blue` with a subtle blue ring. **Meaning**: "I am listening to your input."
-   **Size**: Compact height (`h-9` / 36px) to fit more fields vertically.

### Tables (Data Grids)
Tables are the workhorse of the LOS.

-   **Headers**: Subtle gray text (`text-muted-foreground`), uppercase or capitalized, with a bottom border.
-   **Rows**: White background, separated by `border-gray-100`.
-   **Interactivity**: Rows have a hover state (`hover:bg-muted/50`) to help track the eye across wide datasets.

### Overlays (Sheets & Dialogs)
Used to maintain context while performing sub-tasks.

-   **Sheet (Side Panel)**: Used for long forms or detailed views (e.g., "Edit Customer Details") where the user might need to reference the underlying page. It slides in from the right.
-   **Dialog (Modal)**: Used for short, critical decisions (e.g., "Confirm Approval"). Forces focus and blocks interaction with the background.

---

## 5. Shadows & Borders

We use a "light touch" approach to depth.

### Borders
Borders define structure.
-   **Standard**: `1px solid #E5E7EB`. Used on Cards and Inputs.
-   **Separators**: `1px solid #F3F4F6`. Used inside cards to separate sections.

### Shadows
Shadows define hierarchy (elevation).
-   **Level 1 (`shadow-sm`)**: Cards. Lifts the white surface just enough to separate it from the gray background.
-   **Level 2 (`shadow-lg`)**: Dropdowns, Popovers, and Sticky Headers.
-   **Level 3 (`shadow-xl` + Overlay)**: Modals and Sheets. Indicates this content is "floating" above everything else.

---

## 6. Iconography
We use **Lucide React** for icons.
-   **Style**: 4px stroke width (or standard), rounded line caps.
-   **Usage**: Icons should accompany buttons or complex labels to aid quick visual scanning.

---

## 7. Spacing System
We follow a 4px grid system but lean towards tighter spacing:
-   `gap-2` (8px): Between related buttons.
-   `gap-4` (16px): Between form fields.
-   `p-4` (16px): Standard Card padding.
-   `p-6` (24px): Page container padding.
