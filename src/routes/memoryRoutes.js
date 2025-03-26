// src/routes/memoryRoutes.js
import express from 'express';
import { addMemory, fetchMemories } from '../controllers/memoryController.js';

const router = express.Router();

// POST /memory - Add a new memory
router.post('/', addMemory);

// GET /memory - Retrieve memories based on query parameters
router.get('/', fetchMemories);

export default router;
