import { ForbiddenError, UnauthorizedError } from "../helpers";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { base64Decode } from "../helpers/base64";

export const decodeToken = (token: string) => {
  const parts = token.split(" ");
  let data = null;

  if (parts.length === 2) {
    const credentials = parts[1];
    jwt.verify(
      credentials,
      process.env.JWT_SECRET || "tokenSecret",
      (err, decoded) => {
        if (err) null;
        data = decoded;
      }
    );
    return data;
  }

  jwt.verify(
    parts[0],
    process.env.JWT_SECRET || "tokenSecret",
    (err, decoded) => {
      if (err) return null;
      data = decoded;
    }
  );
  return data;
};

export const verifyToken = (authorization: string) => {
  const parts = authorization.split(" ");
  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return {
      error: "Invalid scheme",
    };
  }

  let tokenError = "";

  jwt.verify(token, process.env.JWT_SECRET || "tokenSecret", (err) => {
    if (err) {
      tokenError = err.message;
    }
  });

  if (tokenError) {
    throw new ForbiddenError();
  }

  return {
    message: "Token is valid",
  };
};

export const verifyAuthentication = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;

  if (!authorization) {
    throw new UnauthorizedError();
  }

  const parts = authorization.split(" ");
  const [scheme, token] = parts;
  if (scheme && !/^Bearer$/i.test(scheme) && !/^Basic$/i.test(scheme)) {
    throw new ForbiddenError();
  }

  if (scheme === "Basic") {
    const decoded = base64Decode(token).split(":");
    const [username, password] = decoded;

    if (
      username !== process.env.BASIC_AUTH_USERNAME ||
      password !== process.env.BASIC_AUTH_PASSWORD
    ) {
      throw new ForbiddenError();
    }

    return next();
  } else {
    const { error } = verifyToken(authorization);
    const decodedToken = decodeToken(token);

    if (!decodedToken) {
      throw new ForbiddenError(`${error}`);
    }
    return next();
  }
};
