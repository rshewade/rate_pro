/**
 * Factor Dependency Utilities
 * Handles dependency validation, circular dependency detection, and conditional logic
 */

/**
 * Detect circular dependencies in factor dependency rules
 * @param {Array} dependencies - Array of dependency rules
 * @param {number} factorId - The factor to check
 * @param {Set} visited - Set of visited factor IDs
 * @param {Set} recursionStack - Current recursion stack for cycle detection
 * @returns {Object} { hasCircular: boolean, path: Array }
 */
export function detectCircularDependency(dependencies, factorId, visited = new Set(), recursionStack = new Set(), path = []) {
  if (recursionStack.has(factorId)) {
    return { hasCircular: true, path: [...path, factorId] }
  }

  if (visited.has(factorId)) {
    return { hasCircular: false, path: [] }
  }

  visited.add(factorId)
  recursionStack.add(factorId)
  path.push(factorId)

  // Find all dependencies where this factor depends on another
  const factorDeps = dependencies.filter(d => d.factor_id === factorId)

  for (const dep of factorDeps) {
    const result = detectCircularDependency(
      dependencies,
      dep.depends_on_factor_id,
      visited,
      recursionStack,
      [...path]
    )
    if (result.hasCircular) {
      return result
    }
  }

  recursionStack.delete(factorId)
  return { hasCircular: false, path: [] }
}

/**
 * Check all factors for circular dependencies
 * @param {Array} dependencies - Array of dependency rules
 * @param {Array} factors - Array of pricing factors
 * @returns {Array} Array of circular dependency issues
 */
export function findAllCircularDependencies(dependencies, factors) {
  const issues = []
  const checked = new Set()

  for (const factor of factors) {
    if (checked.has(factor.id)) continue

    const result = detectCircularDependency(dependencies, factor.id)
    if (result.hasCircular) {
      issues.push({
        factorId: factor.id,
        path: result.path,
        message: `Circular dependency detected: ${result.path.join(' → ')}`
      })
      result.path.forEach(id => checked.add(id))
    }
  }

  return issues
}

/**
 * Evaluate if a dependent factor should be visible/enabled based on conditions
 * @param {Object} dependency - The dependency rule
 * @param {Object} selectedOptions - Map of factorId to selected optionId
 * @returns {boolean} Whether the dependent factor should be shown
 */
export function evaluateDependencyCondition(dependency, selectedOptions) {
  const { depends_on_factor_id, condition_type, condition_value } = dependency
  const selectedOption = selectedOptions[depends_on_factor_id]

  if (!selectedOption) {
    return false // Parent factor not selected, hide dependent
  }

  switch (condition_type) {
    case 'option_selected':
      // condition_value is an array of option IDs that trigger the dependency
      return condition_value.includes(String(selectedOption))

    case 'any_selected':
      // Show if any option is selected in the parent factor
      return true

    case 'option_not_selected':
      // Show if the selected option is NOT in the condition_value array
      return !condition_value.includes(String(selectedOption))

    default:
      return true
  }
}

/**
 * Get visible factors based on dependencies and current selections
 * @param {Array} factors - All pricing factors for a service
 * @param {Array} dependencies - Dependency rules
 * @param {Object} selectedOptions - Map of factorId to selected optionId
 * @returns {Array} Factors that should be visible
 */
export function getVisibleFactors(factors, dependencies, selectedOptions) {
  return factors.filter(factor => {
    // Find dependencies where this factor is the dependent one
    const factorDeps = dependencies.filter(d => d.factor_id === factor.id)

    // If no dependencies, always visible
    if (factorDeps.length === 0) {
      return true
    }

    // Check if all dependency conditions are met
    return factorDeps.every(dep => evaluateDependencyCondition(dep, selectedOptions))
  })
}

/**
 * Validate a new dependency rule before saving
 * @param {Object} newDep - The new dependency to validate
 * @param {Array} existingDeps - Existing dependencies
 * @param {Array} factors - All pricing factors
 * @returns {Object} { isValid: boolean, error: string | null }
 */
export function validateDependencyRule(newDep, existingDeps, factors) {
  const { factor_id, depends_on_factor_id } = newDep

  // Check if factor exists
  const factor = factors.find(f => f.id === factor_id)
  const dependsOnFactor = factors.find(f => f.id === depends_on_factor_id)

  if (!factor) {
    return { isValid: false, error: 'Factor not found' }
  }

  if (!dependsOnFactor) {
    return { isValid: false, error: 'Depends-on factor not found' }
  }

  // Factors must belong to the same service
  if (factor.service_id !== dependsOnFactor.service_id) {
    return { isValid: false, error: 'Factors must belong to the same service' }
  }

  // Cannot depend on itself
  if (factor_id === depends_on_factor_id) {
    return { isValid: false, error: 'A factor cannot depend on itself' }
  }

  // Check for circular dependency with the new rule
  const testDeps = [...existingDeps, newDep]
  const circularResult = detectCircularDependency(testDeps, factor_id)

  if (circularResult.hasCircular) {
    return {
      isValid: false,
      error: `This would create a circular dependency: ${circularResult.path.join(' → ')}`
    }
  }

  return { isValid: true, error: null }
}

/**
 * Build a dependency graph for visualization
 * @param {Array} factors - Pricing factors
 * @param {Array} dependencies - Dependency rules
 * @returns {Object} Graph representation { nodes: [], edges: [] }
 */
export function buildDependencyGraph(factors, dependencies) {
  const nodes = factors.map(f => ({
    id: f.id,
    name: f.name,
    serviceId: f.service_id
  }))

  const edges = dependencies.map(d => ({
    from: d.depends_on_factor_id,
    to: d.factor_id,
    conditionType: d.condition_type,
    description: d.description
  }))

  return { nodes, edges }
}
