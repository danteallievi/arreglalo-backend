import dotenv from "dotenv";

import initializeDB from "./DB/index.js";
import { initializeServer } from "./server/index.js";

dotenv.config();

const PORT = process.env.PORT ?? 5000;

(async () => {
  try {
    await initializeDB(process.env.DB_STRING);
    await initializeServer(PORT);
  } catch (error) {
    process.exit(1);
  }
})();
