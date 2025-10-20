// api/tokens.js - Get list of Base tokens
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Real Base token addresses (examples - you can expand this)
  const baseTokens = [
    {
      address: '0x4200000000000000000000000000000000000006',
      name: 'Wrapped Ether',
      symbol: 'WETH',
      coingeckoId: 'ethereum',
      verified: true
    },
    {
      address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
      name: 'Dai Stablecoin',
      symbol: 'DAI',
      coingeckoId: 'dai',
      verified: true
    },
    {
      address: '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA',
      name: 'USD Base Coin',
      symbol: 'USDbC',
      coingeckoId: 'bridged-usd-coin-base',
      verified: true
    }
  ];

  res.status(200).json({
    success: true,
    tokens: baseTokens,
    count: baseTokens.length,
    network: 'Base',
    timestamp: new Date().toISOString()
  });
}
