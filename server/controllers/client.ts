import { Response } from "express";

import { RequestAuth } from "../../interfaces/auth/requestAuth";
import CustomError from "../../interfaces/error/customError";
import Client from "../../DB/models/client";

const getClients = async (req: RequestAuth, res: Response, next) => {
  try {
    const allClients = await Client.find();
    res.status(200).json(allClients);
  } catch {
    const error = new Error("Error loading the clients.");
    next(error);
  }
};

const getClientProfessionals = async (
  req: RequestAuth,
  res: Response,
  next
) => {
  const { id: clientID } = req.userData;
  try {
    const clientFound = await Client.findById(clientID).populate(
      "professionals"
    );

    if (!clientFound) {
      const error = new CustomError("Client not found.");
      error.code = 404;
      next(error);
      return;
    }

    return res.json(clientFound).status(200);
  } catch {
    const error = new CustomError("Error getting the client professionals.");
    error.code = 500;
    next(error);
  }
};

export { getClients, getClientProfessionals };
