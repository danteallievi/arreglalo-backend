const mongoose = require("mongoose");
const debug = require("debug")("arreglalo:server");
const chalk = require("chalk");

export const initializeDB = (stringDB) =>
  new Promise<void>((resolve, reject) => {
    mongoose.set("debug", false);
    mongoose.set("toJSON", {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret._id;
        delete ret.__v;
      },
    });

    mongoose.connect(stringDB, (error) => {
      if (error) {
        debug(chalk.red("The database could not be started", error.message));
        reject();
        return;
      }
      debug(chalk.green("The database is connected"));
      resolve();
    });

    mongoose.connection.on("close", () => {
      debug(chalk.yellow("DB disconnected"));
    });
  });
