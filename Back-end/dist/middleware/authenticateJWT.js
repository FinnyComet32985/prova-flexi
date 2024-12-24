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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Chiave segreta per verificare il token
const JWT_SECRET = "secret_key";
const authenticateJWT = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ error: "Token mancante o non valido" });
        return;
    }
    const token = authHeader.split(" ")[1];
    try {
        jsonwebtoken_1.default.verify(token, JWT_SECRET, {
            ignoreExpiration: false,
        });
        req.body.jwtPayload = token;
        next();
    }
    catch (error) {
        if (error.name === "TokenExpiredError") {
            res.status(401).json({ error: "Token scaduto" });
            return;
        }
        res.status(403).json({ error: "Token non valido" });
    }
});
exports.authenticateJWT = authenticateJWT;
