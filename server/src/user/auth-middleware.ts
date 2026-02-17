import { NextFunction, Request, Response } from 'express';

export default async function authMiddleware(req: Request, res:Response, next: NextFunction) {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(401).send({message: "user is not authorised"});
    }
    
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
    if (!token) {
        return res.status(401).send({message: "user is not authorised"});
    }
    
    next();
}