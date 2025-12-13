# RatePro Manual Testing Guide

This document provides comprehensive test scenarios for manually validating the RatePro pricing calculator application.

## Prerequisites

Before testing, ensure the application is running:

## 1. Calculator Interface

### 1.1 Service Selection

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-1.1.1 | Navigate to Calculator tab | Calculator page loads with service selection dropdown |
| TC-1.1.2 | Click service dropdown | All active services displayed (Bookkeeping, Payroll, Year-End Accounting, Tax Preparation, CFO Services) |
| TC-1.1.3 | Select "Bookkeeping" service | Pricing factors for Bookkeeping appear (Monthly Transactions, Complexity Level) |
| TC-1.1.4 | Change service to "Payroll" | Previous factors cleared, Payroll factors appear (Number of Employees, Pay Frequency) |
| TC-1.1.5 | Select "Tax Preparation" | Tax-specific factors appear (Return Type, Number of Schedules) |

### 1.2 Entity Type Selection

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-1.2.1 | View entity type dropdown | All entity types visible (Sole Proprietorship, LLC, S-Corporation, C-Corporation, Partnership, Non-Profit) |
| TC-1.2.2 | Select "Sole Proprietorship" | Multiplier of 1.0x applied (no change to base) |
| TC-1.2.3 | Select "C-Corporation" | Multiplier of 1.3x applied, price increases |
| TC-1.2.4 | Change entity type | Price recalculates immediately |

### 1.3 Pricing Factor Selection - Select Type

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-1.3.1 | Select Bookkeeping > "0-50 transactions" | No additional cost added (£0 fixed impact) |
| TC-1.3.2 | Select Bookkeeping > "151-300 transactions" | £300 added to price |
| TC-1.3.3 | Select Complexity "Standard" | 1.0x multiplier (no change) |
| TC-1.3.4 | Select Complexity "Complex" | 1.5x multiplier applied to running total |
| TC-1.3.5 | Change factor selection | Price updates in real-time |

### 1.3a Pricing Factor Selection - Boolean Type

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-1.3a.1 | View boolean factor (e.g., "Multi-State Filing") | Toggle/Switch control displayed (not dropdown) |
| TC-1.3a.2 | Toggle factor ON | Switch shows active state, price impact applied |
| TC-1.3a.3 | View price breakdown | Factor shows as enabled with associated cost (e.g., +£200) |
| TC-1.3a.4 | Toggle factor OFF | Switch shows inactive state, price impact removed |
| TC-1.3a.5 | Toggle multiple boolean factors | Each toggle works independently |
| TC-1.3a.6 | View disabled boolean factor (due to dependency) | Toggle is disabled/grayed out |

### 1.3b Pricing Factor Selection - Number Type (Quantity-Based)

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-1.3b.1 | View number factor (e.g., "Number of Employees") | Number input field displayed with unit label (e.g., "£5/employee") |
| TC-1.3b.2 | Enter quantity "10" | Input accepts numeric value |
| TC-1.3b.3 | View inline calculation | Shows "10 × £5 = £50" next to or below input |
| TC-1.3b.4 | View price breakdown | Shows "Number of Employees: 10 × £5/employee = £50" |
| TC-1.3b.5 | Change quantity to "25" | Calculation updates to "25 × £5 = £125", total price updates |
| TC-1.3b.6 | Enter zero "0" | Calculation shows £0, no cost added |
| TC-1.3b.7 | Enter decimal (if allowed, e.g., "10.5") | Calculation handles decimals correctly |
| TC-1.3b.8 | Clear number input | Defaults to 0 or shows validation for required field |
| TC-1.3b.9 | Enter negative number | Validation prevents negative values or defaults to 0 |
| TC-1.3b.10 | View multiple number factors | Each calculates independently (e.g., 10 employees + 100 transactions) |

### 1.4 Add-ons Selection

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-1.4.1 | View add-ons section | Global add-ons visible (Expedited Service, Dedicated Account Manager) |
| TC-1.4.2 | Select "Expedited Service" | £100 added to total |
| TC-1.4.3 | Select multiple add-ons | All selected add-on prices summed |
| TC-1.4.4 | Deselect an add-on | Price decreases accordingly |
| TC-1.4.5 | Select Tax Preparation service | Service-specific add-ons appear (Multi-State Filing, Audit Support) |
| TC-1.4.6 | Select Bookkeeping service | Only applicable add-ons shown (not Multi-State Filing) |

