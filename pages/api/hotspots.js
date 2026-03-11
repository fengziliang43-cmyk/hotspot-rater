// API endpoint to get current hotspots with scores
export default async function handler(req, res) {
  // This will be implemented to fetch and score hotspots
  res.status(200).json({ 
    message: "Hotspot API ready",
    timestamp: new Date().toISOString()
  });
}