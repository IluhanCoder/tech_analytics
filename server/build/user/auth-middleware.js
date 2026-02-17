"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = authMiddleware;
async function authMiddleware(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(401).send({ message: "user is not authorised" });
    }
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
    if (!token) {
        return res.status(401).send({ message: "user is not authorised" });
    }
    next();
}
