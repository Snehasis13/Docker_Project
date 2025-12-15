import express from 'express';
import logger from './config/logger';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
    
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: { write: msg => logger.info(msg.trim()) } }));
app.use(cookieParser());

app.get('/', (req, res) => {
    logger.info('Yoo... endpoint was hit');
  res.send('Hello, World!');
});

export default app;
