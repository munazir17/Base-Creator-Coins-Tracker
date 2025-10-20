async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const DUNE_API_KEY = process.env.ADHnuthXlFyRRf2REs4rGRzVVH9pqeHq;
  const { queryId = '3238882' } = req.query; // Default: Base ecosystem query
  
  try {
    // Execute Dune query
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
    
    if (!executeResponse.ok) {
      throw new Error(`Dune API returned ${executeResponse.status}`);
    }
    
    const executeData = await executeResponse.json();
    const executionId = executeData.execution_id;
    
    // Poll for results (max 20 seconds)
    let results = null;
    let attempts = 0;
    const maxAttempts = 10;
    
    while (!results && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
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
        break;
      } else if (statusData.state === 'QUERY_STATE_FAILED') {
        throw new Error('Query execution failed');
      }
      
      attempts++;
    }
    
    if (!results) {
      throw new Error('Query timeout - try again');
    }
    
    res.status(200).json({
      success: true,
      data: results,
      queryId: queryId,
      executionId: executionId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Dune API error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
