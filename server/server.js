import express from 'express';
import morgan from 'morgan';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import calendarRoutes from './routes/calendar.js';
import tasksRoutes from './routes/tasks.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';

dotenv.config();
const app = express();

// Allowed frontend origins
const allowedOrigins = [process.env.CLIENT_URL, 'http://localhost:3000'];

// CORS middleware
app.use(
	cors({
		origin: function (origin, callback) {
			if (!origin) return callback(null, true); // server-to-server or same-origin
			if (allowedOrigins.includes(origin)) return callback(null, true);
			callback(new Error('Not allowed by CORS'));
		},
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization'] // still needed for Bearer tokens
	})
);

// Parse JSON
app.use(express.json());
app.use(morgan('dev'));

// MongoDB connection
try {
	await mongoose.connect(process.env.MONGO_URI);
	console.log('MongoDB connected');
} catch (err) {
	console.error('MongoDB connection error:', err);
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/tasks', tasksRoutes);

app.get('/api', (req, res) => {
	res.json({ message: 'API is working' });
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
