const jwt = require("jsonwebtoken");
const User = require("../models/users");

module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(":")[1].trim();

        if (!token)
            return res
                .status(403)
                .json({
                    message: "Authorization Revoked . Please provide valid auth-headers",
                });

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!decoded) return res.status(403).json({ message: "Token Error" });

        const user = await User.findOne(
            { email: decoded.email },
            { _id: 0, password: 0, tokens: 0 }
        );
        req.user = user;

        next();
    } catch (error) {
        console.log(error)
        return res
            .status(403)
            .json({
                message: "Authorization Revoked . Please provide valid auth-headers",
            });
    }
};