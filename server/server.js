import express from 'express';
import morgan from 'morgan';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import calendarRoutes from './routes/calendar.js';
import tasksRoutes from './routes/tasks.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();

const allowedOrigin = process.env.CLIENT_URL || 'https://todo-calendar-plum-kappa.vercel.app';

app.use(
	cors({
		origin: allowedOrigin, // exact frontend URL
		credentials: true, // allow cookies
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization']
	})
);

app.use(cookieParser());
app.use(express.json());

app.use(morgan('dev'));
app.use(express.json());

try {
	await mongoose.connect(process.env.MONGO_URI);
	console.log('MongoDB connected');
} catch (err) {
	console.error('MongoDB connection error:', err);
}

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/tasks', tasksRoutes);

app.get('/api', (req, res) => {
	res.json({ message: 'API is working' });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
