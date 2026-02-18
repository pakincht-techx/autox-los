# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - 2026-02-18

### Added
- **Dashboard Header**:
    - Introduced `DashboardHeader` component for better modularity.
    - Added interactive branch information dialog showing Code, Name, District, and Region.
    - Styled branch info trigger as a distinct button for better visibility.
- **Role-Based Navigation**:
    - Implemented `allowedRoles` filtering in Sidebar for 'Maker', 'Checker', and 'Approver'.
    - Updated user profile section to display current user role.
- **Design Documentation**: Added `design-rules.md` to standardize UI patterns.

### Changed
- **UI Styling**:
    - Updated `DropdownMenu` hover colors to neutral gray (`#F3F4F6`).
    - Enhanced `Dialog` overlays with `backdrop-blur-sm` and lower opacity (`bg-black/10`).
    - Standardized border colors to `border-border-subtle` or `gray-200`.

## [Unreleased] - 2026-02-16

### Added
- **Calculator Step 4 (Customer Info)**: Introduced a new step to collect customer occupation and income details before the product suggestion.
- **Unified Interest Rate**: Set a fixed interest rate of 23.99% per year across all loan products.
- **Payment Methods**: Added "Monthly Installment" and "Balloon Payment" calculation options in the product suggestion step.
- **Chaiyo Card Bundle**: Added a dedicated section for "บัตรเงินไชโย" with specific features (revolving credit, no fees, ATM access, etc.).
- **Document Checklist**: Implemented a dynamic document checklist based on collateral type.

### Changed
- **Product Suggestion Layout**:
    - Moved "Appraisal Price" (ราคาประเมิน) to be inline with the Collateral information.
    - Moved "Interest Rate" (ดอกเบี้ย) and "LTV" to the same row as Appraisal Price for a cleaner layout.
    - Simplified the "Max Loan Amount" (วงเงินสูงสุด) section on the right.
- **Input Formatting**:
    - Added comma formatting for income and expense inputs in the Customer Info step (e.g., "50,000").
    - Updated input backgrounds to white for better readability.
- **Stepper**: Updated the calculator stepper to include 5 steps.
