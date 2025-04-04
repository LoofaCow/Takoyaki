import { saveMemory, getMemories } from '../services/memoryService.js';

export async function addMemory(req, res, next) {
  try {
    const memory = req.body; 
    if (!memory || !memory.content) {
      return res.status(400).json({ error: 'Memory content is required.' });
    }
    const insertedId = await saveMemory(memory);
    res.json({ insertedId });
  } catch (error) {
    next(error);
  }
}

export async function fetchMemories(req, res, next) {
  try {
    const query = req.query; 
    const memories = await getMemories(query);
    res.json({ memories });
  } catch (error) {
    next(error);
  }
}
