import { FieldInfo, FieldType } from '@/store/types'

export const getFieldType = (value: any): FieldType => {
  if (value === null || value === undefined) return 'null'
  if (Array.isArray(value)) return 'array'
  if (typeof value === 'object') return 'object'
  return typeof value as FieldType
}

export const getSampleValue = (value: any, maxLength: number = 50): string => {
  if (value === null || value === undefined) return 'null'
  if (typeof value === 'object') {
    if (Array.isArray(value)) {
      return `[${value.length} items]`
    }
    return '{object}'
  }
  const str = String(value)
  return str.length > maxLength ? str.substring(0, maxLength) + '...' : str
}

export const exploreFields = (
  obj: any,
  prefix: string = '',
  maxDepth: number = 10,
  currentDepth: number = 0
): FieldInfo[] => {
  if (currentDepth >= maxDepth) return []

  const fields: FieldInfo[] = []

  if (obj === null || obj === undefined) {
    return [{ path: prefix || 'root', type: 'null', value: null }]
  }

  if (Array.isArray(obj)) {
    // For arrays, explore the first element if it exists
    if (obj.length > 0) {
      const arrayPrefix = prefix || 'root'
      fields.push({
        path: arrayPrefix,
        type: 'array',
        value: obj,
      })

      // Explore first element
      if (typeof obj[0] === 'object' && obj[0] !== null) {
        const nestedFields = exploreFields(
          obj[0],
          `${arrayPrefix}[0]`,
          maxDepth,
          currentDepth + 1
        )
        fields.push(...nestedFields)
      }
    } else {
      fields.push({
        path: prefix || 'root',
        type: 'array',
        value: [],
      })
    }
    return fields
  }

  if (typeof obj === 'object') {
    // Add the object itself
    if (prefix) {
      fields.push({
        path: prefix,
        type: 'object',
        value: obj,
      })
    }

    // Explore nested properties
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const newPath = prefix ? `${prefix}.${key}` : key
        const value = obj[key]

        const fieldType = getFieldType(value)

        // Add the field
        fields.push({
          path: newPath,
          type: fieldType,
          value,
        })

        // Recursively explore nested objects and arrays
        if (
          (fieldType === 'object' || fieldType === 'array') &&
          value !== null &&
          value !== undefined
        ) {
          const nestedFields = exploreFields(
            value,
            newPath,
            maxDepth,
            currentDepth + 1
          )
          fields.push(...nestedFields)
        }
      }
    }
  } else {
    // Primitive value
    fields.push({
      path: prefix || 'root',
      type: getFieldType(obj),
      value: obj,
    })
  }

  return fields
}

export const filterFields = (
  fields: FieldInfo[],
  searchQuery: string,
  showArraysOnly: boolean = false
): FieldInfo[] => {
  let filtered = fields

  // Filter by arrays only if requested
  if (showArraysOnly) {
    filtered = filtered.filter((field) => field.type === 'array')
  }

  // Filter by search query
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase()
    filtered = filtered.filter(
      (field) =>
        field.path.toLowerCase().includes(query) ||
        getSampleValue(field.value).toLowerCase().includes(query)
    )
  }

  return filtered
}

export const getValueByPath = (obj: any, path: string): any => {
  if (!path || !obj) return undefined
  
  const keys = path.split('.')
  let current = obj

  for (const key of keys) {
    if (current === null || current === undefined) {
      return undefined
    }

    // Handle array indices like "data[0]"
    if (key.includes('[') && key.includes(']')) {
      const [baseKey, indexStr] = key.split('[')
      const index = parseInt(indexStr.replace(']', ''), 10)
      if (current && typeof current === 'object' && baseKey in current) {
        current = current[baseKey]
        if (Array.isArray(current) && current[index] !== undefined) {
          current = current[index]
        } else {
          return undefined
        }
      } else {
        return undefined
      }
    } else {
      // Check if current is an object and has the key
      if (current && typeof current === 'object' && !Array.isArray(current)) {
        if (key in current) {
          current = current[key]
        } else {
          return undefined
        }
      } else {
        return undefined
      }
    }
  }

  return current
}


