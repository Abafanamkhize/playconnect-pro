const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3009;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "AI Service Running",
    port: PORT,
    timestamp: new Date().toISOString(),
    aiModels: [
      "Talent Prediction Model",
      "Performance Analytics Engine",
      "Injury Risk Assessment"
    ]
  });
});

// Simple AI endpoints for testing
app.post("/api/ai/talent-discovery", (req, res) => {
  const { criteria, limit = 5 } = req.body;
  
  res.json({
    success: true,
    data: {
      players: Array.from({ length: limit }, (_, i) => ({
        id: `player-${i + 1}`,
        name: `Test Player ${i + 1}`,
        position: criteria?.position || 'Forward',
        aiScore: Math.floor(Math.random() * 30) + 70,
        potential: Math.floor(Math.random() * 25) + 75
      })),
      discoveryMetrics: {
        totalAnalyzed: limit,
        highPotential: Math.floor(limit * 0.6)
      }
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log("🤖 AI Service running on port " + PORT);
  console.log("📍 Health check: http://localhost:" + PORT + "/health");
});
