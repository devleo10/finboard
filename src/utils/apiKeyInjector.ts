/**
 * Utility to inject API keys from environment variables into API URLs
 * Supports placeholders like {FINNHUB_API_KEY}, {ALPHA_VANTAGE_API_KEY}, etc.
 * Also handles timestamp placeholders for Finnhub ({from}, {to})
 */

export const injectApiKeys = (url: string): string => {
  if (!url) return url

  let processedUrl = url

  // Calculate default timestamps (last 30 days)
  const now = Math.floor(Date.now() / 1000)
  const thirtyDaysAgo = now - (30 * 24 * 60 * 60)

  // Replace timestamp placeholders for Finnhub
  processedUrl = processedUrl.replace(/{to}/g, now.toString())
  processedUrl = processedUrl.replace(/{from}/g, thirtyDaysAgo.toString())

  // Finnhub API key - check if URL contains finnhub.io and needs token
  if (url.includes('finnhub.io') || url.includes('YOUR_API_KEY') || url.includes('{FINNHUB_API_KEY}') || url.includes('token=')) {
    const finnhubKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY
    if (finnhubKey) {
      // Replace various placeholder formats
      processedUrl = processedUrl.replace(/YOUR_API_KEY/g, finnhubKey)
      processedUrl = processedUrl.replace(/{FINNHUB_API_KEY}/g, finnhubKey)
      // Replace token parameter if it's a placeholder or missing
      processedUrl = processedUrl.replace(/token=YOUR_API_KEY/g, `token=${finnhubKey}`)
      processedUrl = processedUrl.replace(/token=\{FINNHUB_API_KEY\}/g, `token=${finnhubKey}`)
      // If URL has token= but no value, add the key
      if (url.includes('finnhub.io') && !processedUrl.includes('token=')) {
        processedUrl += (processedUrl.includes('?') ? '&' : '?') + `token=${finnhubKey}`
      }
    } else if (url.includes('finnhub.io') && (url.includes('YOUR_API_KEY') || url.includes('token=YOUR_API_KEY'))) {
      // Log warning if API key is missing
      console.warn('Finnhub API key not found in environment variables. Please set NEXT_PUBLIC_FINNHUB_API_KEY in .env.local')
    }
  }

  // Alpha Vantage API key
  if (url.includes('YOUR_API_KEY') || url.includes('{ALPHA_VANTAGE_API_KEY}') || url.includes('apikey=')) {
    const alphaVantageKey = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY
    if (alphaVantageKey) {
      processedUrl = processedUrl.replace(/YOUR_API_KEY/g, alphaVantageKey)
      processedUrl = processedUrl.replace(/{ALPHA_VANTAGE_API_KEY}/g, alphaVantageKey)
      processedUrl = processedUrl.replace(/apikey=YOUR_API_KEY/g, `apikey=${alphaVantageKey}`)
      processedUrl = processedUrl.replace(/apikey=\{ALPHA_VANTAGE_API_KEY\}/g, `apikey=${alphaVantageKey}`)
    }
  }

  return processedUrl
}

/**
 * Get a template URL with API key injected
 */
export const getTemplateUrl = (templateUrl: string): string => {
  return injectApiKeys(templateUrl)
}

