const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3006;

// Ensure upload directories exist
const uploadsDir = path.join(__dirname, 'uploads');
const thumbnailsDir = path.join(uploadsDir, 'thumbnails');

if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(thumbnailsDir)) fs.mkdirSync(thumbnailsDir, { recursive: true });

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Check file type
  if (file.mimetype.startsWith('video/') || file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only video and image files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

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
    status: "File Service Running",
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// File upload endpoint
app.post("/api/files/upload", authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded"
      });
    }

    const fileInfo = {
      id: 'file-' + Date.now(),
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      url: `/uploads/${req.file.filename}`,
      uploadedBy: req.user.userId,
      uploadedAt: new Date().toISOString()
    };

    // Generate thumbnail for videos (simplified - would use ffmpeg in production)
    if (req.file.mimetype.startsWith('video/')) {
      fileInfo.thumbnail = `/uploads/thumbnails/${req.file.filename}.jpg`;
    }

    res.json({
      success: true,
      message: "File uploaded successfully",
      data: fileInfo
    });

  } catch (error) {
    console.error("File upload error:", error);
    res.status(500).json({
      success: false,
      error: "File upload failed"
    });
  }
});

// Video upload endpoint (specific for player videos)
app.post("/api/videos/upload", authenticateToken, upload.single('video'), async (req, res) => {
  try {
    const { playerId } = req.body;

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
      id: 'video-' + Date.now(),
      playerId: playerId,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      duration: null, // Would be extracted using ffmpeg
      url: `/uploads/${req.file.filename}`,
      thumbnail: `/uploads/thumbnails/${req.file.filename}.jpg`,
      uploadedBy: req.user.userId,
      uploadedAt: new Date().toISOString(),
      status: 'processing'
    };

    // Simulate video processing
    setTimeout(() => {
      videoInfo.status = 'processed';
      videoInfo.duration = '2:45'; // Mock duration
    }, 2000);

    res.json({
      success: true,
      message: "Video uploaded successfully",
      data: videoInfo
    });

  } catch (error) {
    console.error("Video upload error:", error);
    res.status(500).json({
      success: false,
      error: "Video upload failed"
    });
  }
});

// Get file information
app.get("/api/files/:id", authenticateToken, (req, res) => {
  // This would fetch file metadata from database
  res.json({
    success: true,
    data: {
      id: req.params.id,
      filename: "example-video.mp4",
      url: "/uploads/example-video.mp4",
      size: 10485760,
      uploadedAt: "2024-03-15T10:30:00Z"
    }
  });
});

// Delete file
app.delete("/api/files/:id", authenticateToken, (req, res) => {
  // This would delete file from storage and database
  res.json({
    success: true,
    message: "File deleted successfully"
  });
});

// Start server
app.listen(PORT, () => {
  console.log("📁 File Service running on port " + PORT);
  console.log("📍 Health check: http://localhost:" + PORT + "/health");
  console.log("📁 Upload directory: " + uploadsDir);
  console.log("✅ File endpoints ready:");
  console.log("   POST /api/files/upload - Upload any file");
  console.log("   POST /api/videos/upload - Upload player video");
  console.log("   GET  /api/files/:id - Get file info");
  console.log("   DELETE /api/files/:id - Delete file");
});
