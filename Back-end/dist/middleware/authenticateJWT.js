import jwt from "jsonwebtoken";
// Chiave segreta per verificare il token
const JWT_SECRET = "secret_key";
export const authenticateJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ error: "Token mancante o non valido" });
        return;
    }
    const token = authHeader.split(" ")[1];
    try {
        jwt.verify(token, JWT_SECRET, {
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
};
