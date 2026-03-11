// 简化的API端点 - 主要用于演示
export default function handler(req, res) {
  res.status(200).json({
    hotspots: [],
    message: "热点数据现在通过客户端直接获取，请刷新页面"
  });
}