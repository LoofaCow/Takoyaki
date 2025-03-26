import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import logger from './utils/logger.js';

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(morgan('dev')); // HTTP request logging

app.get('/', (req, res) => {
  logger.info('Received GET request at /');
  res.send('Hello, Takoyaki v1 is live!');
});

// Mount chat routes
import chatRoutes from './routes/chatRoutes.js';
app.use('/chat', chatRoutes);

// Global error handler
app.use((err, req, res, next) => {
  logger.error(`Global Error Handler: ${err.stack}`);
  res.status(500).json({ error: 'Something broke!' });
});

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
