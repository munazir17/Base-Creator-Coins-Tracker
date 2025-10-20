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
// Real Base Token Addresses (as of 2024)
const BASE_TOKENS = [
  {
    name: 'Wrapped Ether',
    symbol: 'WETH',
    address: '0x4200000000000000000000000000000000000006',
    coingeckoId: 'ethereum',
    verified: true
  },
  {
    name: 'USD Base Coin',
    symbol: 'USDbC',
    address: '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA',
    coingeckoId: 'bridged-usd-coin-base',
    verified: true
  },
  {
    name: 'Dai Stablecoin',
    symbol: 'DAI',
    address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
    coingeckoId: 'dai',
    verified: true
  },
  {
    name: 'Aerodrome Finance',
    symbol: 'AERO',
    address: '0x940181a94A35A4569E4529A3CDfB74e38FD98631',
    coingeckoId: 'aerodrome-finance',
    verified: true
  },
  {
    name: 'Base God',
    symbol: 'TYBG',
    address: '0x0578d8A44db98B23BF096A382e016e29a5Ce0ffe',
    coingeckoId: 'base-god',
    verified: true
  }
];
