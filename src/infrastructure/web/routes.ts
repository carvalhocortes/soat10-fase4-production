import express from 'express';
import productionRoutes from '@infrastructure/web/routes/production.routes';

const router = express.Router();

// Health check
router.get('/production/health', async (req, res) => {
  res.status(200).json({
    status: 'OK',
  });
});

// Main routes
router.use('/production', productionRoutes);

export default router;
