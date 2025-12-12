const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ message: 'No token provided' });

    // Bearer <token>
    const bearer = token.split(' ');
    const tokenValue = bearer[1];

    jwt.verify(tokenValue, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Unauthorized' });
        req.userId = decoded.id;
        req.userRole = decoded.role;
        req.departmentId = decoded.department_id;
        next();
    });
};

const verifyRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.userRole)) {
            return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
        }
        next();
    };
};

module.exports = { verifyToken, verifyRole };
