import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const returnHash = async (password) => {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
}

const verifyPassword = async (password, hash) => {
    const match = await bcrypt.compare(password, hash);
    return match;
}

const returnToken = (userID) => {
    const token = jwt.sign({ id: userID }, process.env.JWT_SECRET, { expiresIn: "1d" });
    return token;
}

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch {
        res.status(401).json({ error: "Invalid token" });
    }
};

export default {
    returnHash,
    verifyPassword,
    returnToken,
    authMiddleware
}