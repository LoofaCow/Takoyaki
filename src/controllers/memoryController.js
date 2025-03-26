// src/controllers/memoryController.js
import { saveMemory, getMemories } from '../services/memoryService.js';

/**
 * addMemory:
 *  - Handles a POST request to save a memory.
 */
export async function addMemory(req, res, next) {
  try {
    const memory = req.body; // Expecting { userId, sessionId, timestamp, content, tags }
    if (!memory || !memory.content) {
      return res.status(400).json({ error: 'Memory content is required.' });
    }
    const insertedId = await saveMemory(memory);
    res.json({ insertedId });
  } catch (error) {
    next(error);
  }
}

/**
 * fetchMemories:
 *  - Handles a GET request to retrieve memories.
 *  - Query parameters can be used for filtering (e.g., userId, sessionId).
 */
export async function fetchMemories(req, res, next) {
  try {
    const query = req.query; // For example: ?userId=trevor123
    const memories = await getMemories(query);
    res.json({ memories });
  } catch (error) {
    next(error);
  }
}