### 1.5 Price Calculation & Breakdown

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-1.5.1 | Configure: Bookkeeping, 151-300 transactions, Complex, C-Corp, Expedited | Base: £500, +£300 fixed, ×1.5 multiplier, ×1.3 entity, +£100 add-on = £1,660 |
| TC-1.5.2 | View price breakdown | Each component listed with label and amount in GBP (£) |
| TC-1.5.3 | Verify calculation order | Fixed impacts (including number factors) first, then multipliers, then entity modifier, then add-ons |
| TC-1.5.4 | Configure with number factor: 10 employees @ £5/employee | Base + £50 (10 × £5) + other impacts |
| TC-1.5.5 | Configure with boolean factor: Multi-State Filing ON | Fixed cost (e.g., £200) added to total |
| TC-1.5.6 | Complex example with all factor types | Select (transaction tier), Boolean (Multi-State), Number (10 employees) all calculate correctly |
| TC-1.5.7 | Verify currency formatting | All prices display as £X,XXX.XX (GBP with comma separators) |

---

## 2. Quote Generation

### 2.1 Save Quote Dialog

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-2.1.1 | Configure service and click "Save Quote" | Save Quote dialog opens |
| TC-2.1.2 | View quote summary in dialog | Service name, total price, and expiration preview shown |
| TC-2.1.3 | Leave required fields empty, click Save | Validation errors appear for Company Name, Contact Name, Email |
| TC-2.1.4 | Enter invalid email format | Email validation error displayed |
| TC-2.1.5 | Fill all required fields correctly | Save button enabled |

### 2.2 Customer Information

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-2.2.1 | Enter Company Name "Test Corp" | Field accepts input |
| TC-2.2.2 | Enter Contact Name "John Doe" | Field accepts input |
| TC-2.2.3 | Enter Email "john@test.com" | Field accepts valid email |
| TC-2.2.4 | Enter Phone "555-1234" | Field accepts phone number (optional) |
| TC-2.2.5 | Select Entity Type | Entity type dropdown works |

### 2.3 Quote Creation

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-2.3.1 | Complete form and click Save | Loading state shown, then success message |
| TC-2.3.2 | View success screen | Unique quote number displayed (format: QT-YYYY-NNNN) |
| TC-2.3.3 | Verify expiration date | Default 30 days from creation |
| TC-2.3.4 | Change expiration days to 60 | Expiration date updates accordingly |
| TC-2.3.5 | Click Done | Dialog closes |

---

## 3. Quote Management

### 3.1 Quote List View

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-3.1.1 | Navigate to Quotes tab | Quote list page loads |
| TC-3.1.2 | View quote list | All quotes displayed with number, customer, status, price, date |
| TC-3.1.3 | Search for quote by number | Matching quotes filtered |
| TC-3.1.4 | Search for customer name | Quotes for that customer shown |
| TC-3.1.5 | Filter by status "Draft" | Only draft quotes displayed |
| TC-3.1.6 | Filter by status "Sent" | Only sent quotes displayed |
| TC-3.1.7 | Sort by price ascending | Lowest price first |
| TC-3.1.8 | Sort by date descending | Newest quotes first |
| TC-3.1.9 | Clear filters | All quotes shown again |

### 3.2 Quote Detail View

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-3.2.1 | Click on a quote | Quote detail page opens |
| TC-3.2.2 | View quote header | Quote number, status badge, creation date shown |
| TC-3.2.3 | View customer info section | Company, contact, email, phone displayed |
| TC-3.2.4 | View quote details | Total price, expiration date, entity type shown |
| TC-3.2.5 | View line items | Service name, base price, factors, add-ons, calculated price |
| TC-3.2.6 | Click "Back to Quotes" | Returns to quote list |

### 3.3 Status Management

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-3.3.1 | Click "Update Status" button | Status dialog opens |
| TC-3.3.2 | View status options | Draft, Sent, Approved, Rejected available |
| TC-3.3.3 | Change status to "Sent" | Status updates, badge changes |
| TC-3.3.4 | Change status to "Approved" | Green badge displayed |
| TC-3.3.5 | Change status to "Rejected" | Red/destructive badge displayed |

