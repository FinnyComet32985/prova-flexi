import { Router } from "express";
import {
    fisioterapistaRegister,
    fisioterapistaLogin,
    fisioterapistaGetPazientiByFisioterapistaJWT,
} from "../models/Fisioterapista";
import { Request, Response } from "express";
import { authenticateJWT } from "../middleware/authenticateJWT";

export const fisioterapistaRouter = Router();

// Endpoint per la registrazione
fisioterapistaRouter.post("/register", async (req, res) => {
    const { nome, cognome, email, password } = req.body;

    try {
        const token = await fisioterapistaRegister(
            nome,
            cognome,
            email,
            password
        );
        res.status(201).json({ message: "Registrazione completata", token });
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

// Endpoint per il login
fisioterapistaRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const token = await fisioterapistaLogin(email, password);
        res.json({ token });
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

fisioterapistaRouter.get(
    "/pazienti",
    authenticateJWT,
    async (req: Request, res: Response) => {
        try {
            const fisioterapistaJWT = req.body.jwtPayload as string;

            const pazienti = await fisioterapistaGetPazientiByFisioterapistaJWT(
                fisioterapistaJWT
            );
            res.status(200).json(pazienti);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: "Errore interno del server" });
            }
        }
    }
);

fisioterapistaRouter.get("/test", (req, res) => {
    console.log("test");
});
