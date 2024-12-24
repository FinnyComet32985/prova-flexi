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
const express_1 = require("express");
const Fisioterapista_ts_1 = __importDefault(require("../models/Fisioterapista.ts"));
const authenticateJWT_1 = require("../middleware/authenticateJWT");
const router = (0, express_1.Router)();
// Endpoint per la registrazione
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nome, cognome, email, password } = req.body;
    try {
        const token = yield Fisioterapista_ts_1.default.register(nome, cognome, email, password);
        res.status(201).json({ message: "Registrazione completata", token });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}));
// Endpoint per il login
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const token = yield Fisioterapista_ts_1.default.login(email, password);
        res.json({ token });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}));
router.get("/pazienti", authenticateJWT_1.authenticateJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fisioterapistaJWT = req.body.jwtPayload;
        const pazienti = yield Fisioterapista_ts_1.default.getPazientiByFisioterapistaJWT(fisioterapistaJWT);
        res.status(200).json(pazienti);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "Errore interno del server" });
        }
    }
}));
exports.default = router;
