// api/subgraph.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const { tokenAddress } = req.query;
  
  // Base mainnet subgraph endpoint
  const SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/messari/uniswap-v3-base';
  
  const query = `
    query GetToken($address: String!) {
      token(id: $address) {
        id
        symbol
        name
        decimals
        totalSupply
        totalValueLocked
        totalValueLockedUSD
        txCount
        poolCount
        whitelistPools {
          id
          token0 {
            symbol
          }
          token1 {
            symbol
          }
          liquidity
          volumeUSD
        }
      }
    }
  `;
  
  try {
    const response = await fetch(SUBGRAPH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        variables: { address: tokenAddress.toLowerCase() }
      })
    });
    
    const data = await response.json();
    
    if (data.errors) {
      throw new Error(data.errors[0].message);
    }
    
    res.status(200).json({
      success: true,
      data: data.data.token,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Subgraph error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
