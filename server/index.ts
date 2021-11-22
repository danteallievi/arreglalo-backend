const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const debug = require("debug")("Arreglalo:server");
const chalk = require("chalk");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const initializeServer = (port) =>
  new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      debug(
        chalk.green(`Listening ${port} port
http://localhost:${port}`)
      );
      resolve(server);
    });
    server.on("error", (error) => {
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

export = { initializeServer };
