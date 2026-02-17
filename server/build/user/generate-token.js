"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var generateToken = function (id) {
    var _a;
    return jsonwebtoken_1.default.sign({ id: id }, (_a = process.env.TOKEN_KEY) !== null && _a !== void 0 ? _a : "", {
        expiresIn: 3 * 24 * 60 * 60,
    });
};
exports.default = generateToken;
