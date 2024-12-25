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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
exports.fisioterapistaGetPazientiByFisioterapistaJWT = exports.fisioterapistaLogin = exports.fisioterapistaRegister = void 0;
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var connection_1 = __importDefault(require("../database/connection"));
var fisioterapistaRegister = function (nome, cognome, email, password) { return __awaiter(void 0, void 0, void 0, function () {
    var hashedPassword, result, fisioterapistaId, token;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, bcryptjs_1.default.hash(password, 10)];
            case 1:
                hashedPassword = _a.sent();
                return [4 /*yield*/, connection_1.default.query("INSERT INTO Fisioterapisti (nome, cognome, email, password) VALUES (?, ?, ?, ?)", [nome, cognome, email, hashedPassword])];
            case 2:
                result = (_a.sent())[0];
                fisioterapistaId = result.insertId;
                token = jsonwebtoken_1.default.sign({ id: fisioterapistaId }, "secret_key", {
                    expiresIn: "1h",
                });
                return [4 /*yield*/, connection_1.default.query("UPDATE Fisioterapisti SET jwt = ? WHERE id = ?", [
                        token,
                        fisioterapistaId,
                    ])];
            case 3:
                _a.sent();
                return [2 /*return*/, token];
        }
    });
}); };
exports.fisioterapistaRegister = fisioterapistaRegister;
var fisioterapistaLogin = function (email, password) { return __awaiter(void 0, void 0, void 0, function () {
    var rows, fisioterapista, isValidPassword, token;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, connection_1.default.query("SELECT * FROM Fisioterapisti WHERE email = ?", [email])];
            case 1:
                rows = (_a.sent())[0];
                if (rows.length === 0)
                    throw new Error("Utente non trovato");
                fisioterapista = rows[0];
                return [4 /*yield*/, bcryptjs_1.default.compare(password, fisioterapista.password)];
            case 2:
                isValidPassword = _a.sent();
                if (!isValidPassword)
                    throw new Error("Password errata");
                token = jsonwebtoken_1.default.sign({ id: fisioterapista.id }, "secret_key", {
                    expiresIn: "1h",
                });
                return [4 /*yield*/, connection_1.default.query("UPDATE Fisioterapisti SET jwt = ? WHERE id = ?", [
                        token,
                        fisioterapista.id,
                    ])];
            case 3:
                _a.sent();
                return [2 /*return*/, token];
        }
    });
}); };
exports.fisioterapistaLogin = fisioterapistaLogin;
var fisioterapistaGetPazientiByFisioterapistaJWT = function (fisioterapistaJWT) { return __awaiter(void 0, void 0, void 0, function () {
    var rows;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, connection_1.default.query("SELECT Pazienti.* \n            FROM Fisioterapisti JOIN Trattamenti ON Fisioterapisti.id = Trattamenti.fisioterapista_id \n            JOIN Pazienti ON Pazienti.id = Trattamenti.paziente_id \n            WHERE Fisioterapisti.jwt = ?", [fisioterapistaJWT])];
            case 1:
                rows = (_a.sent())[0];
                return [2 /*return*/, rows];
        }
    });
}); };
exports.fisioterapistaGetPazientiByFisioterapistaJWT = fisioterapistaGetPazientiByFisioterapistaJWT;
