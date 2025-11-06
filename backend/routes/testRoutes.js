import express from 'express';
import { Sentry } from '../config/sentry.js';

const router = express.Router();

// GET /api/test/health - Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// GET /api/test/error - Test error capture
router.get('/error', (req, res, next) => {
  // Generate intentional error for Sentry testing
  const error = new Error('🧪 Test error from /api/test/error endpoint');
  error.statusCode = 500;
  
  // Sentry will capture this automatically via error handler
  next(error);
});

// GET /api/test/slow - Test slow response
router.get('/slow', async (req, res) => {
  // Simulate slow operation
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  res.status(200).json({
    status: 'slow response',
    delay: '3000ms',
    timestamp: new Date().toISOString()
  });
});

// POST /api/test/message - Test custom message
router.post('/message', (req, res) => {
  const { message, level = 'info' } = req.body;
  
  if (!message) {
    return res.status(400).json({
      error: 'Message is required',
      example: { message: 'Your message here', level: 'info' }
    });
  }
  
  // Capture custom message in Sentry
  Sentry.captureMessage(message, level);
  
  res.status(200).json({
    status: 'message captured',
    message: message,
    level: level,
    timestamp: new Date().toISOString()
  });
});

// GET /api/test/exception - Test manual exception
router.get('/exception', (req, res) => {
  try {
    // Simulate some operation that might fail
    const data = JSON.parse('invalid json');
    res.json({ data });
  } catch (error) {
    // Manually capture exception
    Sentry.captureException(error);
    
    res.status(500).json({
      error: 'Exception captured',
      message: error.message
    });
  }
});

export default router;
