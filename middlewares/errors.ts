/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import chalk from "chalk";
import { ValidationError } from "express-validation";
import debug from "debug";
import IError from "../interfaces/error/error";

export const notFoundErrorHandler = (req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
};

export const generalErrorHandler = (error: IError, req, res, next) => {
  debug(chalk.red(`Some error happens: ${error.message}`));
  if (error instanceof ValidationError) {
    error.code = 400;
    error.message = "Bad request";
  }
  const message = error.code ? error.message : "General error";
  res.status(error.code || 500).json({ error: message });
};
