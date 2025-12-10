import * as React from 'react'
import { DocsLayout } from './DocsLayout'
import { DocsSection, DocsSubSection, DocsParagraph, DocsCallout, DocsStepList, DocsFeatureList } from './DocsSection'
import { FactorTypeInputGallery } from './illustrations/FactorTypeInputGallery'
import { FactorImpactExample } from './illustrations/FactorImpactExample'
import { DependencyFlowDiagram } from './illustrations/DependencyFlowDiagram'
import { EntityComparisonTable } from './illustrations/EntityComparisonTable'
import { AddOnBreakdown } from './illustrations/AddOnBreakdown'
import { CalculationWalkthrough } from './illustrations/CalculationWalkthrough'
import { Card, CardContent } from '@/components/ui/Card'
import { BookOpen } from 'lucide-react'

/**
 * Documentation - Main documentation page component
 * Comprehensive user manual for RatePro pricing calculator
 */
export function Documentation() {
  const [activeSection, setActiveSection] = React.useState('getting-started')

  return (
    <DocsLayout activeSection={activeSection} onSectionChange={setActiveSection}>
      {/* Getting Started */}
      <DocsSection id="getting-started" title="Getting Started">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#030213] flex items-center justify-center shrink-0">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Welcome to RatePro</h3>
                <p className="text-muted-foreground">
                  RatePro is a comprehensive pricing calculator for financial services including
                  Bookkeeping, Payroll, Year-End Accounting, Tax Preparation, and CFO Services.
                  This guide will help you understand how to use the calculator, manage quotes,
                  and configure pricing as an administrator.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <DocsParagraph>
          The system uses a flexible pricing model that combines base prices, pricing factors,
          entity type modifiers, and optional add-ons to generate accurate quotes for your clients.
        </DocsParagraph>

        <DocsFeatureList
          features={[
            'Real-time price calculations as you configure options',
            'Support for multiple pricing impact types (fixed, percentage, multiplier)',
            'Business entity type pricing adjustments',
            'Global and service-specific add-ons',
            'Quote management with versioning and PDF export',
            'Comprehensive admin panel for pricing configuration',
          ]}
        />
      </DocsSection>

      {/* Calculator Usage */}
      <DocsSection id="calculator-usage" title="Calculator Usage">
        <DocsParagraph>
          The pricing calculator is your primary tool for generating quotes. It guides you through
          selecting a service, configuring pricing factors, and generating a detailed price breakdown.
        </DocsParagraph>

        <DocsSubSection id="selecting-service" title="Selecting a Service">
          <DocsParagraph>
            Start by selecting a service from the dropdown menu. Each service has a base price
            and its own set of pricing factors that affect the final quote.
          </DocsParagraph>
          <DocsStepList
            steps={[
              { title: 'Click the service dropdown', description: 'Located at the top of the calculator form' },
              { title: 'Choose your service', description: 'Select from Bookkeeping, Payroll, Tax Preparation, etc.' },
              { title: 'Review the base price', description: 'The starting price is shown before any adjustments' },
            ]}
          />
        </DocsSubSection>

        <DocsSubSection id="pricing-factors" title="Configuring Pricing Factors">
          <DocsParagraph>
            After selecting a service, you&apos;ll see various pricing factors that affect the final price.
            Each factor may be required or optional, and some factors may only appear based on other selections.
          </DocsParagraph>
          <DocsCallout type="tip" title="Required vs Optional">
            Required factors are marked with an asterisk (*) and must be selected before you can generate a quote.
            Optional factors allow you to customize the service further.
          </DocsCallout>
        </DocsSubSection>

        <DocsSubSection id="factor-input-types" title="Factor Input Types">
          <DocsParagraph>
            Pricing factors come in three different input types, each designed for specific use cases:
          </DocsParagraph>
          <FactorTypeInputGallery />
        </DocsSubSection>

        <DocsSubSection id="entity-types" title="Entity Types">
          <DocsParagraph>
            Your business entity type affects the final price due to varying complexity in tax and
            accounting requirements. Different entity types have different price modifiers.
          </DocsParagraph>
          <EntityComparisonTable />
        </DocsSubSection>

        <DocsSubSection id="add-ons" title="Selecting Add-ons">
          <DocsParagraph>
            Add-ons are optional services that can be added to your quote. Some add-ons are available
            for all services (global), while others are specific to certain service types.
          </DocsParagraph>
          <AddOnBreakdown />
        </DocsSubSection>

        <DocsSubSection id="generating-quote" title="Generating a Quote">
          <DocsParagraph>
            Once you&apos;ve configured all required factors and selected your add-ons, you can generate
            a formal quote with customer information.
          </DocsParagraph>
          <DocsStepList
            steps={[
              { title: 'Review your configuration', description: 'Check all selected factors and add-ons' },
              { title: 'Click Calculate Price', description: 'View the real-time price breakdown' },
              { title: 'Click Save Quote', description: 'Opens the customer information form' },
              { title: 'Enter customer details', description: 'Company name, contact info, entity type' },
              { title: 'Submit to save', description: 'Quote is saved with a unique quote number' },
            ]}
          />
        </DocsSubSection>
      </DocsSection>

      {/* Quote Management */}
      <DocsSection id="quote-management" title="Quote Management">
        <DocsParagraph>
          The Quotes section allows you to view, manage, and track all your generated quotes.
          Access it by clicking the &quot;Quotes&quot; button in the navigation bar.
        </DocsParagraph>

        <DocsSubSection id="quote-list" title="Quote List View">
          <DocsParagraph>
            The quote list displays all quotes with filtering and search capabilities.
          </DocsParagraph>
          <DocsFeatureList
            features={[
              'Search by quote number, customer name, or company',
              'Filter by status (Draft, Sent, Accepted, Rejected, Expired)',
              'Sort by date, amount, or customer',
              'Quick status indicators with color-coded badges',
            ]}
          />
        </DocsSubSection>

        <DocsSubSection id="quote-detail" title="Quote Details">
          <DocsParagraph>
            Click on any quote to view its full details including line items, pricing breakdown,
            customer information, and status history.
          </DocsParagraph>
        </DocsSubSection>

        <DocsSubSection id="quote-status" title="Status Management">
          <DocsParagraph>
            Quotes progress through various statuses throughout their lifecycle:
          </DocsParagraph>
          <DocsFeatureList
            features={[
              'Draft - Initial state, can be freely edited',
              'Sent - Quote has been sent to customer',
              'Accepted - Customer has accepted the quote',
              'Rejected - Customer has declined the quote',
              'Expired - Quote has passed its expiration date',
            ]}
          />
          <DocsCallout type="info" title="Automatic Expiration">
            Quotes automatically expire after their expiration date passes. The default expiration
            is 30 days from creation but can be customized.
          </DocsCallout>
        </DocsSubSection>

        <DocsSubSection id="quote-versioning" title="Versioning">
          <DocsParagraph>
            When you need to modify a quote that has already been sent, the system creates a new
            version to maintain a complete history of changes.
          </DocsParagraph>
          <DocsStepList
            steps={[
              { title: 'Open the sent quote', description: 'Navigate to the quote detail view' },
              { title: 'Click Edit/Create New Version', description: 'Opens the quote in edit mode' },
              { title: 'Make your changes', description: 'Update pricing factors, add-ons, or customer info' },
              { title: 'Save the new version', description: 'Creates a new version while preserving the original' },
            ]}
          />
        </DocsSubSection>
      </DocsSection>

      {/* PDF Export */}
      <DocsSection id="pdf-export" title="PDF Export">
        <DocsParagraph>
          Generate professional PDF documents of your quotes for sharing with clients.
        </DocsParagraph>
        <DocsStepList
          steps={[
            { title: 'Open the quote', description: 'Navigate to the quote detail view' },
            { title: 'Click the Export button', description: 'Look for the download/export icon' },
            { title: 'Review the preview', description: 'Check the PDF layout before downloading' },
            { title: 'Download the PDF', description: 'Save or print the generated document' },
          ]}
        />
        <DocsCallout type="tip" title="Browser Pop-ups">
          Make sure pop-ups are enabled for PDF downloads. Some browsers may block the download
          if pop-up blocking is active.
        </DocsCallout>
      </DocsSection>

      {/* Admin Panel */}
      <DocsSection id="admin-panel" title="Admin Panel">
        <DocsParagraph>
          The Admin Panel provides full control over pricing configuration, services, factors,
          and system settings. Access it by clicking the &quot;Admin&quot; button in the navigation bar.
        </DocsParagraph>

        <DocsSubSection id="admin-services" title="Managing Services">
          <DocsParagraph>
            Services are the core offerings in your pricing calculator. Each service has a base
            price and can have multiple pricing factors associated with it.
          </DocsParagraph>
          <DocsStepList
            steps={[
              { title: 'Navigate to Services tab', description: 'In the Admin Panel, click the Services tab' },
              { title: 'Add or Edit services', description: 'Use the Add Service button or click Edit on existing services' },
              { title: 'Set the base price', description: 'This is the starting price before any factors' },
              { title: 'Configure display order', description: 'Control how services appear in the calculator dropdown' },
            ]}
          />
        </DocsSubSection>

        <DocsSubSection id="admin-pricing-factors" title="Pricing Factors & Options">
          <DocsParagraph>
            Pricing factors are the configurable elements that affect the final price. Each factor
            has multiple options with different price impacts.
          </DocsParagraph>
          <DocsCallout type="info" title="Factor Types">
            Choose the appropriate input type (Select, Number, or Toggle) based on how users will
            interact with the factor. See the Factor Input Types section above for guidance.
          </DocsCallout>
          <FactorImpactExample />
        </DocsSubSection>

        <DocsSubSection id="admin-entity-types" title="Entity Types">
          <DocsParagraph>
            Configure business entity types and their associated price modifiers. More complex
            entity types typically have higher modifiers to account for additional work.
          </DocsParagraph>
        </DocsSubSection>

        <DocsSubSection id="admin-add-ons" title="Add-ons">
          <DocsParagraph>
            Add-ons are optional services with fixed prices. Configure them as global (available
            for all services) or assign them to specific services.
          </DocsParagraph>
        </DocsSubSection>

        <DocsSubSection id="admin-dependencies" title="Factor Dependencies">
          <DocsParagraph>
            Dependencies allow you to show or hide pricing factors based on other selections.
            This creates dynamic forms that adapt to user choices.
          </DocsParagraph>
          <DependencyFlowDiagram />
        </DocsSubSection>

        <DocsSubSection id="admin-test-calculator" title="Test Calculator">
          <DocsParagraph>
            The Test Calculator allows administrators to validate pricing configurations without
            creating actual quotes. Use it to verify that factor dependencies, pricing impacts,
            and calculations work as expected.
          </DocsParagraph>
          <DocsStepList
            steps={[
              { title: 'Open Test Calculator', description: 'Find it in the Admin Panel' },
              { title: 'Select a service', description: 'Choose the service you want to test' },
              { title: 'Configure factors', description: 'Select options for each pricing factor' },
              { title: 'Review calculations', description: 'Verify the price breakdown is correct' },
              { title: 'Test dependencies', description: 'Check that factors show/hide as expected' },
            ]}
          />
        </DocsSubSection>
      </DocsSection>

      {/* Pricing Concepts */}
      <DocsSection id="pricing-concepts" title="Pricing Concepts">
        <DocsParagraph>
          Understanding the pricing model helps you configure accurate and competitive quotes.
          RatePro uses a hybrid pricing model that combines multiple pricing impact types.
        </DocsParagraph>

        <DocsSubSection id="price-impact-types" title="Price Impact Types">
          <DocsParagraph>
            There are three types of price impacts that can be applied to factor options:
          </DocsParagraph>
          <FactorImpactExample />
        </DocsSubSection>

        <DocsSubSection id="calculation-walkthrough" title="Calculation Walkthrough">
          <DocsParagraph>
            Follow this step-by-step example to understand how the final price is calculated:
          </DocsParagraph>
          <CalculationWalkthrough />
        </DocsSubSection>
      </DocsSection>

      {/* Audit Trail */}
      <DocsSection id="audit-trail" title="Audit Trail">
        <DocsParagraph>
          The audit trail tracks all changes to quotes and pricing configurations, providing
          a complete history for compliance and accountability.
        </DocsParagraph>
        <DocsFeatureList
          features={[
            'Quote creation and modifications',
            'Status changes with timestamps',
            'Pricing configuration changes',
            'User attribution for each action',
          ]}
        />
        <DocsCallout type="info" title="Accessing Audit Logs">
          Audit logs can be viewed in the Admin Panel under the Audit Trail tab. Use filters
          to narrow down entries by date range, action type, or entity.
        </DocsCallout>
      </DocsSection>
    </DocsLayout>
  )
}

export default Documentation
