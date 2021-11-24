import jwt from "jsonwebtoken";
import express from "express";

import CustomError from "../interfaces/error/customError";
import UserData from "../interfaces/auth/userData";

declare namespace Express {
  export interface Request extends express.Request {
    userData?: UserData;
  }
}

const checkAuthorization = (req: Express.Request, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    const error = new CustomError("Unauthorized.");
    error.code = 401;
    next(error);
    return;
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    const error = new CustomError("Unauthorized.");
    error.code = 401;
    next(error);
    return;
  }
  try {
    const { id, name, surname, email } = jwt.verify(
      token,
      process.env.JWT_SECRET
    );
    req.userData = { id, name, surname, email };
    next();
  } catch {
    const error = new CustomError("Unauthorized.");
    error.code = 401;
    next(error);
  }
};

export default checkAuthorization;