### 3.4 Quote Versioning

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-3.4.1 | On a "Sent" quote, click "Create Version" | Confirmation dialog appears |
| TC-3.4.2 | Confirm version creation | New quote created with "-v2" suffix |
| TC-3.4.3 | View new version | Status is "Draft", all line items copied |
| TC-3.4.4 | Original quote unchanged | Original quote still shows "Sent" status |

### 3.5 Expiration Handling

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-3.5.1 | View quote with past expiration date | "Expired" indicator shown |
| TC-3.5.2 | Expired draft quote | Status shows as "Expired" |
| TC-3.5.3 | Expiration warning styling | Red text/icon for expired dates |

### 3.6 Quote Editing

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-3.6.1 | View draft quote detail | "Edit" button visible and enabled |
| TC-3.6.2 | View sent/approved quote detail | "Edit" button hidden or disabled (only versioning allowed) |
| TC-3.6.3 | Click "Edit" on draft quote | Navigates to Calculator with "Editing Quote [number]" indicator |
| TC-3.6.4 | View pre-filled calculator | Service, entity type, all factors, add-ons, customer info restored |
| TC-3.6.5 | View select factor in edit mode | Correct option pre-selected from quote |
| TC-3.6.6 | View boolean factor in edit mode | Toggle shows correct ON/OFF state from quote |
| TC-3.6.7 | View number factor in edit mode | Quantity value pre-filled in number input |
| TC-3.6.8 | Change service in edit mode | New service factors load, warning if data will be lost |
| TC-3.6.9 | Modify factor selections | Price recalculates in real-time |
| TC-3.6.10 | Change number factor quantity (e.g., 10 to 25) | Calculation updates: 25 × £5 = £125 |
| TC-3.6.11 | Toggle boolean factor OFF | Price impact removed from total |
| TC-3.6.12 | Add/remove add-ons | Changes reflected in price |
| TC-3.6.13 | Update customer information | Fields accept changes |
| TC-3.6.14 | Click "Cancel" in edit mode | Confirmation dialog asks to discard changes |
| TC-3.6.15 | Confirm cancel | Returns to quote detail, no changes saved |
| TC-3.6.16 | Click "Save Quote" in edit mode | Existing quote updated (same quote number) |
| TC-3.6.17 | View updated quote detail | All changes reflected, quote number unchanged |
| TC-3.6.18 | Verify quote list | Updated total price shown |
| TC-3.6.19 | Edit quote multiple times | Each save updates the same quote record |
| TC-3.6.20 | Check audit log after edit | Edit action logged with changes |

---

## 4. PDF Export

### 4.1 Quote Preview

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-4.1.1 | In quote detail, click "Preview PDF" | Preview dialog opens |
| TC-4.1.2 | View preview header | RatePro branding, quote number, date, status shown |
| TC-4.1.3 | View customer section | Customer info displayed correctly |
| TC-4.1.4 | View line items table | Service, base price, total columns |
| TC-4.1.5 | View factor details | Selected factors shown under each line item |
| TC-4.1.6 | View add-ons | Selected add-ons listed |
| TC-4.1.7 | View total section | Grand total prominently displayed |
| TC-4.1.8 | View footer | Validity date and disclaimer text |

### 4.2 PDF Download

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-4.2.1 | Click "Download PDF" button | Loading state shown |
| TC-4.2.2 | PDF generation completes | File downloads automatically |
| TC-4.2.3 | Open downloaded PDF | Matches preview layout |
| TC-4.2.4 | Verify filename | Named as "{quote_number}.pdf" |
| TC-4.2.5 | PDF contains all data | Customer info, line items, pricing breakdown, totals |

---

## 5. Admin Panel

### 5.1 Services Management

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-5.1.1 | Navigate to Admin > Services tab | Services table displayed |
| TC-5.1.2 | Click "Add Service" | Add service dialog opens |
| TC-5.1.3 | Create service with name, description, base price | Service added to list |
| TC-5.1.4 | Edit existing service | Edit dialog with pre-filled data |
| TC-5.1.5 | Update service base price | Price saved, reflected in calculator |
| TC-5.1.6 | Toggle service active status | Service enabled/disabled |
| TC-5.1.7 | Delete service | Confirmation prompt, service removed |

