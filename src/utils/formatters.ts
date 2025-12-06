export const formatValue = (value: any): string => {
  if (value === null || value === undefined) return 'N/A'
  
  if (typeof value === 'number') {
    // Check if it's a currency-like number (large numbers)
    if (value > 1000) {
      return formatCurrency(value)
    }
    return value.toLocaleString()
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No'
  }

  if (typeof value === 'object') {
    if (Array.isArray(value)) {
      return `[${value.length} items]`
    }
    return JSON.stringify(value)
  }

  return String(value)
}

export const formatCurrency = (
  value: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  }).format(value)
}

export const formatPercentage = (value: number, decimals: number = 2): string => {
  return `${value.toFixed(decimals)}%`
}

export const formatNumber = (
  value: number,
  decimals: number = 2,
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

export const formatDate = (date: Date | string, format: string = 'short'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: format as any,
  }).format(dateObj)
}


