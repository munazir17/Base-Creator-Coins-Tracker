// api/blockchain.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const ALCHEMY_URL = process.env.CG-us6Y6pbEC6SjSx2r7wyrTauz;
  const { tokenAddress } = req.query;
  
  try {
    // Get token balance and holder count
    const response = await fetch(ALCHEMY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_call',
        params: [{
          to: tokenAddress,
          data: '0x18160ddd' // totalSupply() function
        }, 'latest']
      })
    });
    
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
