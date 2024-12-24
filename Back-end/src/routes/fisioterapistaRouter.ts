import { Router } from "express";
import Fisioterapista from "../models/Fisioterapista.ts";
import { Request, Response } from "express";
import { authenticateJWT } from "../middleware/authenticateJWT";

const router = Router();

// Endpoint per la registrazione
router.post("/register", async (req, res) => {
    const { nome, cognome, email, password } = req.body;

    try {
        const token = await Fisioterapista.register(
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
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const token = await Fisioterapista.login(email, password);
        res.json({ token });
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

router.get(
    "/pazienti",
    authenticateJWT,
    async (req: Request, res: Response) => {
        try {
            const fisioterapistaJWT = req.body.jwtPayload as string;

            const pazienti =
                await Fisioterapista.getPazientiByFisioterapistaJWT(
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
export default router;