### 5.2 Pricing Factors Management

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-5.2.1 | Navigate to Admin > Factors tab | Factors grouped by service, service filter dropdown visible |
| TC-5.2.2 | View service filter dropdown | Shows "All Services" + list of all services |
| TC-5.2.3 | Select "All Services" | All pricing factors displayed |
| TC-5.2.4 | Select specific service (e.g., "Bookkeeping") | Only factors for Bookkeeping shown |
| TC-5.2.5 | Switch between services in filter | Table updates to show only selected service's factors |
| TC-5.2.6 | Navigate to another Admin tab and back | Service filter selection persists (localStorage) |
| TC-5.2.7 | Click "Add Factor" | Add factor dialog opens |
| TC-5.2.8 | View factor type dropdown | Options: Select, Boolean, Number |
| TC-5.2.9 | Create Select-type factor | Factor type saved, options management required |
| TC-5.2.10 | Create Boolean-type factor | Factor type saved, single "Enabled" option created |
| TC-5.2.11 | Create Number-type factor | Factor type saved, unit_price and unit_label fields appear |
| TC-5.2.12 | Set factor as required | Required badge shown |
| TC-5.2.13 | Click on factor options count | Options management view opens |
| TC-5.2.14 | Edit factor name/description | Changes saved |
| TC-5.2.15 | Delete factor with options | Warning about cascading delete |

### 5.2a Number Factor Configuration

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-5.2a.1 | Create/edit Number-type factor | Unit Price and Unit Label fields visible |
| TC-5.2a.2 | Leave unit price empty or £0 | Factor saved but no quantity pricing (behaves as simple number input) |
| TC-5.2a.3 | Set unit price to £25 | Price saved correctly |
| TC-5.2a.4 | Set unit label to "hour" | Label saved (e.g., displayed as "£25/hour") |
| TC-5.2a.5 | Set unit label to "employee" | Label saved (e.g., displayed as "£5/employee") |
| TC-5.2a.6 | Leave unit label empty | Factor works but shows generic label (e.g., "£25/unit") |
| TC-5.2a.7 | Update unit price from £5 to £10 | Calculator immediately uses new unit price |
| TC-5.2a.8 | View number factor in factors table | Displays "£X/[unit_label]" in table (e.g., "£25/hour") |
| TC-5.2a.9 | Number factor with unit price in calculator | Shows "£X/[unit]" label next to number input |
| TC-5.2a.10 | Test Calculator with number factor | Quantity × unit_price calculation works |

### 5.3 Factor Options Management

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-5.3.1 | Click "X options" on a Select-type factor | Options table displayed |
| TC-5.3.2 | Click "Add Option" | Add option dialog opens |
| TC-5.3.3 | Create option with fixed price impact (£100) | Option saved with "fixed" type |
| TC-5.3.4 | Create option with percentage impact (10%) | Option saved with "percentage" type |
| TC-5.3.5 | Create option with multiplier (1.5x) | Option saved with "multiplier" type |
| TC-5.3.6 | Edit option label | Changes reflected in calculator dropdown |
| TC-5.3.7 | Change price impact value | Calculator uses new value immediately |
| TC-5.3.8 | Delete option | Option removed from list and calculator |
| TC-5.3.9 | Click "Back" | Returns to factors list |
| TC-5.3.10 | View Boolean-type factor options | Shows single "Enabled" option with fixed price impact |
| TC-5.3.11 | Edit Boolean factor "Enabled" option price | Price impact updates (e.g., change from £200 to £250) |
| TC-5.3.12 | View Number-type factor options | Shows "Unit" option with unit_price as price_impact |
| TC-5.3.13 | Edit Number factor "Unit" option | Updates unit_price (automatically synced) |

### 5.4 Entity Types Management

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-5.4.1 | Navigate to Admin > Entities tab | Entity types table displayed |
| TC-5.4.2 | Add new entity type | Entity created with name and modifier |
| TC-5.4.3 | Set price modifier to 1.25 | Multiplier saved |
| TC-5.4.4 | Edit entity type | Changes saved |
| TC-5.4.5 | Delete entity type | Entity removed |

