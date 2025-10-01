const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3008;

// Configure multer for video uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'video-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed'), false);
    }
  },
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB limit for videos
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// JWT verification middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  const jwt = require('jsonwebtoken');
  const JWT_SECRET = process.env.JWT_SECRET || "playconnect-super-secret-key-2024";
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "Video Processing Service Running",
    port: PORT,
    timestamp: new Date().toISOString(),
    features: [
      "Video upload and processing",
      "AI-powered player analysis", 
      "Performance metric extraction",
      "Highlight detection",
      "Biomechanical analysis"
    ]
  });
});

// Video analysis endpoint
app.post("/api/videos/analyze", authenticateToken, upload.single('video'), async (req, res) => {
  try {
    const { playerId, analysisType = 'comprehensive' } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No video file uploaded"
      });
    }

    if (!playerId) {
      return res.status(400).json({
        success: false,
        error: "Player ID is required"
      });
    }

    const videoInfo = {
      id: 'analysis-' + Date.now(),
      playerId,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      url: `/uploads/${req.file.filename}`,
      uploadedBy: req.user.userId,
      uploadedAt: new Date().toISOString(),
      status: 'processing'
    };

    // Simulate AI video analysis
    const analysisResults = await simulateVideoAnalysis(videoInfo, analysisType);

    videoInfo.status = 'completed';
    videoInfo.analysis = analysisResults;

    res.json({
      success: true,
      message: "Video analysis completed successfully",
      data: videoInfo
    });

  } catch (error) {
    console.error("Video analysis error:", error);
    res.status(500).json({
      success: false,
      error: "Video analysis failed"
    });
  }
});

// Get video analysis results
app.get("/api/videos/analysis/:analysisId", authenticateToken, (req, res) => {
  // This would fetch analysis results from database
  const analysisId = req.params.analysisId;
  
  const mockAnalysis = {
    id: analysisId,
    playerId: 'player-123',
    overallScore: 87,
    technicalAnalysis: {
      dribbling: { score: 85, confidence: 0.92 },
      passing: { score: 88, confidence: 0.89 },
      shooting: { score: 82, confidence: 0.91 },
      firstTouch: { score: 90, confidence: 0.87 }
    },
    physicalAnalysis: {
      speed: { score: 84, metrics: { sprintSpeed: '9.2 m/s', acceleration: '3.1 m/s²' } },
      agility: { score: 86, metrics: { changeOfDirection: '2.4s', balance: 'excellent' } },
      stamina: { score: 82, metrics: { distanceCovered: '11.2km', highIntensityRuns: '48' } }
    },
    tacticalAnalysis: {
      positioning: { score: 85, heatmap: '/heatmaps/position-123.jpg' },
      decisionMaking: { score: 83, keyDecisions: 24, successRate: '87%' },
      spatialAwareness: { score: 81, metrics: { passLanes: 18, interceptions: 6 } }
    },
    highlights: [
      {
        timestamp: '00:02:15',
        type: 'skill',
        description: 'Excellent dribble past defender',
        confidence: 0.94,
        clipUrl: '/highlights/skill-001.mp4'
      },
      {
        timestamp: '00:05:42', 
        type: 'pass',
        description: 'Precise through ball to striker',
        confidence: 0.91,
        clipUrl: '/highlights/pass-001.mp4'
      }
    ],
    recommendations: [
      "Improve shooting accuracy under pressure",
      "Enhance weak foot proficiency", 
      "Develop quicker decision-making in final third"
    ],
    biomechanicalInsights: {
      runningForm: 'efficient',
      injuryRisks: ['moderate hamstring tightness'],
      optimization: ['improve landing mechanics', 'enhance core stability']
    }
  };

  res.json({
    success: true,
    data: mockAnalysis
  });
});

