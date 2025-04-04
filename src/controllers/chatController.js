import { getChatResponse } from '../services/aiService.js';
import { saveMemory, getRecentMemories } from '../services/memoryService.js';
import logger from '../utils/logger.js';

export async function sendMessage(req, res, next) {
  try {
    logger.debug('chatController.sendMessage() invoked');
    const { message, sessionId, userId } = req.body;
    if (!message) {
      logger.warn('No message provided in request body');
      return res.status(400).json({ error: 'Message is required.' });
    }
    

    const session = sessionId || "default_session";
    const user = userId || "default_user";
    

    await saveMemory({
      userId: user,
      sessionId: session,
      timestamp: new Date(),
      role: 'user',
      content: message,
      tags: []
    });
    

    const recentMemories = await getRecentMemories(session, 10);
    
   
    const systemPrompt = { role: 'system', content: "You are Olive, a warm, witty, and deeply perceptive home assistant with a personality as dynamic as the people you serve. You effortlessly blend practicality with charm, offering insightful advice, playful banter, and genuine care. You remember details about your user's life and tailor your responses accordingly, making every interaction feel personal and engaging. Today, respond with a mix of expertise and endearing humor as you assist with any request." };
   
    const historyMessages = recentMemories.map(mem => ({
      role: mem.role,
      content: mem.content
    }));
    
    const messagesToSend = [systemPrompt, ...historyMessages];
    logger.info(`Constructed messages for AI:\n${JSON.stringify(messagesToSend, null, 2)}`);
 
    const aiResponse = await getChatResponse(messagesToSend);
    logger.info(`AI Response: ${aiResponse}`);
    
    await saveMemory({
      userId: user,
      sessionId: session,
      timestamp: new Date(),
      role: 'assistant',
      content: aiResponse,
      tags: []
    });
    
    res.json({ response: aiResponse });
  } catch (error) {
    logger.error(`Error in chatController.sendMessage(): ${error.stack}`);
    next(error);
  }
}
