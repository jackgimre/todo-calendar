import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Hash a password
 */
const returnHash = async (password) => {
	const saltRounds = 10;
	return bcrypt.hash(password, saltRounds);
};

/**
 * Verify password against hash
 */
const verifyPassword = async (password, hash) => {
	return bcrypt.compare(password, hash);
};

/**
 * Create JWT
 */
const returnToken = (userID) => {
	return jwt.sign({ id: userID }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

/**
 * Token-based auth middleware for Authorization header
 */
export const authMiddleware = async (req, res, next) => {
	// Expect header: Authorization: Bearer <token>
	const authHeader = req.headers.authorization;
	if (!authHeader) {
		return res.status(401).json({ error: 'Not authenticated' });
	}

	const token = authHeader.split(' ')[1]; // "Bearer <token>"

	if (!token) {
		return res.status(401).json({ error: 'Not authenticated' });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(decoded.id).populate('calendars');
		if (!user) return res.status(401).json({ error: 'User not found' });

		req.user = user;
		next();
	} catch (err) {
		console.error('JWT verify failed:', err.message);
		return res.status(401).json({ error: 'Token invalid' });
	}
};

export default {
	returnHash,
	verifyPassword,
	returnToken,
	authMiddleware
};
