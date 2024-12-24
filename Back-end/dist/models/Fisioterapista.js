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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const connection_1 = __importDefault(require("../database/connection"));
class Fisioterapista {
    static register(nome, cognome, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            const [result] = yield connection_1.default.query("INSERT INTO Fisioterapisti (nome, cognome, email, password) VALUES (?, ?, ?, ?)", [nome, cognome, email, hashedPassword]);
            const fisioterapistaId = result.insertId;
            const token = jsonwebtoken_1.default.sign({ id: fisioterapistaId }, "secret_key", {
                expiresIn: "1h",
            });
            yield connection_1.default.query("UPDATE Fisioterapisti SET jwt = ? WHERE id = ?", [
                token,
                fisioterapistaId,
            ]);
            return token;
        });
    }
    static login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.default.query("SELECT * FROM Fisioterapisti WHERE email = ?", [email]);
            if (rows.length === 0)
                throw new Error("Utente non trovato");
            const fisioterapista = rows[0];
            const isValidPassword = yield bcrypt_1.default.compare(password, fisioterapista.password);
            if (!isValidPassword)
                throw new Error("Password errata");
            const token = jsonwebtoken_1.default.sign({ id: fisioterapista.id }, "secret_key", {
                expiresIn: "1h",
            });
            yield connection_1.default.query("UPDATE Fisioterapisti SET jwt = ? WHERE id = ?", [
                token,
                fisioterapista.id,
            ]);
            return token;
        });
    }
    static getPazientiByFisioterapistaJWT(fisioterapistaJWT) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.default.query(`SELECT Pazienti.* 
            FROM Fisioterapisti JOIN Trattamenti ON Fisioterapisti.id = Trattamenti.fisioterapista_id 
            JOIN Pazienti ON Pazienti.id = Trattamenti.paziente_id 
            WHERE Fisioterapisti.jwt = ?`, [fisioterapistaJWT]);
            return rows;
        });
    }
}
exports.default = Fisioterapista;
