import { RateCard, PricingConfiguration, CalculationHistory } from '../hooks/useDatabase';

interface InitialData {
  rateCards: RateCard[];
  pricingConfigurations: PricingConfiguration[];
  calculationHistory: CalculationHistory[];
}

export const initialData: InitialData = {
  "rateCards": [
    {
      "rate_id": "RC001",
      "rate_name": "FRS 105 Base Fee",
      "unit_of_measurement": "Per File",
      "rate_per_unit": 275.00,
      "service_type": "Year-End",
      "active": true
    },
    {
      "rate_id": "RC002",
      "rate_name": "Sole Trader Base Fee",
      "unit_of_measurement": "Per File",
      "rate_per_unit": 150.00,
      "service_type": "Year-End",
      "active": true
    },
    {
      "rate_id": "RC003",
      "rate_name": "Partnership Base Fee",
      "unit_of_measurement": "Per File",
      "rate_per_unit": 225.00,
      "service_type": "Year-End",
      "active": true
    },
    {
      "rate_id": "RC004",
      "rate_name": "VAT Return Add-on",
      "unit_of_measurement": "Per Return",
      "rate_per_unit": 50.00,
      "service_type": "Year-End",
      "active": true
    },
    {
      "rate_id": "RC005",
      "rate_name": "Spreadsheet Records Fee",
      "unit_of_measurement": "Per File",
      "rate_per_unit": 75.00,
      "service_type": "Year-End",
      "active": true
    },
    {
      "rate_id": "RC006",
      "rate_name": "Cloud Accounting Discount",
      "unit_of_measurement": "Per File",
      "rate_per_unit": -25.00,
      "service_type": "Year-End",
      "active": true
    },
    {
      "rate_id": "RC007",
      "rate_name": "Bookkeeping Base Rate",
      "unit_of_measurement": "Per Transaction",
      "rate_per_unit": 0.50,
      "service_type": "Bookkeeping",
      "active": true
    },
    {
      "rate_id": "RC008",
      "rate_name": "Bookkeeping Monthly Minimum",
      "unit_of_measurement": "Per Month",
      "rate_per_unit": 100.00,
      "service_type": "Bookkeeping",
      "active": true
    },
    {
      "rate_id": "RC009",
      "rate_name": "Payroll Per Employee",
      "unit_of_measurement": "Per Employee",
      "rate_per_unit": 15.00,
      "service_type": "Payroll",
      "active": true
    },
    {
      "rate_id": "RC010",
      "rate_name": "Payroll Base Fee",
      "unit_of_measurement": "Per Month",
      "rate_per_unit": 50.00,
      "service_type": "Payroll",
      "active": true
    },
    {
      "rate_id": "RC011",
      "rate_name": "Tax Return Personal",
      "unit_of_measurement": "Per Return",
      "rate_per_unit": 200.00,
      "service_type": "Tax",
      "active": true
    },
    {
      "rate_id": "RC012",
      "rate_name": "Tax Return Complex",
      "unit_of_measurement": "Per Return",
      "rate_per_unit": 350.00,
      "service_type": "Tax",
      "active": true
    },
    {
      "rate_id": "RC013",
      "rate_name": "High Transaction Volume Fee",
      "unit_of_measurement": "Per File",
      "rate_per_unit": 100.00,
      "service_type": "Bookkeeping",
      "active": true
    },
    {
      "rate_id": "RC014",
      "rate_name": "FRS 102 Base Fee",
      "unit_of_measurement": "Per File",
      "rate_per_unit": 450.00,
      "service_type": "Year-End",
      "active": true
    },
    {
      "rate_id": "RC015",
      "rate_name": "Paper Records Surcharge",
      "unit_of_measurement": "Per File",
      "rate_per_unit": 125.00,
      "service_type": "Year-End",
      "active": true
    },
    {
      "rate_id": "RC016",
      "rate_name": "Annual Accounts Filing",
      "unit_of_measurement": "Per Filing",
      "rate_per_unit": 75.00,
      "service_type": "Year-End",
      "active": true
    },
    {
      "rate_id": "RC017",
      "rate_name": "Confirmation Statement",
      "unit_of_measurement": "Per Statement",
      "rate_per_unit": 40.00,
      "service_type": "Year-End",
      "active": true
    },
    {
      "rate_id": "RC018",
      "rate_name": "Management Accounts Addon",
      "unit_of_measurement": "Per Set",
      "rate_per_unit": 85.00,
      "service_type": "Bookkeeping",
      "active": true
    },
    {
      "rate_id": "RC019",
      "rate_name": "Reconciliation Service",
      "unit_of_measurement": "Per Account",
      "rate_per_unit": 25.00,
      "service_type": "Bookkeeping",
      "active": true
    },
    {
      "rate_id": "RC020",
      "rate_name": "Expense Processing",
      "unit_of_measurement": "Per Transaction",
      "rate_per_unit": 0.75,
      "service_type": "Bookkeeping",
      "active": true
    },
    {
      "rate_id": "RC021",
      "rate_name": "Quarterly VAT Returns",
      "unit_of_measurement": "Per Quarter",
      "rate_per_unit": 60.00,
      "service_type": "Bookkeeping",
      "active": true
    },
    {
      "rate_id": "RC022",
      "rate_name": "Auto-Enrolment Pension Setup",
      "unit_of_measurement": "One-time",
      "rate_per_unit": 150.00,
      "service_type": "Payroll",
      "active": true
    },
    {
      "rate_id": "RC023",
      "rate_name": "Pension Administration",
      "unit_of_measurement": "Per Employee",
      "rate_per_unit": 5.00,
      "service_type": "Payroll",
      "active": true
    },
    {
      "rate_id": "RC024",
      "rate_name": "P11D Filing",
      "unit_of_measurement": "Per Employee",
      "rate_per_unit": 35.00,
      "service_type": "Payroll",
      "active": true
    },
    {
      "rate_id": "RC025",
      "rate_name": "Year-End Payroll Reporting",
      "unit_of_measurement": "Per Run",
      "rate_per_unit": 100.00,
      "service_type": "Payroll",
      "active": true
    },
    {
      "rate_id": "RC026",
      "rate_name": "Corporate Tax Return",
      "unit_of_measurement": "Per Return",
      "rate_per_unit": 400.00,
      "service_type": "Tax",
      "active": true
    },
    {
      "rate_id": "RC027",
      "rate_name": "Capital Gains Tax Computation",
      "unit_of_measurement": "Per Computation",
      "rate_per_unit": 150.00,
      "service_type": "Tax",
      "active": true
    },
    {
      "rate_id": "RC028",
      "rate_name": "Tax Planning Consultation",
      "unit_of_measurement": "Per Hour",
      "rate_per_unit": 125.00,
      "service_type": "Tax",
      "active": true
    },
    {
      "rate_id": "RC029",
      "rate_name": "R&D Tax Credit Application",
      "unit_of_measurement": "Per Application",
      "rate_per_unit": 750.00,
      "service_type": "Tax",
      "active": true
    },
    {
      "rate_id": "RC030",
      "rate_name": "CIS Tax Return",
      "unit_of_measurement": "Per Return",
      "rate_per_unit": 180.00,
      "service_type": "Tax",
      "active": true
    },
    {
      "rate_id": "RC031",
      "rate_name": "Multi-Location Discount",
      "unit_of_measurement": "Percentage",
      "rate_per_unit": -10.00,
      "service_type": "Bookkeeping",
      "active": true
    },
    {
      "rate_id": "RC032",
      "rate_name": "Rush Service Premium",
      "unit_of_measurement": "Percentage",
      "rate_per_unit": 25.00,
      "service_type": "Year-End",
      "active": false
    },
    {
      "rate_id": "RC033",
      "rate_name": "Annual Subscription Discount",
      "unit_of_measurement": "Percentage",
      "rate_per_unit": -15.00,
      "service_type": "Bookkeeping",
      "active": true
    }
  ],
  "pricingConfigurations": [
    {
      "config_id": "CF001",
      "service_type": "Year-End",
      "factor_name": "Business Structure",
      "factor_options": ["Sole Trader", "Partnership", "Ltd Co (FRS 105)", "Ltd Co (FRS 102)"],
      "base_rate_id": "RC002",
      "add_on_rate_ids": "",
      "multiplier": 1.0,
      "display_order": 1,
      "active": true
    },
    {
      "config_id": "CF002",
      "service_type": "Year-End",
      "factor_name": "VAT Registered",
      "factor_options": ["Yes", "No"],
      "base_rate_id": "",
      "add_on_rate_ids": "RC004",
      "multiplier": 1.0,
      "display_order": 2,
      "active": true
    },
    {
      "config_id": "CF003",
      "service_type": "Year-End",
      "factor_name": "Record Type",
      "factor_options": ["Cloud Accounting (Xero/QBO)", "Spreadsheet", "Paper Records"],
      "base_rate_id": "",
      "add_on_rate_ids": "RC005,RC006",
      "multiplier": 1.0,
      "display_order": 3,
      "active": true
    },
    {
      "config_id": "CF004",
      "service_type": "Bookkeeping",
      "factor_name": "Monthly Transactions",
      "factor_options": ["0-100", "101-200", "201-500", "500+"],
      "base_rate_id": "RC007",
      "add_on_rate_ids": "RC008",
      "multiplier": 1.0,
      "display_order": 1,
      "active": true
    },
    {
      "config_id": "CF005",
      "service_type": "Bookkeeping",
      "factor_name": "High Volume",
      "factor_options": ["Yes", "No"],
      "base_rate_id": "",
      "add_on_rate_ids": "RC013",
      "multiplier": 1.0,
      "display_order": 2,
      "active": true
    },
    {
      "config_id": "CF006",
      "service_type": "Payroll",
      "factor_name": "Number of Employees",
      "factor_options": ["1-5", "6-10", "11-20", "20+"],
      "base_rate_id": "RC010",
      "add_on_rate_ids": "RC009",
      "multiplier": 1.0,
      "display_order": 1,
      "active": true
    },
    {
      "config_id": "CF007",
      "service_type": "Tax",
      "factor_name": "Return Type",
      "factor_options": ["Personal", "Complex (Multiple Income Sources)", "Corporate"],
      "base_rate_id": "RC011",
      "add_on_rate_ids": "",
      "multiplier": 1.0,
      "display_order": 1,
      "active": true
    },
    {
      "config_id": "CF008",
      "service_type": "Year-End",
      "factor_name": "Company Filings",
      "factor_options": ["Accounts + Confirmation Statement", "Accounts Only", "None"],
      "base_rate_id": "",
      "add_on_rate_ids": "RC016,RC017",
      "multiplier": 1.0,
      "display_order": 4,
      "active": true
    },
    {
      "config_id": "CF009",
      "service_type": "Bookkeeping",
      "factor_name": "Additional Services",
      "factor_options": ["Management Accounts", "VAT Returns", "Both", "None"],
      "base_rate_id": "",
      "add_on_rate_ids": "RC018,RC021",
      "multiplier": 1.0,
      "display_order": 3,
      "active": true
    },
    {
      "config_id": "CF010",
      "service_type": "Bookkeeping",
      "factor_name": "Account Reconciliations",
      "factor_options": ["1-3 accounts", "4-6 accounts", "7+ accounts", "None"],
      "base_rate_id": "",
      "add_on_rate_ids": "RC019",
      "multiplier": 1.0,
      "display_order": 4,
      "active": true
    },
    {
      "config_id": "CF011",
      "service_type": "Payroll",
      "factor_name": "Pension Administration",
      "factor_options": ["Yes", "No"],
      "base_rate_id": "",
      "add_on_rate_ids": "RC023",
      "multiplier": 1.0,
      "display_order": 2,
      "active": true
    },
    {
      "config_id": "CF012",
      "service_type": "Payroll",
      "factor_name": "Frequency",
      "factor_options": ["Weekly", "Fortnightly", "Monthly"],
      "base_rate_id": "",
      "add_on_rate_ids": "",
      "multiplier": 1.0,
      "display_order": 3,
      "active": true
    },
    {
      "config_id": "CF013",
      "service_type": "Tax",
      "factor_name": "Additional Tax Services",
      "factor_options": ["Capital Gains", "CIS Return", "Both", "None"],
      "base_rate_id": "",
      "add_on_rate_ids": "RC027,RC030",
      "multiplier": 1.0,
      "display_order": 2,
      "active": true
    },
    {
      "config_id": "CF014",
      "service_type": "Tax",
      "factor_name": "Tax Planning Required",
      "factor_options": ["Yes (1-2 hours)", "Yes (3-5 hours)", "No"],
      "base_rate_id": "",
      "add_on_rate_ids": "RC028",
      "multiplier": 1.0,
      "display_order": 3,
      "active": true
    },
    {
      "config_id": "CF015",
      "service_type": "Bookkeeping",
      "factor_name": "Subscription Type",
      "factor_options": ["Monthly", "Annual (15% discount)"],
      "base_rate_id": "",
      "add_on_rate_ids": "RC033",
      "multiplier": 1.0,
      "display_order": 5,
      "active": true
    }
  ],
  "calculationHistory": [
    {
      "id": "calc_001",
      "timestamp": "2025-11-04T14:30:00Z",
      "service_type": "Year-End",
      "inputs": {
        "Business Structure": "Ltd Co (FRS 105)",
        "VAT Registered": "Yes",
        "Record Type": "Cloud Accounting (Xero/QBO)",
        "Company Filings": "Accounts + Confirmation Statement"
      },
      "calculation_breakdown": [
        {
          "rate_id": "RC001",
          "rate_name": "FRS 105 Base Fee",
          "unit_price": 275.00,
          "quantity": 1,
          "total": 275.00
        },
        {
          "rate_id": "RC004",
          "rate_name": "VAT Return Add-on",
          "unit_price": 50.00,
          "quantity": 1,
          "total": 50.00
        },
        {
          "rate_id": "RC006",
          "rate_name": "Cloud Accounting Discount",
          "unit_price": -25.00,
          "quantity": 1,
          "total": -25.00
        },
        {
          "rate_id": "RC016",
          "rate_name": "Annual Accounts Filing",
          "unit_price": 75.00,
          "quantity": 1,
          "total": 75.00
        },
        {
          "rate_id": "RC017",
          "rate_name": "Confirmation Statement",
          "unit_price": 40.00,
          "quantity": 1,
          "total": 40.00
        }
      ],
      "total_price": 415.00,
      "currency": "GBP",
      "accountant_name": "Sarah Thompson",
      "client_reference": "Client-ABC-001"
    },
    {
      "id": "calc_002",
      "timestamp": "2025-11-03T10:15:00Z",
      "service_type": "Bookkeeping",
      "inputs": {
        "Monthly Transactions": "201-500",
        "High Volume": "No",
        "Additional Services": "Both",
        "Account Reconciliations": "4-6 accounts",
        "Subscription Type": "Annual (15% discount)"
      },
      "calculation_breakdown": [
        {
          "rate_id": "RC007",
          "rate_name": "Bookkeeping Base Rate",
          "unit_price": 0.50,
          "quantity": 350,
          "total": 175.00
        },
        {
          "rate_id": "RC008",
          "rate_name": "Bookkeeping Monthly Minimum",
          "unit_price": 100.00,
          "quantity": 1,
          "total": 100.00
        },
        {
          "rate_id": "RC018",
          "rate_name": "Management Accounts Addon",
          "unit_price": 85.00,
          "quantity": 1,
          "total": 85.00
        },
        {
          "rate_id": "RC021",
          "rate_name": "Quarterly VAT Returns",
          "unit_price": 60.00,
          "quantity": 1,
          "total": 60.00
        },
        {
          "rate_id": "RC019",
          "rate_name": "Reconciliation Service",
          "unit_price": 25.00,
          "quantity": 5,
          "total": 125.00
        },
        {
          "rate_id": "RC033",
          "rate_name": "Annual Subscription Discount",
          "unit_price": -81.75,
          "quantity": 1,
          "total": -81.75
        }
      ],
      "total_price": 463.25,
      "currency": "GBP",
      "accountant_name": "Michael Chen",
      "client_reference": "Client-XYZ-045"
    },
    {
      "id": "calc_003",
      "timestamp": "2025-11-02T16:45:00Z",
      "service_type": "Payroll",
      "inputs": {
        "Number of Employees": "6-10",
        "Pension Administration": "Yes",
        "Frequency": "Monthly"
      },
      "calculation_breakdown": [
        {
          "rate_id": "RC010",
          "rate_name": "Payroll Base Fee",
          "unit_price": 50.00,
          "quantity": 1,
          "total": 50.00
        },
        {
          "rate_id": "RC009",
          "rate_name": "Payroll Per Employee",
          "unit_price": 15.00,
          "quantity": 8,
          "total": 120.00
        },
        {
          "rate_id": "RC023",
          "rate_name": "Pension Administration",
          "unit_price": 5.00,
          "quantity": 8,
          "total": 40.00
        }
      ],
      "total_price": 210.00,
      "currency": "GBP",
      "accountant_name": "Emma Williams",
      "client_reference": "Client-DEF-012"
    },
    {
      "id": "calc_004",
      "timestamp": "2025-11-01T09:20:00Z",
      "service_type": "Tax",
      "inputs": {
        "Return Type": "Complex (Multiple Income Sources)",
        "Additional Tax Services": "Capital Gains",
        "Tax Planning Required": "Yes (1-2 hours)"
      },
      "calculation_breakdown": [
        {
          "rate_id": "RC012",
          "rate_name": "Tax Return Complex",
          "unit_price": 350.00,
          "quantity": 1,
          "total": 350.00
        },
        {
          "rate_id": "RC027",
          "rate_name": "Capital Gains Tax Computation",
          "unit_price": 150.00,
          "quantity": 1,
          "total": 150.00
        },
        {
          "rate_id": "RC028",
          "rate_name": "Tax Planning Consultation",
          "unit_price": 125.00,
          "quantity": 1.5,
          "total": 187.50
        }
      ],
      "total_price": 687.50,
      "currency": "GBP",
      "accountant_name": "James Patel",
      "client_reference": "Client-GHI-089"
    },
    {
      "id": "calc_005",
      "timestamp": "2025-10-31T11:00:00Z",
      "service_type": "Year-End",
      "inputs": {
        "Business Structure": "Sole Trader",
        "VAT Registered": "No",
        "Record Type": "Spreadsheet",
        "Company Filings": "None"
      },
      "calculation_breakdown": [
        {
          "rate_id": "RC002",
          "rate_name": "Sole Trader Base Fee",
          "unit_price": 150.00,
          "quantity": 1,
          "total": 150.00
        },
        {
          "rate_id": "RC005",
          "rate_name": "Spreadsheet Records Fee",
          "unit_price": 75.00,
          "quantity": 1,
          "total": 75.00
        }
      ],
      "total_price": 225.00,
      "currency": "GBP",
      "accountant_name": "Sarah Thompson",
      "client_reference": "Client-JKL-023"
    },
    {
      "id": "calc_006",
      "timestamp": "2025-10-30T13:30:00Z",
      "service_type": "Bookkeeping",
      "inputs": {
        "Monthly Transactions": "0-100",
        "High Volume": "No",
        "Additional Services": "None",
        "Account Reconciliations": "None",
        "Subscription Type": "Monthly"
      },
      "calculation_breakdown": [
        {
          "rate_id": "RC007",
          "rate_name": "Bookkeeping Base Rate",
          "unit_price": 0.50,
          "quantity": 75,
          "total": 37.50
        },
        {
          "rate_id": "RC008",
          "rate_name": "Bookkeeping Monthly Minimum",
          "unit_price": 100.00,
          "quantity": 1,
          "total": 100.00
        }
      ],
      "total_price": 100.00,
      "currency": "GBP",
      "accountant_name": "David Roberts",
      "client_reference": "Client-MNO-056"
    },
    {
      "id": "calc_007",
      "timestamp": "2025-10-29T15:50:00Z",
      "service_type": "Year-End",
      "inputs": {
        "Business Structure": "Ltd Co (FRS 102)",
        "VAT Registered": "Yes",
        "Record Type": "Cloud Accounting (Xero/QBO)",
        "Company Filings": "Accounts Only"
      },
      "calculation_breakdown": [
        {
          "rate_id": "RC014",
          "rate_name": "FRS 102 Base Fee",
          "unit_price": 450.00,
          "quantity": 1,
          "total": 450.00
        },
        {
          "rate_id": "RC004",
          "rate_name": "VAT Return Add-on",
          "unit_price": 50.00,
          "quantity": 1,
          "total": 50.00
        },
        {
          "rate_id": "RC006",
          "rate_name": "Cloud Accounting Discount",
          "unit_price": -25.00,
          "quantity": 1,
          "total": -25.00
        },
        {
          "rate_id": "RC016",
          "rate_name": "Annual Accounts Filing",
          "unit_price": 75.00,
          "quantity": 1,
          "total": 75.00
        }
      ],
      "total_price": 550.00,
      "currency": "GBP",
      "accountant_name": "Rachel Martinez",
      "client_reference": "Client-PQR-078"
    },
    {
      "id": "calc_008",
      "timestamp": "2025-10-28T08:15:00Z",
      "service_type": "Payroll",
      "inputs": {
        "Number of Employees": "1-5",
        "Pension Administration": "No",
        "Frequency": "Weekly"
      },
      "calculation_breakdown": [
        {
          "rate_id": "RC010",
          "rate_name": "Payroll Base Fee",
          "unit_price": 50.00,
          "quantity": 1,
          "total": 50.00
        },
        {
          "rate_id": "RC009",
          "rate_name": "Payroll Per Employee",
          "unit_price": 15.00,
          "quantity": 3,
          "total": 45.00
        }
      ],
      "total_price": 95.00,
      "currency": "GBP",
      "accountant_name": "Tom Anderson",
      "client_reference": "Client-STU-034"
    }
  ]
};
