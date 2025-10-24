export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const TALENT_API_KEY = process.env.cb4dfbcc3d0cea99283eee59ecbefb30cce177f4acdcef61db668e5030c2;
  const { username } = req.query;
  
  if (!username) {
    return res.status(400).json({
      success: false,
      error: 'Username required'
    });
  }

  if (!TALENT_API_KEY) {
    return res.status(500).json({
      success: false,
      error: 'Talent API key not configured'
    });
  }
  
  try {
    const response = await fetch(
      `https://api.talentprotocol.com/api/v2/passports/${username}`,
      {
        method: 'GET',
        headers: {
          'X-API-KEY': TALENT_API_KEY,
          'accept': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      if (response.status === 404) {
        return res.status(200).json({
          success: true,
          hasPassport: false,
          score: 0,
          message: 'User does not have a Talent Passport'
        });
      }
      throw new Error(`Talent Protocol returned ${response.status}`);
    }
    
    const data = await response.json();
    const passport = data.passport || data;
    
    return res.status(200).json({
      success: true,
      hasPassport: true,
      score: passport.score || 0,
      passport_id: passport.passport_id || passport.id,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Talent API error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      score: 0
    });
  }
}
