// api/_middleware.js
const rateLimit = new Map();

export default function middleware(req, res, next) {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const now = Date.now();
  const windowMs = 60000; // 1 minute
  const maxRequests = 60; // 60 requests per minute

  if (!rateLimit.has(ip)) {
    rateLimit.set(ip, []);
  }

  const requests = rateLimit.get(ip).filter(time => now - time < windowMs);
  
  if (requests.length >= maxRequests) {
    return res.status(429).json({
      success: false,
      error: 'Too many requests'
    });
  }

  requests.push(now);
  rateLimit.set(ip, requests);
  next();
}
