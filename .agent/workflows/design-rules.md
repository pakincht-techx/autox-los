---
description: Design rules and conventions for the AutoX LOS project UI
---

# Design Rules

These are the design conventions that **must** be followed when implementing UI in this project.

## Form Elements (Inputs, Selects, Comboboxes)
- **Use `h-12` as the platform standard height.** All form elements should uniformly use `h-12` (48px) to provide a consistent, touch-friendly UI across the application. 
- **Use white backgrounds.** Do not use `bg-gray-50` or `bg-gray-100` for default input backgrounds unless it is specifically disabled. Rely on the base `bg-white` from the default Shadcn component.
- The default UI components (`Input`, `Select`, `Combobox`) have been preconfigured to use `h-12` and `bg-white` by default. Do not add redundant `className="h-12 border-gray-200 ..."` inline classes when rendering these fields.
- **Mandatory fields.** Visually indicate mandatory fields by appending a red asterisk `*` to the label. Implementation should use `<span className="text-red-500">*</span>` inside the `Label` component. e.g. `<Label>ชื่อ <span className="text-red-500">*</span></Label>`
- **Mandatory fields in tables.** When inputs inside a table are mandatory but have no individual label (the column header serves as the label), append the red asterisk `*` to the **`TableHead`** instead. This keeps cells compact and avoids repeating the asterisk per row. e.g. `<TableHead className="text-xs">ประเภทสินเชื่อ <span className="text-red-500">*</span></TableHead>`
## Dates & Years
- **Strictly use Buddhist Era (พ.ศ.).** All dates displayed to the user or entered by the user **must** use B.E. years (e.g., 2567). 
- **No A.D. (C.E.) years.** Never show Western years (e.g., 2024) in any part of the UI.
- **Input logic.** Use text inputs with formatting logic (e.g., `DD/MM/YYYY`) to handle B.E. years. Avoid native `type="date"` inputs which often default to A.D.
- **Day and Month Validation.** For all date/month/year text inputs, the day (DD) **must not exceed 31**, and the month (MM) **must not exceed 12**. Implement this validation in the `onChange` logic to automatically cap or correct the values as the user types.
- **Conversion.** Convert B.E. years to A.D. (Year - 543) only when saving to the backend or using standard JavaScript `Date` objects internally.

- Use `border-gray-200` (`#E5E7EB`) as the **default** border color for inputs and active containers.
- Use `border-gray-100` (`#F3F4F6` / `border-border-subtle`) for **outer card borders** in the minimalist aesthetic to ensure an integrated, premium feel, and for inner separators.
- Use `border-gray-300` (`#D1D5DB`) for strong boundaries where high contrast is needed.
- For brand-colored borders, use `border-chaiyo-blue` or `border-chaiyo-gold` sparingly.
- The bare `border` utility class in Tailwind v4 defaults to `currentColor` (often black). **Always** pair it with an explicit border color class, e.g., `border border-border-subtle`.

## Color Tokens

Reference the `@theme` block in `globals.css` for all color tokens:
- `--color-border-color: #E5E7EB` (Gray 200) — default borders
- `--color-border-subtle: #F3F4F6` (Gray 100) — subtle borders
- `--color-border-strong: #D1D5DB` (Gray 300) — strong borders

## Components

- Always use **shadcn UI** components from `@/components/ui/` instead of creating custom HTML elements.
- If a component variant doesn't exist (e.g., `Alert` with `warning`), add the variant to the shadcn component rather than building a custom div.
- **No shadows on buttons.** All buttons must have `shadow-none` — no `box-shadow` of any kind. Keep a flat, clean button aesthetic across the entire design system.
- **Keep default component styles.** Rely on the default styles provided by the design system (e.g. `variant="outline"`, `variant="ghost"`) and do NOT add custom Tailwind classes for colors, sizes, or hover states.

## Dialogs

