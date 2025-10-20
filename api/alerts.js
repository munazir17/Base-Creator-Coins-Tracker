// api/alerts.js
const alerts = []; // Use a database in production

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, coin, targetPrice } = req.body;
    alerts.push({ email, coin, targetPrice });
    res.json({ success: true });
  } else {
    res.json({ alerts });
  }
}