// Batch video analysis
app.post("/api/videos/batch-analyze", authenticateToken, upload.array('videos', 5), async (req, res) => {
  try {
    const { playerId } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No video files uploaded"
      });
    }

    const batchId = 'batch-' + Date.now();
    const analyses = [];

    for (const file of req.files) {
      const videoInfo = {
        id: `analysis-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        playerId,
        filename: file.filename,
        originalName: file.originalname,
        batchId,
        status: 'processing'
      };

      analyses.push(videoInfo);
    }

    // Process analyses in background
    processBatchAnalyses(analyses);

    res.json({
      success: true,
      message: `Batch analysis started for ${analyses.length} videos`,
      data: {
        batchId,
        totalVideos: analyses.length,
        status: 'processing',
        estimatedCompletion: new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 minutes
      }
    });

  } catch (error) {
    console.error("Batch analysis error:", error);
    res.status(500).json({
      success: false,
      error: "Batch analysis failed"
    });
  }
});

// Get batch analysis status
app.get("/api/videos/batch/:batchId", authenticateToken, (req, res) => {
  const batchId = req.params.batchId;
  
  res.json({
    success: true,
    data: {
      batchId,
      status: 'completed',
      completed: 5,
      total: 5,
      results: [
        { videoId: 'video-1', status: 'completed', score: 85 },
        { videoId: 'video-2', status: 'completed', score: 82 },
        { videoId: 'video-3', status: 'completed', score: 88 },
        { videoId: 'video-4', status: 'completed', score: 79 },
        { videoId: 'video-5', status: 'completed', score: 91 }
      ],
      overallAssessment: {
        averageScore: 85,
        consistency: 'high',
        improvementAreas: ['shooting accuracy', 'defensive positioning'],
        strengths: ['dribbling', 'vision', 'passing']
      }
    }
  });
});

// AI-powered talent prediction
app.post("/api/ai/talent-prediction", authenticateToken, async (req, res) => {
  try {
    const { playerId, historicalData, currentMetrics } = req.body;

    // Simulate AI talent prediction
    const prediction = await simulateTalentPrediction(playerId, historicalData, currentMetrics);

    res.json({
      success: true,
      data: prediction
    });

  } catch (error) {
    console.error("Talent prediction error:", error);
    res.status(500).json({
      success: false,
      error: "Talent prediction failed"
    });
  }
});

// Helper functions
async function simulateVideoAnalysis(videoInfo, analysisType) {
  // Simulate AI video analysis processing
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        overallScore: Math.floor(Math.random() * 30) + 70, // 70-100
        technicalAnalysis: generateTechnicalAnalysis(),
        physicalAnalysis: generatePhysicalAnalysis(),
        tacticalAnalysis: generateTacticalAnalysis(),
        highlights: generateHighlights(),
        recommendations: generateRecommendations(),
        biomechanicalInsights: generateBiomechanicalInsights()
      });
    }, 3000);
  });
}

function generateTechnicalAnalysis() {
  const skills = ['dribbling', 'passing', 'shooting', 'firstTouch', 'ballControl', 'technique'];
  return skills.reduce((acc, skill) => {
    acc[skill] = {
      score: Math.floor(Math.random() * 20) + 80, // 80-100
      confidence: (Math.random() * 0.2) + 0.8 // 0.8-1.0
    };
    return acc;
  }, {});
}

function generatePhysicalAnalysis() {
  return {
    speed: { score: 84, metrics: { sprintSpeed: '9.2 m/s', acceleration: '3.1 m/s²' } },
    agility: { score: 86, metrics: { changeOfDirection: '2.4s', balance: 'excellent' } },
    stamina: { score: 82, metrics: { distanceCovered: '11.2km', highIntensityRuns: '48' } },
    strength: { score: 79, metrics: { upperBody: 'good', lowerBody: 'excellent' } }
  };
}

function generateTacticalAnalysis() {
  return {
    positioning: { score: 85, heatmap: '/heatmaps/position-123.jpg' },
    decisionMaking: { score: 83, keyDecisions: 24, successRate: '87%' },
    spatialAwareness: { score: 81, metrics: { passLanes: 18, interceptions: 6 } },
    gameIntelligence: { score: 84, metrics: { anticipation: 'high', adaptability: 'medium' } }
  };
}

function generateHighlights() {
  return [
    {
      timestamp: '00:02:15',
      type: 'skill',
      description: 'Excellent dribble past defender',
      confidence: 0.94
    },
    {
      timestamp: '00:05:42',
      type: 'pass', 
      description: 'Precise through ball to striker',
      confidence: 0.91
    }
  ];
}

function generateRecommendations() {
  return [
    "Improve shooting accuracy under pressure",
    "Enhance weak foot proficiency",
    "Develop quicker decision-making in final third",
    "Increase high-intensity running capacity"
  ];
}

function generateBiomechanicalInsights() {
  return {
    runningForm: 'efficient',
    injuryRisks: ['moderate hamstring tightness', 'low ankle stability'],
    optimization: ['improve landing mechanics', 'enhance core stability'],
    efficiencyScore: 82
  };
}

async function processBatchAnalyses(analyses) {
  // Simulate batch processing
  console.log(`Processing batch analysis for ${analyses.length} videos...`);
}

async function simulateTalentPrediction(playerId, historicalData, currentMetrics) {
  return {
    playerId,
    currentPotential: Math.floor(Math.random() * 20) + 80,
    projectedGrowth: Math.floor(Math.random() * 15) + 5,
    peakPotential: Math.floor(Math.random() * 10) + 90,
    developmentTimeline: {
      shortTerm: '6-12 months: Technical refinement',
      mediumTerm: '1-2 years: Tactical development', 
      longTerm: '3+ years: Leadership qualities'
    },
    riskFactors: ['injury proneness', 'consistency issues'],
    successProbability: (Math.random() * 0.3) + 0.7 // 70-100%
  };
}

// Start server
app.listen(PORT, () => {
  console.log("🎥 Video Processing Service running on port " + PORT);
  console.log("📍 Health check: http://localhost:" + PORT + "/health");
  console.log("🤖 AI-powered analysis features:");
  console.log("   POST /api/videos/analyze - Single video analysis");
  console.log("   POST /api/videos/batch-analyze - Batch video analysis");
  console.log("   GET  /api/videos/analysis/:id - Get analysis results");
  console.log("   GET  /api/videos/batch/:id - Get batch status");
  console.log("   POST /api/ai/talent-prediction - AI talent prediction");
});
