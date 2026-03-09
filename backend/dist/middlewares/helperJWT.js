"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWT = exports.generateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateJWT = (data) => {
    return jsonwebtoken_1.default.sign(data, process.env.JWT_SECRET || "");
};
exports.generateJWT = generateJWT;
const verifyJWT = (token) => {
    const data = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "");
    return { id: data.id, email: data.email };
};
exports.verifyJWT = verifyJWT;
//# sourceMappingURL=helperJWT.js.map