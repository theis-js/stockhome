import {jwtVerify, SignJWT} from "jose";
import env from "dotenv";

env.config();
const secret = new TextEncoder().encode(process.env.SECRET_KEY);

export async function generateToken(payload) {
  return await new SignJWT(payload)
      .setProtectedHeader({alg: "HS256"})
      .setIssuedAt()
      .setExpirationTime("24h") // Token valid for 24 hours
      .sign(secret);
}

export async function authenticate(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (token == null) return res.sendStatus(401); // No token present

  const { payload } = await jwtVerify(token, secret);
  req.user = payload;

  next();
}
