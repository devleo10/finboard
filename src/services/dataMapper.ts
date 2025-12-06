import { SelectedField } from '@/store/types'
import { getValueByPath } from '@/utils/fieldExplorer'

export interface MappedData {
  [key: string]: any
}

export const dataMapper = {
  /**
   * Extract selected fields from API response data
   */
  extractFields: (data: any, selectedFields: SelectedField[]): MappedData => {
    const mapped: MappedData = {}

    for (const field of selectedFields) {
      const value = getValueByPath(data, field.path)
      // Use displayName if provided, otherwise use a more descriptive key
      // to avoid collisions (e.g., "rates.INR" instead of just "INR")
      let key = field.displayName
      if (!key) {
        const pathParts = field.path.split('.')
        // Use last 2 parts if available to make keys more unique
        // e.g., "rates.INR" instead of just "INR"
        if (pathParts.length >= 2) {
          key = pathParts.slice(-2).join('.')
        } else {
          key = pathParts[pathParts.length - 1] || field.path
        }
      }
      
      // Only add if value is not undefined (null is allowed)
      if (value !== undefined) {
        mapped[key] = value
      }
    }

    return mapped
  },

  /**
   * Extract data for table display (expects array data)
   */
  extractTableData: (data: any, selectedFields: SelectedField[]): any[] => {
    // Try to find array in the data
    let arrayData: any[] = []

    // Check if data itself is an array
    if (Array.isArray(data)) {
      arrayData = data
    } else if (typeof data === 'object' && data !== null) {
      // Look for arrays in the object
      for (const key in data) {
        if (Array.isArray(data[key])) {
          arrayData = data[key]
          break
        }
      }
    }

    if (arrayData.length === 0) {
      return []
    }

    // Map each item in the array using selected fields
    return arrayData.map((item) => {
      const mapped: MappedData = {}
      for (const field of selectedFields) {
        const value = getValueByPath(item, field.path)
        const key = field.displayName || field.path.split('.').pop() || field.path
        mapped[key] = value
      }
      return mapped
    })
  },

  /**
   * Extract data for chart display
   */
  extractChartData: (
    data: any,
    selectedFields: SelectedField[]
  ): { [key: string]: any }[] => {
    // For charts, we typically need time-series data
    // Try to find array data first
    let arrayData: any[] = []

    if (Array.isArray(data)) {
      arrayData = data
    } else if (typeof data === 'object' && data !== null) {
      for (const key in data) {
        if (Array.isArray(data[key])) {
          arrayData = data[key]
          break
        }
      }
    }

    if (arrayData.length === 0) {
      // If no array found, try to create a single data point
      const mapped: MappedData = {}
      for (const field of selectedFields) {
        const value = getValueByPath(data, field.path)
        const key = field.displayName || field.path.split('.').pop() || field.path
        mapped[key] = value
      }
      return [mapped]
    }

    // Map array items for chart
    return arrayData.map((item) => {
      const mapped: MappedData = {}
      for (const field of selectedFields) {
        const value = getValueByPath(item, field.path)
        const key = field.displayName || field.path.split('.').pop() || field.path
        mapped[key] = value
      }
      return mapped
    })
  },
}


