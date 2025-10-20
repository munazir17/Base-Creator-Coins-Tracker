// api/prices.js
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const COINGECKO_API_KEY = process.env.CG-us6Y6pbEC6SjSx2r7wyrTauz;
  
  try {
    // Fetch prices from CoinGecko
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,bitcoin&vs_currencies=usd&include_24hr_change=true',
      {
        headers: {
          'x-cg-demo-api-key': CG-adxQj9958YLWzCbuCioRg26F
        }
      }
    );
    
    const data = await response.json();
    
    res.status(200).json({
      success: true,
      data: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
