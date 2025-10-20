// api/websocket.js
import { WebSocketServer } from 'ws';

let wss;

export default function handler(req, res) {
  if (!wss) {
    wss = new WebSocketServer({ noServer: true });
    
    wss.on('connection', (ws) => {
      console.log('Client connected');
      
      // Send price updates every 10 seconds
      const interval = setInterval(async () => {
        try {
          const response = await fetch(`${process.env.COINGECKO_API_URL}/simple/price?...`);
          const data = await response.json();
          ws.send(JSON.stringify({ type: 'price_update', data }));
        } catch (error) {
          console.error('WebSocket error:', error);
        }
      }, 10000);
      
      ws.on('close', () => {
        clearInterval(interval);
        console.log('Client disconnected');
      });
    });
  }
  
  if (req.headers.upgrade?.toLowerCase() === 'websocket') {
    wss.handleUpgrade(req, req.socket, Buffer.alloc(0), (ws) => {
      wss.emit('connection', ws, req);
    });
  } else {
    res.status(200).json({ message: 'WebSocket endpoint' });
  }
}
Update frontend to use WebSocket:
// Add to your App component
useEffect(() => {
  const ws = new WebSocket('wss://your-app.vercel.app/api/websocket');
  
  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.type === 'price_update') {
      setLiveData(message.data);
      setLastUpdate(new Date());
    }
  };
  
  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
  
  return () => ws.close();
}, []);