### 5.5 Add-ons Management

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-5.5.1 | Navigate to Admin > Add-ons tab | Add-ons table displayed |
| TC-5.5.2 | View global add-ons | "Global" badge shown |
| TC-5.5.3 | View service-specific add-ons | Associated services listed |
| TC-5.5.4 | Create global add-on | Available for all services in calculator |
| TC-5.5.5 | Create service-specific add-on | Only appears for selected services |
| TC-5.5.6 | Edit add-on price | New price used in calculations |
| TC-5.5.7 | Delete add-on | Add-on removed |

---

## 6. Factor Dependencies

### 6.1 Dependencies Management

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-6.1.1 | Navigate to Admin > Dependencies tab | Dependencies list displayed |
| TC-6.1.2 | View existing dependency | Shows dependent factor, parent factor, condition |
| TC-6.1.3 | Click "Add Dependency" | Add dependency dialog opens |
| TC-6.1.4 | Select service | Factors filtered to selected service |
| TC-6.1.5 | Select dependent factor and parent factor | Both dropdowns work |
| TC-6.1.6 | Select condition type "When specific options selected" | Option checkboxes appear |
| TC-6.1.7 | Select triggering options | Options saved with dependency |
| TC-6.1.8 | Save valid dependency | Dependency created, no errors |
| TC-6.1.9 | Edit existing dependency | Changes saved |
| TC-6.1.10 | Delete dependency | Dependency removed |

### 6.2 Circular Dependency Detection

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-6.2.1 | Try to create A depends on B, then B depends on A | Error: circular dependency detected |
| TC-6.2.2 | Try to create self-dependency (A depends on A) | Error: cannot depend on itself |
| TC-6.2.3 | Try cross-service dependency | Error: factors must be same service |
| TC-6.2.4 | View dependency with circular issue | Warning banner displayed |
| TC-6.2.5 | Valid dependency chain (A -> B -> C) | No circular dependency warning |

### 6.3 Dependency Behavior in Calculator

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-6.3.1 | Select Tax Preparation service | "Return Type" factor visible |
| TC-6.3.2 | "Number of Schedules" initially hidden | Dependent on Return Type selection |
| TC-6.3.3 | Select "Individual (1040)" return type | "Number of Schedules" remains hidden (not applicable) |
| TC-6.3.4 | Select "S-Corp (1120S)" return type | "Number of Schedules" becomes visible |
| TC-6.3.5 | Change back to "Individual" | "Number of Schedules" hides, value resets |

---

## 7. Test Calculator

### 7.1 Test Calculator Interface

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-7.1.1 | Navigate to Admin > Test tab | Test Calculator interface loads |
| TC-7.1.2 | Select a service | Pricing factors appear |
| TC-7.1.3 | Select entity type | Entity modifier shown |
| TC-7.1.4 | Select factor options | Options selectable |
| TC-7.1.5 | Select add-ons | Add-ons checkboxes work |
| TC-7.1.6 | View hidden factors info | Shows which factors are hidden by dependencies |

### 7.2 Test Calculation

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-7.2.1 | Configure options and click "Calculate Price" | Results panel populated with GBP (£) amounts |
| TC-7.2.2 | View price breakdown | Base price, each factor (Select/Boolean/Number), entity modifier, add-ons listed |
| TC-7.2.3 | Test with Select factor | Dropdown selection applied correctly in breakdown |
| TC-7.2.4 | Test with Boolean factor ON | Toggle enabled, fixed cost added (e.g., +£200) |
| TC-7.2.5 | Test with Boolean factor OFF | Toggle disabled, no cost added |
| TC-7.2.6 | Test with Number factor (e.g., 10 units @ £5/unit) | Shows "10 × £5 = £50" in breakdown |
| TC-7.2.7 | Test with all three factor types together | All calculate correctly: Select (tier), Boolean (toggle), Number (quantity) |
| TC-7.2.8 | View subtotal and total | Correct calculations shown in GBP |
| TC-7.2.9 | View hidden factors section | Lists factors hidden by dependencies |
| TC-7.2.10 | Change number factor quantity (e.g., 10 to 20) | Breakdown updates: "20 × £5 = £100" |
| TC-7.2.11 | Click "Reset" | All selections cleared (dropdowns, toggles, number inputs) |
| TC-7.2.12 | Missing required factor | Warning shown, calculate disabled |

