import { NextFunction, Request, Response } from 'express';

export default async function authMiddleware(req: Request, res:Response, next: NextFunction) {
    if(!req.headers["authorization"]) return res.status(401).send({message: "user is not authorised"});
    else next();
}