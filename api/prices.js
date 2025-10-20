// api/prices.js
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const COINGECKO_API_KEY = process.env.CG-us6Y6pbEC6SjSx2r7wyrTauz;
  
  try {
    // Fetch major Base ecosystem tokens
    const coinIds = [
      'ethereum',
      'uniswap',
      'aave',
      'wrapped-bitcoin',
      'chainlink',
      'compound-governance-token',
      'maker',
      'the-graph'
    ].join(',');

    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true&include_last_updated_at=true`,
      {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'x-cg-demo-api-key': COINGECKO_API_KEY
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`CoinGecko API returned ${response.status}`);
    }
    
    const data = await response.json();
    
    // Add cache control
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate');
    
    res.status(200).json({
      success: true,
      data: data,
      timestamp: new Date().toISOString(),
      cached: false
    });
  } catch (error) {
    console.error('CoinGecko API Error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
