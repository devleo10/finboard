export type DisplayMode = 'card' | 'table' | 'chart'

export type FieldType = 'string' | 'number' | 'boolean' | 'object' | 'array' | 'null'

export interface FieldInfo {
  path: string
  type: FieldType
  value: any
  displayName?: string
}

export interface SelectedField {
  path: string
  displayName?: string
}

export interface WidgetConfig {
  id: string
  name: string
  apiUrl: string
  refreshInterval: number // in seconds
  displayMode: DisplayMode
  selectedFields: SelectedField[]
  showArraysOnly?: boolean
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


