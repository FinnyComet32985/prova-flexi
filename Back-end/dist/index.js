"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const fisioterapistaRouter_ts_1 = __importDefault(require("./routes/fisioterapistaRouter.ts"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 1337;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use("/api/fisioterapisti", fisioterapistaRouter_ts_1.default);
// Avvio del server
app.listen(PORT, () => {
    console.log(`Server in ascolto sulla porta ${PORT}`);
});
