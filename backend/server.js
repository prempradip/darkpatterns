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
        version: '1.0.0',
        note: 'URL analysis may be slow on free tier. Image analysis is faster and more reliable.'
    });
});

// Quick test endpoint (no Puppeteer)
app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: 'API is working!',
        timestamp: new Date().toISOString(),
        tip: 'For best results on free hosting, use image upload instead of URL analysis'
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
        
        // Set a timeout for the entire analysis
        const analysisPromise = urlAnalyzer.analyzeURL(url);
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Analysis timeout - website took too long to load. Try a simpler website or try again later.')), 70000)
        );
        
        // Race between analysis and timeout
        const result = await Promise.race([analysisPromise, timeoutPromise]);
        
        res.json({
            success: true,
            url: url,
            analyzedAt: new Date().toISOString(),
            ...result
        });
        
    } catch (error) {
        console.error('URL analysis error:', error);
        
        // Provide helpful error messages
        let userMessage = error.message;
        if (error.message.includes('timeout') || error.message.includes('Navigation timeout')) {
            userMessage = 'The website took too long to load. This can happen with complex sites on free hosting. Try: 1) A simpler website (e.g., example.com), 2) Wait a minute and try again, or 3) Use image upload instead.';
        }
        
        res.status(500).json({ 
            error: 'Analysis failed',
            message: userMessage,
            suggestion: 'Try analyzing a simpler website or upload a screenshot instead',
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
