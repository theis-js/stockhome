import type {NextFunction, Request, Response} from "express";
import {type JWTPayload, jwtVerify, SignJWT} from "jose";
import env from "dotenv";

env.config();
const secret = new TextEncoder().encode(process.env.SECRET_KEY);

export type AuthTokenPayload = JWTPayload & {
    username: string;
};

declare module "express-serve-static-core" {
    interface Request {
        user?: AuthTokenPayload;
    }
}

export async function generateToken(payload: AuthTokenPayload) {
    return await new SignJWT(payload)
        .setProtectedHeader({alg: "HS256"})
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(secret);
}

export async function authenticate(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) return res.sendStatus(401);

    const {payload} = await jwtVerify<AuthTokenPayload>(token, secret);
    req.user = payload;

    next();
}