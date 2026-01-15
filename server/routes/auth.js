import express from 'express';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Authenticator from '../controllers/Authenticator.js';

const router = express.Router();
dotenv.config();

/**
 * Signup route
 * Returns token in JSON for localStorage
 */
router.post('/signup', async (req, res) => {
	const { username, email, password } = req.body;

	if (!username || !email || !password) {
		return res.status(400).json({ error: 'All fields are required' });
	}

	try {
		const existing = await User.findOne({ email });
		if (existing) return res.status(400).json({ error: 'Email already exists' });

		const hash = await Authenticator.returnHash(password);

		const user = await User.create({
			username,
			email,
			passwordHash: hash,
			calendars: []
		});

		// Generate JWT token
		const token = Authenticator.returnToken(user._id);

		// Return token and user in JSON
		res.json({
			token,
			user: { _id: user._id, username: user.username, email: user.email }
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Error creating user' });
	}
});

/**
 * Login route
 * Returns token in JSON for localStorage
 */
router.post('/login', async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email });
		if (!user) return res.status(401).json({ error: 'Invalid email or password' });

		const valid = await Authenticator.verifyPassword(password, user.passwordHash);
		if (!valid) return res.status(401).json({ error: 'Invalid email or password' });

		const token = Authenticator.returnToken(user._id);

		res.json({
			token,
			user: { _id: user._id, username: user.username, email: user.email }
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Error logging in' });
	}
});

export default router;
