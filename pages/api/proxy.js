// 简单的代理API，用于绕过CORS限制
import axios from 'axios';

export default async function handler(req, res) {
  try {
    const { url } = req.query;
    
    // 只允许代理特定的安全URL
    if (!url || !url.startsWith('https://top.baidu.com/board')) {
      return res.status(400).json({ error: 'Invalid URL' });
    }
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 10000
    });
    
    res.setHeader('Content-Type', 'text/html');
    res.send(response.data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}