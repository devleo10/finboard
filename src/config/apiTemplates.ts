export interface APITemplate {
  id: string
  name: string
  description: string
  url: string
  category: 'crypto' | 'stocks' | 'forex' | 'other'
  suggestedFields?: string[]
}

export const API_TEMPLATES: APITemplate[] = [
  // Crypto APIs
  {
    id: 'coinbase-btc',
    name: 'Bitcoin (BTC)',
    description: 'Bitcoin exchange rates via Coinbase',
    url: 'https://api.coinbase.com/v2/exchange-rates?currency=BTC',
    category: 'crypto',
    suggestedFields: ['data.currency', 'data.rates.USD', 'data.rates.EUR', 'data.rates.INR'],
  },
  {
    id: 'coinbase-eth',
    name: 'Ethereum (ETH)',
    description: 'Ethereum exchange rates via Coinbase',
    url: 'https://api.coinbase.com/v2/exchange-rates?currency=ETH',
    category: 'crypto',
    suggestedFields: ['data.currency', 'data.rates.USD', 'data.rates.EUR'],
  },
  {
    id: 'coingecko-trending',
    name: 'Trending Coins',
    description: 'Top trending cryptocurrencies',
    url: 'https://api.coingecko.com/api/v3/search/trending',
    category: 'crypto',
  },
  {
    id: 'coingecko-btc',
    name: 'Bitcoin Price',
    description: 'Bitcoin price in multiple currencies',
    url: 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,eur,inr&include_24hr_change=true',
    category: 'crypto',
    suggestedFields: ['bitcoin.usd', 'bitcoin.eur', 'bitcoin.inr', 'bitcoin.usd_24h_change'],
  },
  {
    id: 'coingecko-top10',
    name: 'Top 10 Cryptos',
    description: 'Top 10 cryptocurrencies by market cap',
    url: 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1',
    category: 'crypto',
    suggestedFields: ['name', 'current_price', 'price_change_percentage_24h', 'market_cap'],
  },
  
  // Forex APIs
  {
    id: 'exchangerate-usd',
    name: 'USD Exchange Rates',
    description: 'USD to other currencies',
    url: 'https://open.er-api.com/v6/latest/USD',
    category: 'forex',
    suggestedFields: ['base_code', 'rates.EUR', 'rates.GBP', 'rates.INR', 'rates.JPY'],
  },
  {
    id: 'exchangerate-eur',
    name: 'EUR Exchange Rates',
    description: 'EUR to other currencies',
    url: 'https://open.er-api.com/v6/latest/EUR',
    category: 'forex',
    suggestedFields: ['base_code', 'rates.USD', 'rates.GBP', 'rates.INR'],
  },
  {
    id: 'exchangerate-inr',
    name: 'INR Exchange Rates',
    description: 'INR to other currencies',
    url: 'https://open.er-api.com/v6/latest/INR',
    category: 'forex',
    suggestedFields: ['base_code', 'rates.USD', 'rates.EUR', 'rates.GBP'],
  },

  // Public Data APIs
  {
    id: 'jsonplaceholder-users',
    name: 'Sample Users',
    description: 'Sample user data for testing tables',
    url: 'https://jsonplaceholder.typicode.com/users',
    category: 'other',
    suggestedFields: ['name', 'email', 'company.name', 'address.city'],
  },
  {
    id: 'jsonplaceholder-posts',
    name: 'Sample Posts',
    description: 'Sample posts data for testing',
    url: 'https://jsonplaceholder.typicode.com/posts',
    category: 'other',
    suggestedFields: ['title', 'body', 'userId'],
  },
  
  // Candlestick/OHLC Data APIs
  {
    id: 'mock-ohlc-local',
    name: 'Sample OHLC Data (Local Mock) ⭐',
    description: 'Local mock OHLC data for testing candlestick charts - no API key needed!',
    url: '/mock-ohlc-data.json',
    category: 'other',
    suggestedFields: ['date', 'open', 'high', 'low', 'close'],
  },
  {
    id: 'alphavantage-ohlc',
    name: 'Alpha Vantage OHLC (Requires Free API Key)',
    description: 'Get free API key at alphavantage.co - Replace YOUR_API_KEY in URL',
    url: 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=YOUR_API_KEY',
    category: 'stocks',
    suggestedFields: ['Time Series (Daily).2024-01-15.open', 'Time Series (Daily).2024-01-15.high', 'Time Series (Daily).2024-01-15.low', 'Time Series (Daily).2024-01-15.close'],
  },
  // Finnhub Free Tier APIs (Real-Time Quotes - works with free API key!)
  {
    id: 'finnhub-quote-aapl',
    name: 'Finnhub: AAPL Quote ⭐ FREE',
    description: 'Apple real-time stock quote (c=current, o=open, h=high, l=low, pc=prev close)',
    url: 'https://finnhub.io/api/v1/quote?symbol=AAPL&token=YOUR_API_KEY',
    category: 'stocks',
    suggestedFields: ['c', 'o', 'h', 'l', 'pc', 'd', 'dp'],
  },
  {
    id: 'finnhub-quote-msft',
    name: 'Finnhub: MSFT Quote ⭐ FREE',
    description: 'Microsoft real-time stock quote',
    url: 'https://finnhub.io/api/v1/quote?symbol=MSFT&token=YOUR_API_KEY',
    category: 'stocks',
    suggestedFields: ['c', 'o', 'h', 'l', 'pc', 'd', 'dp'],
  },
  {
    id: 'finnhub-quote-tsla',
    name: 'Finnhub: TSLA Quote ⭐ FREE',
    description: 'Tesla real-time stock quote',
    url: 'https://finnhub.io/api/v1/quote?symbol=TSLA&token=YOUR_API_KEY',
    category: 'stocks',
    suggestedFields: ['c', 'o', 'h', 'l', 'pc', 'd', 'dp'],
  },
  {
    id: 'finnhub-quote-googl',
    name: 'Finnhub: GOOGL Quote ⭐ FREE',
    description: 'Google real-time stock quote',
    url: 'https://finnhub.io/api/v1/quote?symbol=GOOGL&token=YOUR_API_KEY',
    category: 'stocks',
    suggestedFields: ['c', 'o', 'h', 'l', 'pc', 'd', 'dp'],
  },
  {
    id: 'finnhub-quote-amzn',
    name: 'Finnhub: AMZN Quote ⭐ FREE',
    description: 'Amazon real-time stock quote',
    url: 'https://finnhub.io/api/v1/quote?symbol=AMZN&token=YOUR_API_KEY',
    category: 'stocks',
    suggestedFields: ['c', 'o', 'h', 'l', 'pc', 'd', 'dp'],
  },
  {
    id: 'finnhub-quote-nvda',
    name: 'Finnhub: NVDA Quote ⭐ FREE',
    description: 'NVIDIA real-time stock quote',
    url: 'https://finnhub.io/api/v1/quote?symbol=NVDA&token=YOUR_API_KEY',
    category: 'stocks',
    suggestedFields: ['c', 'o', 'h', 'l', 'pc', 'd', 'dp'],
  },
  {
    id: 'finnhub-quote-meta',
    name: 'Finnhub: META Quote ⭐ FREE',
    description: 'Meta (Facebook) real-time stock quote',
    url: 'https://finnhub.io/api/v1/quote?symbol=META&token=YOUR_API_KEY',
    category: 'stocks',
    suggestedFields: ['c', 'o', 'h', 'l', 'pc', 'd', 'dp'],
  },
  {
    id: 'finnhub-company-profile-aapl',
    name: 'Finnhub: AAPL Company Profile ⭐ FREE',
    description: 'Apple company information and details',
    url: 'https://finnhub.io/api/v1/stock/profile2?symbol=AAPL&token=YOUR_API_KEY',
    category: 'stocks',
    suggestedFields: ['name', 'ticker', 'marketCapitalization', 'country', 'ipo', 'weburl', 'finnhubIndustry'],
  },
  {
    id: 'finnhub-market-news',
    name: 'Finnhub: Market News ⭐ FREE',
    description: 'Latest general market news',
    url: 'https://finnhub.io/api/v1/news?category=general&token=YOUR_API_KEY',
    category: 'other',
    suggestedFields: ['headline', 'source', 'summary', 'url', 'datetime'],
  },
]

export const getTemplatesByCategory = (category: APITemplate['category']) => {
  return API_TEMPLATES.filter((t) => t.category === category)
}

export const getTemplateById = (id: string) => {
  return API_TEMPLATES.find((t) => t.id === id)
}

