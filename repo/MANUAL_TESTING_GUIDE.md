# RatePro Manual Testing Guide

This document provides comprehensive test scenarios for manually validating the RatePro pricing calculator application.

## Prerequisites

Before testing, ensure the application is running:

```bash
# Start both frontend and mock API
npm run dev & npm run server
```

- Frontend: http://localhost:5173
- API Server: http://localhost:3001

---

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

### 1.3 Pricing Factor Selection

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-1.3.1 | Select Bookkeeping > "0-50 transactions" | No additional cost added ($0 fixed impact) |
| TC-1.3.2 | Select Bookkeeping > "151-300 transactions" | $300 added to price |
| TC-1.3.3 | Select Complexity "Standard" | 1.0x multiplier (no change) |
| TC-1.3.4 | Select Complexity "Complex" | 1.5x multiplier applied to running total |
| TC-1.3.5 | Change factor selection | Price updates in real-time |

### 1.4 Add-ons Selection

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-1.4.1 | View add-ons section | Global add-ons visible (Expedited Service, Dedicated Account Manager) |
| TC-1.4.2 | Select "Expedited Service" | $100 added to total |
| TC-1.4.3 | Select multiple add-ons | All selected add-on prices summed |
| TC-1.4.4 | Deselect an add-on | Price decreases accordingly |
| TC-1.4.5 | Select Tax Preparation service | Service-specific add-ons appear (Multi-State Filing, Audit Support) |
| TC-1.4.6 | Select Bookkeeping service | Only applicable add-ons shown (not Multi-State Filing) |

### 1.5 Price Calculation & Breakdown

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-1.5.1 | Configure: Bookkeeping, 151-300 transactions, Complex, C-Corp, Expedited | Base: $500, +$300 fixed, x1.5 multiplier, x1.3 entity, +$100 add-on = $1,660 |
| TC-1.5.2 | View price breakdown | Each component listed with label and amount |
| TC-1.5.3 | Verify calculation order | Fixed impacts first, then multipliers, then entity modifier, then add-ons |

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
| TC-5.2.1 | Navigate to Admin > Factors tab | Factors grouped by service |
| TC-5.2.2 | Click "Add Factor" | Add factor dialog opens |
| TC-5.2.3 | Create factor for a service | Factor appears under correct service |
| TC-5.2.4 | Set factor as required | Required badge shown |
| TC-5.2.5 | Click on factor options count | Options management view opens |
| TC-5.2.6 | Edit factor name/description | Changes saved |
| TC-5.2.7 | Delete factor with options | Warning about cascading delete |

### 5.3 Factor Options Management

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-5.3.1 | Click "X options" on a factor | Options table displayed |
| TC-5.3.2 | Click "Add Option" | Add option dialog opens |
| TC-5.3.3 | Create option with fixed price impact ($100) | Option saved with "fixed" type |
| TC-5.3.4 | Create option with multiplier (1.5x) | Option saved with "multiplier" type |
| TC-5.3.5 | Edit option label | Changes reflected |
| TC-5.3.6 | Change price impact value | Calculator uses new value |
| TC-5.3.7 | Delete option | Option removed from list |
| TC-5.3.8 | Click "Back" | Returns to factors list |

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
| TC-7.2.1 | Configure options and click "Calculate Price" | Results panel populated |
| TC-7.2.2 | View price breakdown | Base price, each factor, entity modifier, add-ons listed |
| TC-7.2.3 | View subtotal and total | Correct calculations shown |
| TC-7.2.4 | View hidden factors section | Lists factors hidden by dependencies |
| TC-7.2.5 | Click "Reset" | All selections cleared |
| TC-7.2.6 | Missing required factor | Warning shown, calculate disabled |

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
| TC-9.2.1 | Change service base price in Admin | Calculator shows new base price |
| TC-9.2.2 | Add new factor option | Option appears in calculator |
| TC-9.2.3 | Change factor option price impact | Calculator uses new impact |
| TC-9.2.4 | Add new add-on | Add-on appears in calculator |
| TC-9.2.5 | Create dependency rule | Calculator respects dependency |

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
| TC-10.3.1 | Quote with $0 total price | Displays correctly, can be saved |
| TC-10.3.2 | Very long company name | Text truncates or wraps appropriately |
| TC-10.3.3 | Special characters in notes | Saved and displayed correctly |
| TC-10.3.4 | Quote with no add-ons | Saves without issues |
| TC-10.3.5 | Multiple line items (future) | Each item calculated independently |

---

## Test Execution Checklist

### Smoke Test (Quick Validation)
- [ ] Application loads
- [ ] Calculator works (select service, factors, see price)
- [ ] Can save a quote
- [ ] Quotes list loads
- [ ] Admin panel accessible
- [ ] PDF preview works

### Full Regression Test
- [ ] All Calculator tests (Section 1)
- [ ] All Quote Generation tests (Section 2)
- [ ] All Quote Management tests (Section 3)
- [ ] All PDF Export tests (Section 4)
- [ ] All Admin Panel tests (Section 5)
- [ ] All Dependencies tests (Section 6)
- [ ] All Test Calculator tests (Section 7)
- [ ] All Audit Trail tests (Section 8)
- [ ] All Integration tests (Section 9)
- [ ] All Error Handling tests (Section 10)

---

## Notes

- All prices in USD
- Default quote expiration: 30 days
- Quote number format: QT-YYYY-NNNN
- Supported browsers: Chrome, Firefox, Safari, Edge (latest versions)
- Mobile responsive design supported

**Last Updated:** November 29, 2025
