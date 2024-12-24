import { Request, Response, NextFunction } from "express";
export declare const authenticateJWT: (req: Request, res: Response, next: NextFunction) => Promise<void>;
