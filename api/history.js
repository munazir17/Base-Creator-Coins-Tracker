// api/history.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const COVALENT_API_KEY = process.env.COVALENT_API_KEY;
  const { tokenAddress, days = 30 } = req.query;
  
  const BASE_CHAIN_ID = 8453; // Base mainnet chain ID
  
  try {
    const response = await fetch(
      `https://api.covalenthq.com/v1/${BASE_CHAIN_ID}/tokens/${tokenAddress}/token_holders_v2/?page-size=100`,
      {
        headers: {
          'Authorization': `Bearer ${COVALENT_API_KEY}`
        }
      }
    );
    
    const data = await response.json();
    
    res.status(200).json({
      success: true,
      holders: data.data.items.length,
      topHolders: data.data.items.slice(0, 10),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Covalent API error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
