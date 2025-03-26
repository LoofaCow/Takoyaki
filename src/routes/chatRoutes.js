import express from 'express';
import { sendMessage } from '../controllers/chatController.js';
import logger from '../utils/logger.js';

const router = express.Router();

router.post('/', (req, res, next) => {
  logger.info('Received POST /chat request');
  sendMessage(req, res, next);
});

export default router;
