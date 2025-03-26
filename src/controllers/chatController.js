import { getChatResponse } from '../services/aiService.js';
import logger from '../utils/logger.js';

// Global conversation history for this session.
// In production, you'd store per-user session data instead.
let conversationHistory = []; // Each element: { role: 'user' or 'assistant', content: string }

export async function sendMessage(req, res, next) {
  try {
    logger.debug('chatController.sendMessage() invoked');
    const { message } = req.body;
    if (!message) {
      logger.warn('No message provided in request body');
      return res.status(400).json({ error: 'Message is required.' });
    }
    
    // Append the new user message to the conversation history
    conversationHistory.push({ role: 'user', content: message });
    // Keep only the last 5 messages (if over 5, slice off the older ones)
    if (conversationHistory.length > 5) {
      conversationHistory = conversationHistory.slice(-5);
    }
    
    // Build the messages array: start with a system prompt then add conversation history
    const systemPrompt = { role: 'system', content: "You are a fun and loving casual ai assistant, you are aware that you are an ai however you dont sound like an ai you like to act very humanlike and have a good time." };
    const messagesToSend = [systemPrompt, ...conversationHistory];
    
    logger.info(`Sending messages to AI:\n${JSON.stringify(messagesToSend, null, 2)}`);
    
    // Get the AI response
    const aiResponse = await getChatResponse(messagesToSend);
    logger.info(`AI Response: ${aiResponse}`);
    
    // Append AI response to conversation history
    conversationHistory.push({ role: 'assistant', content: aiResponse });
    if (conversationHistory.length > 5) {
      conversationHistory = conversationHistory.slice(-5);
    }
    
    res.json({ response: aiResponse });
  } catch (error) {
    logger.error(`Error in chatController.sendMessage(): ${error.stack}`);
    next(error);
  }
}
