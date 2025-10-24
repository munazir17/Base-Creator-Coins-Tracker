export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const COINGECKO_API_KEY = process.env.CG-us6Y6pbEC6SjSx2r7wyrTauz;
  
  if (!COINGECKO_API_KEY) {
    return res.status(500).json({
      success: false,
      error: 'CoinGecko API key not configured'
    });
  }

  try {
    const coinIds = 'ethereum,aerodrome-finance,bridged-usd-coin-base,dai';
    
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`,
      {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'x-cg-demo-api-key': COINGECKO_API_KEY
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`CoinGecko returned ${response.status}`);
    }
    
    const data = await response.json();
    
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate');
    
    return res.status(200).json({
      success: true,
      data: data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
