import express from "express";
import cors from "cors";
import { fisioterapistaRouter } from "./routes/fisioterapistaRouter";

const app = express();
const PORT = process.env.PORT || 1337;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/fisioterapisti", fisioterapistaRouter);

// Avvio del server
app.listen(PORT, () => {
    console.log(`Server in ascolto sulla porta ${PORT}`);
});
