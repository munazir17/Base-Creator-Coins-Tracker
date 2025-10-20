// api/stats.js
const stats = {
  requests: 0,
  errors: 0,
  avgResponseTime: 0,
  lastHour: []
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const now = Date.now();
  
  // Clean old data
  stats.lastHour = stats.lastHour.filter(t => now - t < 3600000);
  
  res.status(200).json({
    success: true,
    stats: {
      totalRequests: stats.requests,
      totalErrors: stats.errors,
      requestsLastHour: stats.lastHour.length,
      avgResponseTime: stats.avgResponseTime,
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    }
  });
}

// Track request (add to other API files)
export const trackRequest = (startTime) => {
  stats.requests++;
  stats.lastHour.push(Date.now());
  
  const duration = Date.now() - startTime;
  stats.avgResponseTime = (stats.avgResponseTime * (stats.requests - 1) + duration) / stats.requests;
};

export const trackError = () => {
  stats.errors++;
};