---

## 8. Audit Trail

### 8.1 Audit Log Viewer

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-8.1.1 | Navigate to Admin > Audit tab | Audit log table displayed |
| TC-8.1.2 | View log entries | Timestamp, entity, action, changes shown |
| TC-8.1.3 | Filter by entity type "Quote" | Only quote-related logs shown |
| TC-8.1.4 | Filter by action "Created" | Only creation logs shown |
| TC-8.1.5 | Filter by action "Status Changed" | Only status change logs shown |
| TC-8.1.6 | Clear filters | All logs displayed |
| TC-8.1.7 | Click refresh button | Logs reloaded |

### 8.2 Audit Log Details

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-8.2.1 | Click view icon on a log entry | Details dialog opens |
| TC-8.2.2 | View entity information | Entity type and ID shown |
| TC-8.2.3 | View action and timestamp | Formatted date/time displayed |
| TC-8.2.4 | View changes for "Created" action | New values shown |
| TC-8.2.5 | View changes for "Status Changed" | From/to values with visual diff |
| TC-8.2.6 | View changes for "Version Created" | Parent quote reference shown |

### 8.3 Audit Log Creation

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-8.3.1 | Create a new quote | Audit entry created with action "created" |
| TC-8.3.2 | Change quote status | Audit entry with action "status_changed" |
| TC-8.3.3 | Create quote version | Audit entry with action "version_created" |
| TC-8.3.4 | Verify timestamp | Current time recorded |
| TC-8.3.5 | Verify changes captured | Relevant field changes logged |

---

## 9. Cross-Feature Integration

### 9.1 End-to-End Quote Flow

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-9.1.1 | Create quote from calculator | Quote saved with all details |
| TC-9.1.2 | Find quote in Quotes list | Quote appears in list |
| TC-9.1.3 | Open quote detail | All information matches |
| TC-9.1.4 | Preview PDF | PDF shows correct data |
| TC-9.1.5 | Download PDF | File downloads correctly |
| TC-9.1.6 | Change status to "Sent" | Status updated, audit logged |
| TC-9.1.7 | Create new version | Version created, audit logged |
| TC-9.1.8 | View audit trail | All actions recorded |

### 9.2 Admin Changes Reflect in Calculator

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-9.2.1 | Change service base price in Admin | Calculator shows new base price in GBP |
| TC-9.2.2 | Add new Select factor with options | Factor dropdown appears in calculator |
| TC-9.2.3 | Add new Boolean factor | Toggle/switch appears in calculator |
| TC-9.2.4 | Add new Number factor with unit price | Number input with unit label appears (e.g., "£5/employee") |
| TC-9.2.5 | Change factor option price impact | Calculator uses new impact immediately |
| TC-9.2.6 | Update number factor unit price (£5 to £10) | Calculator shows new rate: "10 × £10 = £100" |
| TC-9.2.7 | Add new add-on | Add-on appears in calculator with £ price |
| TC-9.2.8 | Create dependency rule | Calculator respects dependency (hides/shows factors) |
| TC-9.2.9 | Change Boolean factor price impact | Toggle ON applies new price |

### 9.3 Factor Type Integration Tests

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-9.3.1 | Create quote with all factor types | Quote saves with Select, Boolean, Number factor values |
| TC-9.3.2 | View saved quote with number factors | Displays "10 × £5/employee = £50" in quote detail |
| TC-9.3.3 | View saved quote with boolean factors | Shows which boolean factors were enabled |
| TC-9.3.4 | PDF export with number factors | PDF shows quantity calculations correctly |
| TC-9.3.5 | Edit quote with number factor | Pre-fills quantity value, allows changes |
| TC-9.3.6 | Edit quote, change boolean from ON to OFF | Price recalculates, impact removed |
| TC-9.3.7 | Audit log for number factor changes | Shows old quantity vs new quantity |
| TC-9.3.8 | Test Calculator with all factor types | All three types calculate together correctly |

---

## 10. Error Handling & Edge Cases

### 10.1 Form Validation

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-10.1.1 | Submit empty customer form | All required field errors shown |
| TC-10.1.2 | Enter invalid email | Email format error |
| TC-10.1.3 | Enter negative price in admin | Validation prevents save |
| TC-10.1.4 | Enter duplicate service name | Handled gracefully |