### General Rules
- Dialog backdrops (overlays) must use **10% opacity black** (`bg-black/10`) with a blur effect (`backdrop-blur-sm`).
- **No top-right close (X) icon.** Close via footer buttons or backdrop only.
- **Default background is `bg-white`** (set in base `DialogContent`/`AlertDialogContent`).
- **Title color must be `text-gray-900`** — never use `text-chaiyo-blue` for dialog titles.
- **Use the `size` prop for dialog width.** Never use custom `className` overrides like `sm:max-w-[700px]` or `max-w-2xl`. Use the built-in `size` prop on `DialogContent` / `AlertDialogContent`:
  | Size | Class | Use for |
  |------|-------|---------|
  | `default` (omit prop) | `max-w-lg` (~512px) | Simple confirmations, small forms |
  | `lg` | `max-w-3xl` (~768px) | Tables, multi-column content |
  | `xl` | `max-w-6xl` (~1152px) | Full-width previews, complex layouts |
- **Generic titles & descriptions only.** Dialog titles and descriptions must be static/generic text. Do **not** interpolate dynamic content (e.g., document type names, entity names, IDs) into `DialogTitle`, `AlertDialogTitle`, `DialogDescription`, or `AlertDialogDescription`. For example, use `ไฟล์ที่อัปโหลด` instead of `ไฟล์ที่อัปโหลด — {label}`.
- **All footer buttons must be `font-bold`.**
- **No shadows on buttons** inside dialogs — use `shadow-none`.

### 3-Section Structure

Every dialog follows a **Header → Body → Footer** structure:

#### 1. Header (`DialogHeader` / `AlertDialogHeader`)
- **White background** (`bg-white`), sticky at top for scrollable dialogs.
- Contains: **Title** (mandatory, `text-gray-900`), **Description** (optional), **Action** (optional, e.g., search bar).
- Left-aligned. **No icons in dialog titles** — title text only.
- Pattern:
  ```tsx
  <DialogHeader>
      <DialogTitle className="text-gray-900">Title</DialogTitle>
      <DialogDescription>Optional description</DialogDescription>
  </DialogHeader>
  ```

#### 2. Body (`DialogBody` / `AlertDialogBody`)
- **Always wrap** content between header and footer with `DialogBody` to get consistent `px-6 py-4` padding aligned with header/footer.
- Never use a raw `<div>` between header and footer — it will lack left/right padding.
- Provides `overflow-y-auto` scrolling.
- Examples: form fields, info boxes, filter options, image previews, lists.
- For simple confirmation dialogs (just header + footer with no body content), you may omit `DialogBody`.

#### 3. Footer (`DialogFooter` / `AlertDialogFooter`)
- **White background** (`bg-white`), sticky at bottom for scrollable dialogs.
- **Buttons right-aligned** (default layout: `sm:justify-end`).
- **Button gap**: Footer has `gap-2` between buttons.
- **Minimum button width**: `min-w-[120px]` on each individual button.
- **Button style**: All buttons must be `font-bold shadow-none`.
- **Optional left-side info** via `DialogFooterInfo` / `AlertDialogFooterInfo`:
  ```tsx
  <DialogFooter>
      <DialogFooterInfo>
          <span>Lat: 13.82, Long: 100.56</span>
      </DialogFooterInfo>
      <Button variant="outline" className="min-w-[120px] font-bold">ยกเลิก</Button>
      <Button className="min-w-[120px] font-bold bg-chaiyo-blue hover:bg-chaiyo-blue/90">บันทึก</Button>
  </DialogFooter>
  ```

### Center-Aligned Dialogs (No Action Buttons)
- For dialogs that show **loading states** or **success states** without action buttons, center-align the content:
  ```tsx
  <DialogHeader className="items-center text-center">
  ```
- Examples: status checking spinners, success confirmations that auto-dismiss.

### Available Components
| Component | Import from |
|-----------|------------|
| `Dialog`, `DialogBody`, `DialogFooter`, `DialogFooterInfo`, `DialogClose` | `@/components/ui/Dialog` |
| `AlertDialog`, `AlertDialogBody`, `AlertDialogFooter`, `AlertDialogFooterInfo` | `@/components/ui/alert-dialog` |

## Layering & Z-Index

- **Sidebar Toggle Overlay**: Use `z-40`. This ensures it stays above the main content but below any dialogs or sheets.
- **Dialogs, Sheets, & Modals**: Use `z-50` or higher (standard Radix behavior handles this). They must remain at the top of the stack. **Top-right close (X) icons are strictly forbidden on all overlays.**

