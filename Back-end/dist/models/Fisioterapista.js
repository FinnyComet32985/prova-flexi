import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../database/connection";
export const fisioterapistaRegister = async (nome, cognome, email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query("INSERT INTO Fisioterapisti (nome, cognome, email, password) VALUES (?, ?, ?, ?)", [nome, cognome, email, hashedPassword]);
    const fisioterapistaId = result.insertId;
    const token = jwt.sign({ id: fisioterapistaId }, "secret_key", {
        expiresIn: "1h",
    });
    await pool.query("UPDATE Fisioterapisti SET jwt = ? WHERE id = ?", [
        token,
        fisioterapistaId,
    ]);
    return token;
};
export const fisioterapistaLogin = async (email, password) => {
    const [rows] = await pool.query("SELECT * FROM Fisioterapisti WHERE email = ?", [email]);
    if (rows.length === 0)
        throw new Error("Utente non trovato");
    const fisioterapista = rows[0];
    const isValidPassword = await bcrypt.compare(password, fisioterapista.password);
    if (!isValidPassword)
        throw new Error("Password errata");
    const token = jwt.sign({ id: fisioterapista.id }, "secret_key", {
        expiresIn: "1h",
    });
    await pool.query("UPDATE Fisioterapisti SET jwt = ? WHERE id = ?", [
        token,
        fisioterapista.id,
    ]);
    return token;
};
export const fisioterapistaGetPazientiByFisioterapistaJWT = async (fisioterapistaJWT) => {
    const [rows] = await pool.query(`SELECT Pazienti.* 
            FROM Fisioterapisti JOIN Trattamenti ON Fisioterapisti.id = Trattamenti.fisioterapista_id 
            JOIN Pazienti ON Pazienti.id = Trattamenti.paziente_id 
            WHERE Fisioterapisti.jwt = ?`, [fisioterapistaJWT]);
    return rows;
};
