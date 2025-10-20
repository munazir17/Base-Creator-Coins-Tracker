// api/talent.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const TALENT_API_KEY = process.env.cb4dfbcc3d0cea99283eee59ecbefb30cce177f4acdcef61db668e5030c2;
  const { username, passportId } = req.query;
  
  if (!username && !passportId) {
    return res.status(400).json({
      success: false,
      error: 'Username or passportId required'
    });
  }
  
  try {
    const identifier = passportId || username;
    const response = await fetch(
      `https://api.talentprotocol.com/api/v2/passports/${identifier}`,
      {
        method: 'GET',
        headers: {
          'X-API-KEY': TALENT_API_KEY,
          'accept': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      // If 404, user might not have a passport yet
      if (response.status === 404) {
        return res.status(200).json({
          success: true,
          hasPassport: false,
          score: 0,
          message: 'User does not have a Talent Passport yet',
          timestamp: new Date().toISOString()
        });
      }
      throw new Error(`Talent Protocol API returned ${response.status}`);
    }
    
    const data = await response.json();
    
    // Parse the response
    const passport = data.passport || data;
    
    res.status(200).json({
      success: true,
      hasPassport: true,
      score: passport.score || 0,
      passport_id: passport.passport_id || passport.id,
      activity_score: passport.activity_score || 0,
      identity_score: passport.identity_score || 0,
      skills_score: passport.skills_score || 0,
      human_checkmark: passport.verified || false,
      main_wallet: passport.main_wallet || null,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Talent Protocol API Error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      score: 0,
      timestamp: new Date().toISOString()
    });
  }
}
