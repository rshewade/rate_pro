import * as React from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-[#030213] text-white',
        secondary: 'border-transparent bg-[#f3f3f5] text-foreground',
        destructive: 'border-transparent bg-red-500 text-white',
        outline: 'border-gray-200 text-foreground',
        success: 'border-transparent bg-green-100 text-green-800',
        warning: 'border-transparent bg-yellow-100 text-yellow-800',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
