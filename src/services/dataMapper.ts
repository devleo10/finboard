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
      const key = field.displayName || field.path.split('.').pop() || field.path
      mapped[key] = value
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


