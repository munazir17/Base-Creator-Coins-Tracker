// api/dune.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const DUNE_API_KEY = process.env.DUNE_API_KEY;
  const { queryId } = req.query;
  
  try {
    // Execute query
    const executeResponse = await fetch(
      `https://api.dune.com/api/v1/query/${queryId}/execute`,
      {
        method: 'POST',
        headers: {
          'X-Dune-API-Key': DUNE_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const executeData = await executeResponse.json();
    const executionId = executeData.execution_id;
    
    // Poll for results
    let results = null;
    let attempts = 0;
    
    while (!results && attempts < 10) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
      
      const statusResponse = await fetch(
        `https://api.dune.com/api/v1/execution/${executionId}/results`,
        {
          headers: {
            'X-Dune-API-Key': DUNE_API_KEY
          }
        }
      );
      
      const statusData = await statusResponse.json();
      
      if (statusData.state === 'QUERY_STATE_COMPLETED') {
        results = statusData.result.rows;
      }
      
      attempts++;
    }
    
    res.status(200).json({
      success: true,
      data: results,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Dune API error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
