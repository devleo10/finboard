/**
 * Stock symbol to company name mapping
 */
export const STOCK_COMPANIES: Record<string, { name: string; sector?: string }> = {
  AAPL: { name: 'Apple Inc.', sector: 'Technology' },
  MSFT: { name: 'Microsoft Corporation', sector: 'Technology' },
  GOOGL: { name: 'Alphabet Inc.', sector: 'Technology' },
  AMZN: { name: 'Amazon.com Inc.', sector: 'Consumer Discretionary' },
  TSLA: { name: 'Tesla, Inc.', sector: 'Consumer Discretionary' },
  META: { name: 'Meta Platforms, Inc.', sector: 'Technology' },
  NVDA: { name: 'NVIDIA Corporation', sector: 'Technology' },
  JPM: { name: 'JPMorgan Chase & Co.', sector: 'Financial Services' },
  V: { name: 'Visa Inc.', sector: 'Financial Services' },
  JNJ: { name: 'Johnson & Johnson', sector: 'Healthcare' },
  WMT: { name: 'Walmart Inc.', sector: 'Consumer Staples' },
  PG: { name: 'The Procter & Gamble Company', sector: 'Consumer Staples' },
  MA: { name: 'Mastercard Incorporated', sector: 'Financial Services' },
  UNH: { name: 'UnitedHealth Group Inc.', sector: 'Healthcare' },
  DIS: { name: 'The Walt Disney Company', sector: 'Communication Services' },
  HD: { name: 'The Home Depot, Inc.', sector: 'Consumer Discretionary' },
  BAC: { name: 'Bank of America Corp.', sector: 'Financial Services' },
  ADBE: { name: 'Adobe Inc.', sector: 'Technology' },
  CRM: { name: 'Salesforce, Inc.', sector: 'Technology' },
  NFLX: { name: 'Netflix, Inc.', sector: 'Communication Services' },
}

/**
 * Field key to professional label mapping
 */
export const FIELD_LABELS: Record<string, string> = {
  // Stock quote fields
  c: 'Current Price',
  o: 'Open',
  h: 'High',
  l: 'Low',
  pc: 'Previous Close',
  d: 'Change',
  dp: 'Change %',
  t: 'Timestamp',
  
  // Common financial fields
  price: 'Price',
  volume: 'Volume',
  marketCap: 'Market Cap',
  market_cap: 'Market Cap',
  marketCapitalization: 'Market Cap',
  pe: 'P/E Ratio',
  pe_ratio: 'P/E Ratio',
  eps: 'EPS',
  dividend: 'Dividend',
  yield: 'Yield',
  high52: '52 Week High',
  low52: '52 Week Low',
  
  // Company profile fields
  name: 'Company Name',
  ticker: 'Ticker Symbol',
  exchange: 'Exchange',
  ipo: 'IPO Date',
  weburl: 'Website',
  finnhubIndustry: 'Industry',
  country: 'Country',
  
  // News fields
  headline: 'Headline',
  source: 'Source',
  summary: 'Summary',
  url: 'URL',
  datetime: 'Date & Time',
  
  // Currency fields
  currency: 'Currency',
  rates: 'Exchange Rates',
  
  // Generic
  id: 'ID',
  symbol: 'Symbol',
  date: 'Date',
  time: 'Time',
  value: 'Value',
  amount: 'Amount',
  total: 'Total',
}

/**
 * Get professional company name from symbol
 */
export const getCompanyName = (symbol: string): string => {
  const upperSymbol = symbol.toUpperCase()
  return STOCK_COMPANIES[upperSymbol]?.name || symbol
}

/**
 * Get professional field label
 */
export const getFieldLabel = (key: string): string => {
  // Check exact match first
  if (FIELD_LABELS[key]) {
    return FIELD_LABELS[key]
  }
  
  // Check case-insensitive
  const lowerKey = key.toLowerCase()
  for (const [fieldKey, label] of Object.entries(FIELD_LABELS)) {
    if (fieldKey.toLowerCase() === lowerKey) {
      return label
    }
  }
  
  // Format the key nicely
  return key
    .replace(/_/g, ' ')
    .replace(/\./g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

/**
 * Format stock widget title professionally
 */
export const formatStockTitle = (widgetName: string): string => {
  // Extract symbol from widget name (e.g., "Finnhub: AAPL Quote ⭐ FREE" -> "AAPL")
  const symbolMatch = widgetName.match(/\b([A-Z]{2,5})\b/)
  if (symbolMatch) {
    const symbol = symbolMatch[1]
    const companyName = getCompanyName(symbol)
    return `${companyName} (${symbol})`
  }
  
  // Remove "Finnhub:", "⭐ FREE", etc. and clean up
  return widgetName
    .replace(/Finnhub:\s*/i, '')
    .replace(/\s*⭐\s*FREE/gi, '')
    .replace(/\s*Quote/gi, '')
    .trim()
}

