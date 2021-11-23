/* eslint-disable import/first */
import dotenv from "dotenv";

dotenv.config();
import debugFile from "debug";

const debug = debugFile("Arreglalo:index");
import initializeDB from "./DB/index.js";
import { initializeServer } from "./server/index.js";

const PORT = process.env.PORT ?? 5000;
debug(process.env.PORT);
debug(process.env);

(async () => {
  try {
    await initializeDB(process.env.DB_STRING);
    await initializeServer(+PORT);
  } catch (error) {
    process.exit(1);
  }
})();