### 10.2 Network Errors

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-10.2.1 | Stop API server, try to load quotes | Error message displayed with retry option |
| TC-10.2.2 | Stop API server, try to save quote | Error message shown |
| TC-10.2.3 | Restart API server, click retry | Data loads successfully |

### 10.3 Data Edge Cases

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-10.3.1 | Quote with £0 total price | Displays correctly, can be saved |
| TC-10.3.2 | Very long company name | Text truncates or wraps appropriately |
| TC-10.3.3 | Special characters in notes | Saved and displayed correctly |
| TC-10.3.4 | Quote with no add-ons | Saves without issues |
| TC-10.3.5 | Multiple line items (future) | Each item calculated independently |
| TC-10.3.6 | Number factor with very large quantity (e.g., 10,000) | Calculation handles large numbers: 10,000 × £5 = £50,000 |
| TC-10.3.7 | Number factor with decimal quantity (e.g., 2.5) | If allowed, calculates: 2.5 × £20 = £50 |
| TC-10.3.8 | Boolean factor toggled multiple times | Price updates correctly each time |
| TC-10.3.9 | Mix of all factor types with dependencies | Complex scenario calculates correctly |
| TC-10.3.10 | Number factor with £0 unit price | No cost added regardless of quantity |

---

## Test Execution Checklist

### Smoke Test (Quick Validation)
- [ ] Application loads
- [ ] Calculator works (select service, factors, see price in GBP)
- [ ] All three factor types render (Select dropdown, Boolean toggle, Number input)
- [ ] Number factor shows quantity calculation (e.g., "10 × £5 = £50")
- [ ] Can save a quote
- [ ] Can edit a draft quote
- [ ] Quotes list loads
- [ ] Admin panel accessible with service filter
- [ ] PDF preview works with £ symbols

### Factor Types Quick Test
- [ ] Select factor: Dropdown works, price updates
- [ ] Boolean factor: Toggle ON/OFF works, price changes
- [ ] Number factor: Enter quantity, see calculation (quantity × £unit_price)
- [ ] All three types together: Create quote with mixed factor types

### Full Regression Test
- [ ] All Calculator tests (Section 1)
  - [ ] Service Selection (1.1)
  - [ ] Entity Type Selection (1.2)
  - [ ] Select-type factors (1.3)
  - [ ] Boolean-type factors (1.3a)
  - [ ] Number-type factors (1.3b)
  - [ ] Add-ons Selection (1.4)
  - [ ] Price Calculation & Breakdown (1.5)
- [ ] All Quote Generation tests (Section 2)
- [ ] All Quote Management tests (Section 3)
  - [ ] Includes Quote Editing tests (3.6)
- [ ] All PDF Export tests (Section 4)
- [ ] All Admin Panel tests (Section 5)
  - [ ] Services Management (5.1)
  - [ ] Pricing Factors with service filter (5.2)
  - [ ] Number Factor Configuration (5.2a)
  - [ ] Factor Options Management (5.3)
  - [ ] Entity Types (5.4)
  - [ ] Add-ons (5.5)
- [ ] All Dependencies tests (Section 6)
- [ ] All Test Calculator tests (Section 7)
- [ ] All Audit Trail tests (Section 8)
- [ ] All Integration tests (Section 9)
  - [ ] Includes Factor Type Integration (9.3)
- [ ] All Error Handling tests (Section 10)

---

## Notes

### Currency and Formatting
- **All prices in GBP (£)** using en-GB locale formatting
- Currency format: £X,XXX.XX (e.g., £1,234.56)

### Quote Settings
- Default quote expiration: 30 days
- Quote number format: QT-YYYY-NNNN
- Draft quotes can be edited; Sent quotes require versioning

### Pricing Factor Types
- **Select**: Dropdown with predefined options (transaction tiers, complexity levels)
- **Boolean**: Toggle/Switch for yes/no features (Multi-State Filing, Audit Support)
- **Number**: Numeric input for quantity-based pricing with unit prices (employees, hours, transactions)

### Technical Requirements
- Supported browsers: Chrome, Firefox, Safari, Edge (latest versions)
- Mobile responsive design supported
- LocalStorage used for Admin Panel filter persistence

**Last Updated:** December 10, 2025
