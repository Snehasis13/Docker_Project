import express from 'express';
import logger from '#config/logger.js';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from '#routes/auth.routes.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));
app.use(cookieParser());

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  logger.info('Yoo... endpoint was hit');
  res.send('Hello, World!');
});

app.get('/health', (req,res) =>{
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString(), uptime : process.uptime()});
})

app.get('/api', (req,res) =>{
  res.status(200).json({message: 'Docker_project APi is running'});
})

export default app;
