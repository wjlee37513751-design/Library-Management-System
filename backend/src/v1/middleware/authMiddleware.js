const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

// Express-compatible middleware that verifies token from Authorization header
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ error: 'Token mangler' });
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload; // attach decoded payload for later use
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Ugyldig eller utgått token' });
    }
};

// administration check
const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Tilgang nekttet - kun administrator' });
    }
    next();
};

module.exports = { verifyToken, requireAdmin };