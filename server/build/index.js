"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var dotenv_1 = __importDefault(require("dotenv"));
var router_1 = __importDefault(require("./router"));
var cors_1 = __importDefault(require("cors"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
var app = (0, express_1.default)();
var port = process.env.PORT;
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
var CLIENT_URL = process.env.CLIENT_URL;
app.use((0, cors_1.default)({
    credentials: true,
    origin: CLIENT_URL,
}));
app.use((0, cookie_parser_1.default)());
app.use("/", router_1.default);
app.listen(port, function () {
    console.log("server has been started on port ".concat(port));
});
