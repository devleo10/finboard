export type DisplayMode = 'card' | 'table' | 'chart' | 'candlestick'

export type FieldType = 'string' | 'number' | 'boolean' | 'object' | 'array' | 'null'

export type FormatType = 'auto' | 'currency' | 'percentage' | 'number' | 'text'

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'INR' | 'JPY' | 'CNY' | 'AUD' | 'CAD'

export interface FormatOptions {
  type: FormatType
  currency?: CurrencyCode
  decimals?: number
  prefix?: string
  suffix?: string
}

export interface FieldInfo {
  path: string
  type: FieldType
  value: any
  displayName?: string
}

export interface SelectedField {
  path: string
  displayName?: string
  format?: FormatOptions
}

export interface WidgetConfig {
  id: string
  name: string
  apiUrl: string
  refreshInterval: number // in seconds
  displayMode: DisplayMode
  selectedFields: SelectedField[]
  showArraysOnly?: boolean
  description?: string
}

export interface Widget extends WidgetConfig {
  data?: any
  lastUpdated?: Date
  isLoading?: boolean
  error?: string | null
}

export interface APIResponse {
  data: any
  fields: FieldInfo[]
  success: boolean
  error?: string
  fieldCount?: number
}

export interface DashboardState {
  widgets: Widget[]
  isAddingWidget: boolean
  editingWidgetId: string | null
}

export interface StorageData {
  widgets: Widget[]
  version: string
}
