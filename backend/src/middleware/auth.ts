import TokenUtil from "@app/utils/token";
import { NextFunction, Request, Response } from "express";

export default function AuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token: string =
    req.headers["authorization"] || (req.query.authorization as string) || "";
  const validated = TokenUtil.validateAccessToken(token.split(" ")[1]);
  if (validated) {
    req.auth = validated.user;
    console.info("[AUTH]", "User authenticated", {
      userId: validated.user.id,
      email: validated.user.email,
    });
    next();
  } else {
    res.status(401).json({
      code: 401,
      message: "session_expired",
    });
  }
}