import { describe, it, expect } from 'vitest'
import {
  detectCircularDependency,
  findAllCircularDependencies,
  evaluateDependencyCondition,
  getVisibleFactors,
  validateDependencyRule,
} from './dependencies'

describe('detectCircularDependency', () => {
  it('returns false for no circular dependencies', () => {
    const dependencies = [
      { factor_id: 2, depends_on_factor_id: 1 },
      { factor_id: 3, depends_on_factor_id: 2 },
    ]
    const result = detectCircularDependency(dependencies, 3)
    expect(result.hasCircular).toBe(false)
  })

  it('detects simple circular dependency (A -> B -> A)', () => {
    const dependencies = [
      { factor_id: 1, depends_on_factor_id: 2 },
      { factor_id: 2, depends_on_factor_id: 1 },
    ]
    const result = detectCircularDependency(dependencies, 1)
    expect(result.hasCircular).toBe(true)
    expect(result.path).toContain(1)
    expect(result.path).toContain(2)
  })

  it('detects longer circular dependency (A -> B -> C -> A)', () => {
    const dependencies = [
      { factor_id: 1, depends_on_factor_id: 2 },
      { factor_id: 2, depends_on_factor_id: 3 },
      { factor_id: 3, depends_on_factor_id: 1 },
    ]
    const result = detectCircularDependency(dependencies, 1)
    expect(result.hasCircular).toBe(true)
  })

  it('handles factors with no dependencies', () => {
    const dependencies = []
    const result = detectCircularDependency(dependencies, 1)
    expect(result.hasCircular).toBe(false)
  })
})

describe('findAllCircularDependencies', () => {
  it('returns empty array when no circular dependencies', () => {
    const dependencies = [
      { factor_id: 2, depends_on_factor_id: 1 },
    ]
    const factors = [{ id: 1 }, { id: 2 }]
    const issues = findAllCircularDependencies(dependencies, factors)
    expect(issues).toHaveLength(0)
  })

  it('finds all circular dependency chains', () => {
    const dependencies = [
      { factor_id: 1, depends_on_factor_id: 2 },
      { factor_id: 2, depends_on_factor_id: 1 },
    ]
    const factors = [{ id: 1 }, { id: 2 }]
    const issues = findAllCircularDependencies(dependencies, factors)
    expect(issues.length).toBeGreaterThan(0)
  })
})

describe('evaluateDependencyCondition', () => {
  it('returns false when parent factor not selected', () => {
    const dependency = {
      depends_on_factor_id: 1,
      condition_type: 'option_selected',
      condition_value: ['10', '11'],
    }
    const selectedOptions = {}
    expect(evaluateDependencyCondition(dependency, selectedOptions)).toBe(false)
  })

  it('returns true when option_selected condition matches', () => {
    const dependency = {
      depends_on_factor_id: 1,
      condition_type: 'option_selected',
      condition_value: ['10', '11'],
    }
    const selectedOptions = { 1: 10 }
    expect(evaluateDependencyCondition(dependency, selectedOptions)).toBe(true)
  })

  it('returns false when option_selected condition does not match', () => {
    const dependency = {
      depends_on_factor_id: 1,
      condition_type: 'option_selected',
      condition_value: ['10', '11'],
    }
    const selectedOptions = { 1: 99 }
    expect(evaluateDependencyCondition(dependency, selectedOptions)).toBe(false)
  })

  it('returns true for any_selected when any option selected', () => {
    const dependency = {
      depends_on_factor_id: 1,
      condition_type: 'any_selected',
      condition_value: [],
    }
    const selectedOptions = { 1: 5 }
    expect(evaluateDependencyCondition(dependency, selectedOptions)).toBe(true)
  })

  it('handles option_not_selected condition', () => {
    const dependency = {
      depends_on_factor_id: 1,
      condition_type: 'option_not_selected',
      condition_value: ['10', '11'],
    }
    // Should be visible when option 99 is selected (not in exclusion list)
    expect(evaluateDependencyCondition(dependency, { 1: 99 })).toBe(true)
    // Should be hidden when option 10 is selected (in exclusion list)
    expect(evaluateDependencyCondition(dependency, { 1: 10 })).toBe(false)
  })
})

describe('getVisibleFactors', () => {
  const factors = [
    { id: 1, name: 'Factor A' },
    { id: 2, name: 'Factor B' },
    { id: 3, name: 'Factor C' },
  ]

  it('returns all factors when no dependencies', () => {
    const dependencies = []
    const selectedOptions = {}
    const visible = getVisibleFactors(factors, dependencies, selectedOptions)
    expect(visible).toHaveLength(3)
  })

  it('hides dependent factor when condition not met', () => {
    const dependencies = [
      {
        factor_id: 2,
        depends_on_factor_id: 1,
        condition_type: 'option_selected',
        condition_value: ['10'],
      },
    ]
    const selectedOptions = { 1: 99 } // Wrong option selected
    const visible = getVisibleFactors(factors, dependencies, selectedOptions)
    expect(visible).toHaveLength(2)
    expect(visible.find(f => f.id === 2)).toBeUndefined()
  })

  it('shows dependent factor when condition met', () => {
    const dependencies = [
      {
        factor_id: 2,
        depends_on_factor_id: 1,
        condition_type: 'option_selected',
        condition_value: ['10'],
      },
    ]
    const selectedOptions = { 1: 10 } // Correct option selected
    const visible = getVisibleFactors(factors, dependencies, selectedOptions)
    expect(visible).toHaveLength(3)
    expect(visible.find(f => f.id === 2)).toBeDefined()
  })
})

describe('validateDependencyRule', () => {
  const factors = [
    { id: 1, service_id: 100, name: 'Factor A' },
    { id: 2, service_id: 100, name: 'Factor B' },
    { id: 3, service_id: 200, name: 'Factor C' },
  ]

  it('validates a valid dependency rule', () => {
    const newDep = { factor_id: 2, depends_on_factor_id: 1 }
    const existingDeps = []
    const result = validateDependencyRule(newDep, existingDeps, factors)
    expect(result.isValid).toBe(true)
    expect(result.error).toBeNull()
  })

  it('rejects self-dependency', () => {
    const newDep = { factor_id: 1, depends_on_factor_id: 1 }
    const existingDeps = []
    const result = validateDependencyRule(newDep, existingDeps, factors)
    expect(result.isValid).toBe(false)
    expect(result.error).toContain('cannot depend on itself')
  })

  it('rejects cross-service dependency', () => {
    const newDep = { factor_id: 1, depends_on_factor_id: 3 } // Different services
    const existingDeps = []
    const result = validateDependencyRule(newDep, existingDeps, factors)
    expect(result.isValid).toBe(false)
    expect(result.error).toContain('same service')
  })

  it('rejects dependency that would create circular reference', () => {
    const existingDeps = [
      { factor_id: 2, depends_on_factor_id: 1 },
    ]
    const newDep = { factor_id: 1, depends_on_factor_id: 2 } // Would create 1 -> 2 -> 1
    const result = validateDependencyRule(newDep, existingDeps, factors)
    expect(result.isValid).toBe(false)
    expect(result.error).toContain('circular dependency')
  })

  it('rejects dependency for non-existent factor', () => {
    const newDep = { factor_id: 999, depends_on_factor_id: 1 }
    const existingDeps = []
    const result = validateDependencyRule(newDep, existingDeps, factors)
    expect(result.isValid).toBe(false)
    expect(result.error).toContain('not found')
  })
})
