/* eslint-disable import/first */
import dotenv from "dotenv";

dotenv.config();

import initializeDB from "./DB/index.js";
import { initializeServer } from "./server/index.js";

const PORT = process.env.PORT ?? 5000;

(async () => {
  try {
    await initializeDB(process.env.DB_STRING);
    await initializeServer(PORT);
  } catch (error) {
    process.exit(1);
  }
})();
