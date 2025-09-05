import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';


import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.routes.js';


const app = express();


// Security & utils
app.use(helmet());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// CORS: allow mobile app origin(s)
// app.use(
// cors({
// origin: [process.env.CLIENT_ORIGIN, 'exp://127.0.0.1:19000', 'http://localhost:5173'].filter(Boolean),
// credentials: true
// })
// );
app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, true); // allow all origins
    },
    credentials: true,
  })
);



// Basic rate limiter for auth routes
const authLimiter = rateLimit({
windowMs: 15 * 60 * 1000,
max: 100,
standardHeaders: true,
legacyHeaders: false
});
app.use('/api/auth', authLimiter);


// Routes
app.use('/api/auth', authRoutes);


// 404 & error
// app.use(notFound);
// app.use(errorHandler);


// Start
const PORT = process.env.PORT || 4000;
connectDB().then(() => {
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});