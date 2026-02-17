"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const generate_token_1 = __importDefault(require("./generate-token"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_client_1 = __importDefault(require("../prisma-client"));
exports.default = new class AuthController {
    async signup(req, res, next) {
        try {
            const { email, password, username } = req.body;
            const existingUser = await prisma_client_1.default.user.findFirst({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ message: "User already exists" }).send();
            }
            const hashedPassword = await bcryptjs_1.default.hash(password, 12);
            const data = { email, password: hashedPassword, username };
            const user = await prisma_client_1.default.user.create({ data });
            const token = (0, generate_token_1.default)(user.id);
            res.cookie("token", token, {
                withCredentials: true,
                httpOnly: false,
            });
            res
                .status(201)
                .json({ message: "User signed in successfully", success: true, user, token }).send();
            next();
        }
        catch (error) {
            return res.status(500).send(error);
        }
    }
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.json({ message: 'All fields are required' }).send();
            }
            const user = await prisma_client_1.default.user.findUnique({ where: { email } });
            if (!user) {
                return res.json({ message: 'Incorrect password or email' }).send();
            }
            const auth = await bcryptjs_1.default.compare(password, user.password);
            if (!auth) {
                return res.json({ message: 'Incorrect password or email' }).send();
            }
            const token = (0, generate_token_1.default)(user.id);
            res.status(201).json(token).send();
            next();
        }
        catch (error) {
            console.error(error);
        }
    }
    async userVerification(req, res) {
        const { token } = req.body;
        if (!token) {
            return res.json({ status: false }).send();
        }
        jsonwebtoken_1.default.verify(token, process.env.TOKEN_KEY, async (err, data) => {
            if (err) {
                return res.json({ status: false }).send();
            }
            else {
                const user = await prisma_client_1.default.user.findUnique({ where: { id: data.id } });
                if (user)
                    return res.json({ status: true, user: user.username }).send();
                else
                    return res.json({ status: false }).send();
            }
        });
    }
};
