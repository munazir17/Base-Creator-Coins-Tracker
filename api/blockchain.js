// api/blockchain.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const ALCHEMY_URL = process.env.https://base-mainnet.g.alchemy.com/v2/81G-nrhcCLb_k0rg7WNnm;
  const { tokenAddress, method = 'balance' } = req.query;
  
  if (!tokenAddress) {
    return res.status(400).json({
      success: false,
      error: 'Token address is required'
    });
  }

  // Validate Ethereum address format
  const addressRegex = /^0x[a-fA-F0-9]{40}$/;
  if (!addressRegex.test(tokenAddress)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid Ethereum address format'
    });
  }
  
  try {
    const results = {};

    // Get total supply
    const supplyResponse = await fetch(ALCHEMY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_call',
        params: [{
          to: tokenAddress,
          data: '0x18160ddd' // totalSupply() selector
        }, 'latest']
      })
    });
    
    const supplyData = await supplyResponse.json();
    results.totalSupply = supplyData.result;
    
    // Get token name
    const nameResponse = await fetch(ALCHEMY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 2,
        method: 'eth_call',
        params: [{
          to: tokenAddress,
          data: '0x06fdde03' // name() selector
        }, 'latest']
      })
    });
    
    const nameData = await nameResponse.json();
    results.name = nameData.result;
    
    // Get token symbol
    const symbolResponse = await fetch(ALCHEMY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 3,
        method: 'eth_call',
        params: [{
          to: tokenAddress,
          data: '0x95d89b41' // symbol() selector
        }, 'latest']
      })
    });
    
    const symbolData = await symbolResponse.json();
    results.symbol = symbolData.result;

    // Get decimals
    const decimalsResponse = await fetch(ALCHEMY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 4,
        method: 'eth_call',
        params: [{
          to: tokenAddress,
          data: '0x313ce567' // decimals() selector
        }, 'latest']
      })
    });
    
    const decimalsData = await decimalsResponse.json();
    results.decimals = decimalsData.result;

    // Convert hex to readable format
    const parseHexString = (hex) => {
      if (!hex || hex === '0x') return '';
      try {
        // Remove 0x prefix and decode
        const cleanHex = hex.replace('0x', '');
        const bytes = [];
        for (let i = 0; i < cleanHex.length; i += 2) {
          bytes.push(parseInt(cleanHex.substr(i, 2), 16));
        }
        return String.fromCharCode(...bytes.filter(b => b !== 0));
      } catch (e) {
        return hex;
      }
    };

    const parseHexNumber = (hex) => {
      if (!hex || hex === '0x') return 0;
      return parseInt(hex, 16);
    };
    
    res.status(200).json({
      success: true,
      data: {
        address: tokenAddress,
        name: parseHexString(results.name),
        symbol: parseHexString(results.symbol),
        decimals: parseHexNumber(results.decimals),
        totalSupply: parseHexNumber(results.totalSupply),
        totalSupplyRaw: results.totalSupply
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Blockchain API Error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
