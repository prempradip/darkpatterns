const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const urlAnalyzer = require('./analyzers/url-analyzer');
const imageAnalyzer = require('./analyzers/image-analyzer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? process.env.ALLOWED_ORIGINS?.split(',') || ['https://your-frontend-domain.com']
        : '*',
    credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure multer for image uploads
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'Dark Pattern Detector API is running',
        version: '1.0.0'
    });
});

// Analyze URL endpoint
app.post('/api/analyze-url', async (req, res) => {
    try {
        const { url } = req.body;
        
        if (!url) {
            return res.status(400).json({ 
                error: 'URL is required',
                message: 'Please provide a valid URL to analyze'
            });
        }

        // Validate URL format
        try {
            new URL(url);
        } catch (e) {
            return res.status(400).json({ 
                error: 'Invalid URL format',
                message: 'Please provide a valid URL (e.g., https://example.com)'
            });
        }

        console.log(`Analyzing URL: ${url}`);
        
        // Analyze the URL
        const result = await urlAnalyzer.analyzeURL(url);
        
        res.json({
            success: true,
            url: url,
            analyzedAt: new Date().toISOString(),
            ...result
        });
        
    } catch (error) {
        console.error('URL analysis error:', error);
        res.status(500).json({ 
            error: 'Analysis failed',
            message: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Analyze image endpoint
app.post('/api/analyze-image', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                error: 'Image is required',
                message: 'Please upload an image file'
            });
        }

        console.log(`Analyzing image: ${req.file.originalname} (${req.file.size} bytes)`);
        
        // Analyze the image
        const result = await imageAnalyzer.analyzeImage(req.file.buffer);
        
        res.json({
            success: true,
            filename: req.file.originalname,
            size: req.file.size,
            analyzedAt: new Date().toISOString(),
            ...result
        });
        
    } catch (error) {
        console.error('Image analysis error:', error);
        res.status(500).json({ 
            error: 'Analysis failed',
            message: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                error: 'File too large',
                message: 'Image must be less than 10MB'
            });
        }
    }
    
    res.status(500).json({
        error: 'Server error',
        message: error.message
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not found',
        message: 'The requested endpoint does not exist'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════╗
║   Dark Pattern Detector API Server                   ║
║   Running on: http://localhost:${PORT}                  ║
║   Environment: ${process.env.NODE_ENV || 'development'}                        ║
╚═══════════════════════════════════════════════════════╝

Available endpoints:
  GET  /health              - Health check
  POST /api/analyze-url     - Analyze website URL
  POST /api/analyze-image   - Analyze screenshot image

Ready to detect dark patterns! 🔍
    `);
});

module.exports = app;
