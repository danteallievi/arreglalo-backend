require("dotenv").config();

const debug = require("debug")("Arreglalo:init");
const { initializeDB } = require("./DB/index");
const { initializeServer } = require("./server/index");

const PORT = process.env.PORT ?? 5000;
debug(process.env.PORT);

(async () => {
  try {
    await initializeDB(process.env.DB_STRING);
    await initializeServer(PORT);
  } catch (error) {
    process.exit(1);
  }
})();
