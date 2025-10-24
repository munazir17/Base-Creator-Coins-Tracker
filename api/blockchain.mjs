export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const ALCHEMY_URL = process.env.https://base-mainnet.g.alchemy.com/v2/81G-nrhcCLb_k0rg7WNnm;
  const { tokenAddress } = req.query;
  
  if (!tokenAddress) {
    return res.status(400).json({
      success: false,
      error: 'Token address required'
    });
  }

  if (!ALCHEMY_URL) {
    return res.status(500).json({
      success: false,
      error: 'Alchemy URL not configured'
    });
  }

  const addressRegex = /^0x[a-fA-F0-9]{40}$/;
  if (!addressRegex.test(tokenAddress)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid Ethereum address format'
    });
  }
  
  try {
    const supplyResponse = await fetch(ALCHEMY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_call',
        params: [{
          to: tokenAddress,
          data: '0x18160ddd'
        }, 'latest']
      })
    });
    
    const supplyData = await supplyResponse.json();
    
    return res.status(200).json({
      success: true,
      data: {
        address: tokenAddress,
        totalSupply: supplyData.result
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Blockchain error:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
