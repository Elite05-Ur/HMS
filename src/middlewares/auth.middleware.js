const jwt = require('jsonwebtoken')

// Check login user (Staff or Admin)
async function verifyToken(req, res, next) {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({ message: "Please Login First!" })
    }

    try {
        const decoded = jwt.verify(token, process.env.TOKEN)
        req.user = decoded
        next()
    } catch (err) {
        return res.status(401).json({ message: "Invalid or Expired Token!" })
    }
}

// Check if user is Staff (or Admin)
async function isStaff(req, res, next) {
    if (req.user.role !== 'staff' && req.user.role !== 'admin') {
        return res.status(403).json({ message: "Access Denied! Staff or Admin allowed." })
    }
    next()
}

// Check if user is Admin
async function isAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Access Denied! Only Admin allowed." })
    }
    next()
}

const isDoctor = (req, res, next) => {
    if (req.user && req.user.role === 'doctor') {
        next();
    } else {
        res.status(403).json({ message: "Access denied. Doctor role required." });
    }
};

// Teeno export hone zaroori hain!
module.exports = { verifyToken, isStaff, isAdmin, isDoctor }