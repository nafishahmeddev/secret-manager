import User from "@app/db/models/user";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

export type AccessTokenPayload = JwtPayload & {
  user: {
    id: string;
    email: string;
  };
};

export default class TokenHelper {
  static generateAccessToken(
    user: User,
    expiresIn: SignOptions["expiresIn"] = "12h"
  ) {
    const secret: string = process.env.JWT_SECRET_ACCESS_TOKEN || "";
    const payload: AccessTokenPayload = {
      user: {
        id: user.id,
        email: user.email,
      }
    };
    const signOptions: SignOptions = { expiresIn: expiresIn };
    const token = jwt.sign(payload, secret, signOptions);
    return token;
  }

  static generateTokens(
    user: User,
    expiresIn: SignOptions["expiresIn"] = "12h"
  ) {
    const accessToken: string = TokenHelper.generateAccessToken(
      user,
      expiresIn
    );

    return {
      accessToken: accessToken,
    };
  }

  static validateAccessToken(
    accessToken: string
  ): AccessTokenPayload | undefined {
    const secret: string = process.env.JWT_SECRET_ACCESS_TOKEN || "";
    try {
      const validated = jwt.verify(accessToken, secret) as AccessTokenPayload;
      return validated;
    } catch {
      return undefined;
    }
  }
}