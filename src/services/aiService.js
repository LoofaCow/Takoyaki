import 'dotenv/config';
import { Configuration, OpenAIApi } from 'openai';
import logger from '../utils/logger.js';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
  basePath: process.env.OPENAI_API_BASE_PATH || 'https://api.featherless.ai/v1'
});
const openai = new OpenAIApi(configuration);

export async function getChatResponse(messages) {
  const rawPrompt = JSON.stringify(messages, null, 2);
  logger.debug(`Constructed raw prompt:\n${rawPrompt}`);
  console.log("DEBUG: Raw prompt:\n", rawPrompt);
  
  try {
    const response = await openai.createChatCompletion({
      model: 'mistralai/Mistral-Nemo-Instruct-2407', 
      messages,
      max_tokens: 4096,
      temperature: 1.32,
    });
    
    const apiResponse = JSON.stringify(response.data, null, 2);
    logger.debug(`Received API response:\n${apiResponse}`);
    console.log("DEBUG: API response:\n", apiResponse);
    
    const aiMessage = response.data.choices[0].message.content.trim();
    logger.info(`Extracted AI message: ${aiMessage}`);
    return aiMessage;
  } catch (error) {
    logger.error(`Error in getChatResponse: ${error.stack}`);
    console.error("Error in getChatResponse:", error);
    return "Sorry, something went wrong while processing your message.";
  }
}
