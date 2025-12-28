import { FormatOptions, CurrencyCode } from '@/store/types'

const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  JPY: '¥',
  CNY: '¥',
  AUD: 'A$',
  CAD: 'C$',
}

export const formatWithOptions = (value: any, options?: FormatOptions): string => {
  if (value === null || value === undefined) return 'N/A'

  if (!options || options.type === 'auto') {
    return formatValue(value)
  }

  const numValue = typeof value === 'number' ? value : parseFloat(value)

  switch (options.type) {
    case 'currency':
      if (isNaN(numValue)) return String(value)
      return formatCurrency(numValue, options.currency || 'USD', options.decimals)

    case 'percentage':
      if (isNaN(numValue)) return String(value)
      return formatPercentage(numValue, options.decimals ?? 2)

    case 'number':
      if (isNaN(numValue)) return String(value)
      return formatNumber(numValue, options.decimals ?? 2)

    case 'text':
    default:
      let result = String(value)
      if (options.prefix) result = options.prefix + result
      if (options.suffix) result = result + options.suffix
      return result
  }
}

export const formatValue = (value: any): string => {
  if (value === null || value === undefined) return 'N/A'
  
  if (typeof value === 'number') {
    // Check if it's a currency-like number (large numbers)
    if (Math.abs(value) >= 1000000) {
      return formatCompactNumber(value)
    }
    if (Math.abs(value) >= 1000) {
      return formatCurrency(value)
    }
    // Check if it looks like a percentage (-100 to 100 with decimals)
    if (Math.abs(value) <= 100 && value.toString().includes('.')) {
      return value.toLocaleString(undefined, { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 4 
      })
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
  currency: CurrencyCode = 'USD',
  decimals?: number
): string => {
  const symbol = CURRENCY_SYMBOLS[currency] || '$'
  const fractionDigits = decimals ?? (Math.abs(value) < 1 ? 6 : 2)
  
  return symbol + value.toLocaleString(undefined, {
    minimumFractionDigits: Math.min(fractionDigits, 2),
    maximumFractionDigits: fractionDigits,
  })
}

export const formatPercentage = (value: number, decimals: number = 2): string => {
  const formatted = value.toFixed(decimals)
  const sign = value >= 0 ? '+' : ''
  return `${sign}${formatted}%`
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

export const formatCompactNumber = (value: number): string => {
  const absValue = Math.abs(value)
  const sign = value < 0 ? '-' : ''
  
  if (absValue >= 1e12) {
    return sign + (absValue / 1e12).toFixed(2) + 'T'
  }
  if (absValue >= 1e9) {
    return sign + (absValue / 1e9).toFixed(2) + 'B'
  }
  if (absValue >= 1e6) {
    return sign + (absValue / 1e6).toFixed(2) + 'M'
  }
  if (absValue >= 1e3) {
    return sign + (absValue / 1e3).toFixed(2) + 'K'
  }
  return value.toLocaleString()
}

export const formatDate = (date: Date | string, format: string = 'short'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: format as any,
  }).format(dateObj)
}

export const formatRelativeTime = (date: Date): string => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (seconds < 60) return `${seconds}s ago`
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return formatDate(date)
}