## Tables
- **Row Hover Effect**: All table rows must use `hover:bg-gray-50/50` paired with `transition-colors` for a consistent interactive feel.
- **Separators**: Use `border-border-subtle` (`border-gray-100`) for table borders and row separators to maintain the minimalist aesthetic.
- **Headers**: Table headers (`TableHeader`) should use `bg-gray-50/50` for clear structural distinction.
- **Cell Padding**: Standardize on `TableCell` padding that provides comfortable breathing room without excessive white space.
- **Table Container**: For standalone tables (like relationship or social media tables), wrap the `Table` in a `div` with `border border-border-strong rounded-xl overflow-hidden bg-white` for a consistent, card-like appearance.

## Input Units
- **Standalone form inputs**: When an input has a unit (e.g., ปี, เดือน, คน, บาท), display the unit **inside the input** on the right side using an absolutely positioned `<span>`. Add sufficient `pr-` padding to avoid text overlap. Pattern:
  ```tsx
  <div className="relative">
      <Input className="pr-12" ... />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">คน</span>
  </div>
  ```
- **Table inputs**: Do **not** include the unit inside the input. Instead, display the unit in the **table column header label** (e.g., `จำนวน (บาท)`). This keeps table cells compact and avoids redundancy.

## Number Formatting (Monetary / Numeric Inputs)
- **Always display commas** in numeric/monetary inputs. Use `type="text"` (never `type="number"`) with `formatNumberWithCommas()` on the displayed value.
- **Strip commas on save.** In the `onChange` handler, strip commas before storing: `e.target.value.replace(/,/g, "")`.
- Pattern:
  ```tsx
  <Input
    type="text"
    value={formatNumberWithCommas(item.amount)}
    onChange={(e) => handleUpdate(e.target.value.replace(/,/g, ""))}
    placeholder="0.00"
  />
  ```
- **Read-only display**: Use `formatNumberWithCommas(value)` for all numeric displays (totals, summaries, table cells).

## Select / Dropdown
- **Fixed-height dropdown list.** When a `Select` may contain many options (e.g., months, years, provinces), always set a fixed max-height on `SelectContent` with scrollable overflow to prevent the dropdown from overflowing the screen. Use `max-h-[200px] overflow-y-auto`.
  ```tsx
  <SelectContent className="max-h-[200px] overflow-y-auto">
      ...
  </SelectContent>
  ```

## Component & Pattern Consistency Check

**Before creating or modifying any UI component or pattern, you MUST perform a consistency check:**

### Workflow
1. **Identify the pattern.** Describe what you are about to build (e.g., "radio group with label", "delete confirmation dialog", "inline edit form").
2. **Search for existing usage.** Use `grep_search` to look for similar components, class patterns, or UI structures already used in the codebase. Check:
   - `src/components/ui/` for base UI primitives
   - `src/components/application/` for domain-specific components
   - `src/app/dashboard/` for page-level patterns already in use
3. **Classify the pattern:**
   - **Existing** — The exact same pattern already exists. → **Reuse it as-is.** Copy the same structure, classes, and spacing.
   - **Variant of existing** — A similar pattern exists but needs minor adaptation. → **Extend the existing pattern** rather than creating something new. Match styling (font weights, spacing, colors).
   - **New** — No matching pattern exists. → **Confirm with the user** before implementing. Explain what the new pattern is and why existing options don't fit.
4. **Report your finding.** Before writing code, briefly state:
   - What pattern you found (or didn't find)
   - Where it's used (file + line)
   - Whether you'll reuse, extend, or create new

### Key Principles
- **Reuse first.** Always prefer reusing an existing component or layout pattern over creating a new one.
- **Same component, same styling.** If multiple pages use the same form field pattern, they must use identical class names, spacing, and structure.
- **No one-off styles.** Avoid adding unique `className` combinations that only appear in one place. If a new style is needed, it likely belongs as a variant in `src/components/ui/`.
- **Ask when in doubt.** If unsure whether a pattern is new or existing, ask the user before proceeding.