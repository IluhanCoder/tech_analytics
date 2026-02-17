import { CookieOptions, NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import generateToken from "./generate-token";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prismaClient from "../prisma-client";

export default new class AuthController {
    async signup (req: Request, res: Response, next: NextFunction) {
        try {
          const { email, password, username } = req.body;
          const existingUser = await prismaClient.user.findFirst({ where: {email} });
          if (existingUser) {
            return res.status(400).json({ message: "User already exists" }).send();
          }
          const hashedPassword = await bcrypt.hash(password, 12);
          const data = { email, password: hashedPassword, username };
          const user = await prismaClient.user.create({data});
          const token = generateToken(user.id);
          res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
          } as CookieOptions);
          res
            .status(201)
            .json({ message: "User signed in successfully", success: true, user, token }).send();
          next();
        } catch (error) {
          return res.status(500).send(error);
        }
      }

    async login (req: Request, res: Response, next: NextFunction) {
        try {
          const { email, password } = req.body;
          if(!email || !password ){
            return res.json({message:'All fields are required'}).send()
          }
          const user = await prismaClient.user.findUnique({where: { email }});
          if(!user){
            return res.json({message:'Incorrect password or email' }).send()
          }
          const auth = await bcrypt.compare(password,user.password)
          if (!auth) {
            return res.json({message:'Incorrect password or email' }).send()
          }
           const token = generateToken(user.id);
           res.status(201).json(token).send();
           next()
        } catch (error) {
          console.error(error);
        }
      }

      async userVerification (req: Request, res: Response) {
        const {token} = req.body;
        if (!token) {
          return res.json({ status: false }).send()
        }
        jwt.verify(token, process.env.TOKEN_KEY!, async (err: any, data: any) => {
          if (err) {
          return res.json({ status: false }).send()
          } else {
            const user = await prismaClient.user.findUnique({where: {id: data.id}})
            if (user) return res.json({ status: true, user: user.username }).send();
            else return res.json({ status: false }).send();
          }
        })
      }
}

