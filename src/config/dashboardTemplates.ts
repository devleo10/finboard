import { Widget, DisplayMode, SelectedField } from '@/store/types'

export interface DashboardTemplate {
  id: string
  name: string
  description: string
  icon: string
  category: 'crypto' | 'stocks' | 'forex' | 'mixed'
  widgets: Omit<Widget, 'id' | 'data' | 'lastUpdated' | 'isLoading' | 'error'>[]
}

export const DASHBOARD_TEMPLATES: DashboardTemplate[] = [
  {
    id: 'crypto-tracker',
    name: 'Crypto Tracker',
    description: 'Track popular cryptocurrencies with real-time prices',
    icon: '₿',
    category: 'crypto',
    widgets: [
      {
        name: 'Bitcoin (BTC)',
        apiUrl: 'https://api.coinbase.com/v2/exchange-rates?currency=BTC',
        refreshInterval: 30,
        displayMode: 'card',
        selectedFields: [
          { path: 'data.currency', displayName: 'Currency' },
          { path: 'data.rates.USD', displayName: 'USD' },
          { path: 'data.rates.EUR', displayName: 'EUR' },
          { path: 'data.rates.INR', displayName: 'INR' },
        ],
      },
      {
        name: 'Ethereum (ETH)',
        apiUrl: 'https://api.coinbase.com/v2/exchange-rates?currency=ETH',
        refreshInterval: 30,
        displayMode: 'card',
        selectedFields: [
          { path: 'data.currency', displayName: 'Currency' },
          { path: 'data.rates.USD', displayName: 'USD' },
          { path: 'data.rates.EUR', displayName: 'EUR' },
        ],
      },
      {
        name: 'Top Cryptocurrencies',
        apiUrl: 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1',
        refreshInterval: 60,
        displayMode: 'table',
        selectedFields: [
          { path: 'name', displayName: 'Name' },
          { path: 'current_price', displayName: 'Price' },
          { path: 'price_change_percentage_24h', displayName: '24h Change' },
          { path: 'market_cap', displayName: 'Market Cap' },
        ],
      },
    ],
  },
  {
    id: 'forex-monitor',
    name: 'Forex Monitor',
    description: 'Monitor currency exchange rates in real-time',
    icon: '💱',
    category: 'forex',
    widgets: [
      {
        name: 'USD Exchange Rates',
        apiUrl: 'https://open.er-api.com/v6/latest/USD',
        refreshInterval: 300,
        displayMode: 'card',
        selectedFields: [
          { path: 'base_code', displayName: 'Base' },
          { path: 'rates.EUR', displayName: 'EUR' },
          { path: 'rates.GBP', displayName: 'GBP' },
          { path: 'rates.INR', displayName: 'INR' },
          { path: 'rates.JPY', displayName: 'JPY' },
        ],
      },
      {
        name: 'EUR Exchange Rates',
        apiUrl: 'https://open.er-api.com/v6/latest/EUR',
        refreshInterval: 300,
        displayMode: 'card',
        selectedFields: [
          { path: 'base_code', displayName: 'Base' },
          { path: 'rates.USD', displayName: 'USD' },
          { path: 'rates.GBP', displayName: 'GBP' },
          { path: 'rates.INR', displayName: 'INR' },
        ],
      },
      {
        name: 'INR Exchange Rates',
        apiUrl: 'https://open.er-api.com/v6/latest/INR',
        refreshInterval: 300,
        displayMode: 'card',
        selectedFields: [
          { path: 'base_code', displayName: 'Base' },
          { path: 'rates.USD', displayName: 'USD' },
          { path: 'rates.EUR', displayName: 'EUR' },
          { path: 'rates.GBP', displayName: 'GBP' },
        ],
      },
    ],
  },
  {
    id: 'quick-start',
    name: 'Quick Start',
    description: 'A simple dashboard to get you started',
    icon: '🚀',
    category: 'mixed',
    widgets: [
      {
        name: 'Bitcoin Price',
        apiUrl: 'https://api.coinbase.com/v2/exchange-rates?currency=BTC',
        refreshInterval: 30,
        displayMode: 'card',
        selectedFields: [
          { path: 'data.currency', displayName: 'Currency' },
          { path: 'data.rates.USD', displayName: 'USD' },
        ],
      },
      {
        name: 'USD to INR',
        apiUrl: 'https://open.er-api.com/v6/latest/USD',
        refreshInterval: 300,
        displayMode: 'card',
        selectedFields: [
          { path: 'base_code', displayName: 'From' },
          { path: 'rates.INR', displayName: 'INR' },
        ],
      },
    ],
  },
]

export const getTemplateById = (id: string): DashboardTemplate | undefined => {
  return DASHBOARD_TEMPLATES.find((t) => t.id === id)
}

export const getTemplatesByCategory = (category: DashboardTemplate['category']): DashboardTemplate[] => {
  return DASHBOARD_TEMPLATES.filter((t) => t.category === category)
}

