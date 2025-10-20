// api/talent.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const TALENT_API_KEY = process.env.cb4dfbcc3d0cea99283eee59ecbefb30cce177f4acdcef61db668e5030c2;
  const { username } = req.query;
  
  try {
    const response = await fetch(
      `https://api.talentprotocol.com/api/v2/passports/${username}`,
      {
        headers: {
          'X-API-KEY': 4b362f11cf8b0f76d6d9bfecea213067f9c98d5e97b3cc82c17607c14098
        }
      }
    );
    
    const data = await response.json();
    
    res.status(200).json({
      success: true,
      score: data.score || 0,
      passport_id: data.passport_id
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
