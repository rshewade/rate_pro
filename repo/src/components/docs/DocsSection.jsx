import * as React from 'react'
import { cn } from '@/lib/utils'
import { Info, Lightbulb, AlertTriangle } from 'lucide-react'

/**
 * DocsSection - Reusable documentation section component
 */
export function DocsSection({ id, title, children, className }) {
  return (
    <section id={id} className={cn('mb-12 scroll-mt-8', className)}>
      <h2 className="text-2xl font-bold mb-4 text-foreground border-b pb-2">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

/**
 * DocsSubSection - Subsection within a documentation section
 */
export function DocsSubSection({ id, title, children, className }) {
  return (
    <div id={id} className={cn('mb-8 scroll-mt-8', className)}>
      <h3 className="text-xl font-semibold mb-3 text-foreground">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

/**
 * DocsParagraph - Styled paragraph for documentation
 */
export function DocsParagraph({ children, className }) {
  return (
    <p className={cn('text-muted-foreground leading-relaxed', className)}>
      {children}
    </p>
  )
}

/**
 * DocsCallout - Highlighted callout box for tips, notes, and warnings
 */
export function DocsCallout({ type = 'info', title, children }) {
  const styles = {
    info: {
      bg: 'bg-blue-50 border-blue-200',
      icon: <Info className="w-5 h-5 text-blue-600" />,
      titleColor: 'text-blue-800',
    },
    tip: {
      bg: 'bg-green-50 border-green-200',
      icon: <Lightbulb className="w-5 h-5 text-green-600" />,
      titleColor: 'text-green-800',
    },
    warning: {
      bg: 'bg-amber-50 border-amber-200',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
      titleColor: 'text-amber-800',
    },
  }

  const style = styles[type] || styles.info

  return (
    <div className={cn('rounded-lg border p-4', style.bg)}>
      <div className="flex gap-3">
        <div className="shrink-0 mt-0.5">{style.icon}</div>
        <div>
          {title && (
            <h4 className={cn('font-medium mb-1', style.titleColor)}>{title}</h4>
          )}
          <div className="text-sm text-muted-foreground">{children}</div>
        </div>
      </div>
    </div>
  )
}

/**
 * DocsStepList - Numbered step list for procedures
 */
export function DocsStepList({ steps }) {
  return (
    <ol className="space-y-4">
      {steps.map((step, index) => (
        <li key={index} className="flex gap-4">
          <div className="shrink-0 w-8 h-8 rounded-full bg-[#030213] text-white flex items-center justify-center text-sm font-medium">
            {index + 1}
          </div>
          <div className="flex-1 pt-1">
            {typeof step === 'string' ? (
              <p className="text-muted-foreground">{step}</p>
            ) : (
              <>
                <p className="font-medium text-foreground">{step.title}</p>
                {step.description && (
                  <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                )}
              </>
            )}
          </div>
        </li>
      ))}
    </ol>
  )
}

/**
 * DocsFeatureList - List of features with icons
 */
export function DocsFeatureList({ features }) {
  return (
    <ul className="space-y-2">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start gap-2">
          <span className="text-green-500 mt-1">•</span>
          <span className="text-muted-foreground">{feature}</span>
        </li>
      ))}
    </ul>
  )
}

export default DocsSection
