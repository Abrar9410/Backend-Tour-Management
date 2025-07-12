import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";

export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {

    try {
        const token = req.headers.authorization;

        if (!token) {
            throw new AppError(401, "Unauthorized Access!")
        };

        const verifiedToken = verifyToken(token, envVars.JWT_SECRET) as JwtPayload
        
        if (!authRoles.includes(verifiedToken.role)) {
            throw new AppError(403, "Forbidden!!! You are not permitted to view this route!")
        };
        
        req.user = verifiedToken;
        
        next();
    } catch (error) {
        next(error)
    }
};