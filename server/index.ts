import express from "express";
import chalk from "chalk";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import Debug from "debug";

import { IError } from "../interfaces/error/error";

dotenv.config();
const debug = Debug("Arreglalo:server");

export const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

export const initializeServer = (port) =>
  new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      debug(
        chalk.green(`Listening ${port} port
http://localhost:${port}`)
      );
      resolve(server);
    });
    server.on("error", (error: IError) => {
      debug(chalk.red("There was an error starting the server."));
      if (error.code === "EADDRINUSE") {
        debug(chalk.red(`The port ${port} is already in use.`));
      }
      reject();
    });
    server.on("close", () => {
      debug(chalk.yellow("Server express disconnected."));
    });
  });

// export default { initializeServer, app };
