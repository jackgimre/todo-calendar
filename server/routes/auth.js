import express from 'express';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Authenticator from '../controllers/Authenticator.js';

const router = express.Router();
dotenv.config();
/**
 * Signup route
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

		const token = Authenticator.returnToken(user._id);

		// Set HTTP-only cookie
		res.cookie('token', token, {
			httpOnly: true,
			sameSite: 'none',
			secure: true, // must be true on HTTPS (production)
			maxAge: 24 * 60 * 60 * 1000
		});

		res.json({ user: { _id: user._id, username: user.username, email: user.email } });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Error creating user' });
	}
});

/**
 * Login route
 */
router.post('/login', async (req, res) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email });
	if (!user) return res.status(401).json({ error: 'Invalid email or password' });

	const valid = await Authenticator.verifyPassword(password, user.passwordHash);
	if (!valid) return res.status(401).json({ error: 'Invalid email or password' });

	const token = Authenticator.returnToken(user._id);

	// Cookie setup for localhost HTTP
	res.cookie('token', token, {
		httpOnly: true,
		sameSite: 'none',
		secure: true, // must be true on HTTPS (production)
		maxAge: 24 * 60 * 60 * 1000
	});

	res.json({ user: { _id: user._id, username: user.username, email: user.email } });
});

/**
 * Logout route
 */
router.post('/logout', (req, res) => {
	res.clearCookie('token', {
		httpOnly: true,
		sameSite: 'none',
		secure: true
	});
	res.json({ success: true });
});

export default router;
