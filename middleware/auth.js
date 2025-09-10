const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1]; // Bearer <token>
    if (!token) return res.status(401).json({ message: "No token, authorization denied" });

    try {
        const decoded = jwt.verify(token, "your_jwt_secret"); // use .env in production
        req.user = decoded; // attach user info to request
        next();
    } catch (err) {
        res.status(401).json({ message: "Token is not valid" });
    }
};

module.exports = auth;
