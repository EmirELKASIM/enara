"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const validateJWT = (req, res, next) => {
    const authorizationHeader = req.get('authorization');
    if (!authorizationHeader) {
        res.status(403).send("Authorization header was not provided");
        return;
    }
    const token = authorizationHeader.split(" ")[1];
    if (!token) {
        res.status(403).send("Bearer token not found");
        return;
    }
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "", async (err, payload) => {
        if (err) {
            res.status(403).send("Invalid token");
            return;
        }
        if (!payload) {
            res.status(403).send("Invalid token payload");
            return;
        }
        const userPayload = payload;
        const user = await userModel_1.default.findOne({ email: userPayload.email });
        req.user = user;
        next();
    });
};
exports.default = validateJWT;
//# sourceMappingURL=validateJWT.js.map