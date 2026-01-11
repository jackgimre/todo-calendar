import express from "express";
import bcrypt from "bcrypt";
import Authenticator from "../controllers/Authenticator.js";
import User from "../models/User.js";

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    try {
        const passwordHash = await Authenticator.returnHash(password);
        const newUser = new User({ username, email, passwordHash });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
    if (error.code === 11000) { // Mongo duplicate key
        return res.status(400).json({ error: 'Email or username already exists' });
    }
    res.status(500).json({ error: 'Error creating user' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ error: "Invalid email or password" });

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return res.status(401).json({ error: "Invalid email or password" });

        const token = Authenticator.returnToken(user._id);
        res.json({ token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error logging in' });
    }
});

router.post('/check-login', Authenticator.authMiddleware, (req, res) => {
    res.json({ message: "User is logged in", userId: req.userId });
});

export default router;