"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var generate_token_1 = __importDefault(require("./generate-token"));
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var prisma_client_1 = __importDefault(require("../prisma-client"));
exports.default = new /** @class */ (function () {
    function AuthController() {
    }
    AuthController.prototype.signup = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, email, password, username, existingUser, hashedPassword, data, user, token, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        _a = req.body, email = _a.email, password = _a.password, username = _a.username;
                        return [4 /*yield*/, prisma_client_1.default.user.findFirst({ where: { email: email } })];
                    case 1:
                        existingUser = _b.sent();
                        console.log(existingUser);
                        if (existingUser) {
                            return [2 /*return*/, res.json({ message: "User already exists" })];
                        }
                        return [4 /*yield*/, bcryptjs_1.default.hash(password, 12)];
                    case 2:
                        hashedPassword = _b.sent();
                        data = { email: email, password: hashedPassword, username: username };
                        return [4 /*yield*/, prisma_client_1.default.user.create({ data: data })];
                    case 3:
                        user = _b.sent();
                        token = (0, generate_token_1.default)(user.id);
                        res.cookie("token", token, {
                            withCredentials: true,
                            httpOnly: false,
                        });
                        res
                            .status(201)
                            .json({ message: "User signed in successfully", success: true, user: user });
                        next();
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _b.sent();
                        console.error(error_1);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    ;
    AuthController.prototype.login = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, email, password, user, auth, token, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        _a = req.body, email = _a.email, password = _a.password;
                        if (!email || !password) {
                            return [2 /*return*/, res.json({ message: 'All fields are required' })];
                        }
                        return [4 /*yield*/, prisma_client_1.default.user.findUnique({ where: { email: email } })];
                    case 1:
                        user = _b.sent();
                        if (!user) {
                            return [2 /*return*/, res.json({ message: 'Incorrect password or email' })];
                        }
                        return [4 /*yield*/, bcryptjs_1.default.compare(password, user.password)];
                    case 2:
                        auth = _b.sent();
                        if (!auth) {
                            return [2 /*return*/, res.json({ message: 'Incorrect password or email' })];
                        }
                        token = (0, generate_token_1.default)(user.id);
                        res.cookie("token", token, {
                            withCredentials: true,
                            httpOnly: false,
                        });
                        res.status(201).json({ message: "User logged in successfully", success: true });
                        next();
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _b.sent();
                        console.error(error_2);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AuthController.prototype.userVerification = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var token;
            var _this = this;
            return __generator(this, function (_a) {
                token = req.cookies.token;
                if (!token) {
                    return [2 /*return*/, res.json({ status: false })];
                }
                jsonwebtoken_1.default.verify(token, process.env.TOKEN_KEY, function (err, data) { return __awaiter(_this, void 0, void 0, function () {
                    var user;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!err) return [3 /*break*/, 1];
                                return [2 /*return*/, res.json({ status: false })];
                            case 1: return [4 /*yield*/, prisma_client_1.default.user.findUnique({ where: { id: data.id } })];
                            case 2:
                                user = _a.sent();
                                if (user)
                                    return [2 /*return*/, res.json({ status: true, user: user.username })];
                                else
                                    return [2 /*return*/, res.json({ status: false })];
                                _a.label = 3;
                            case 3: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    return AuthController;
}());
