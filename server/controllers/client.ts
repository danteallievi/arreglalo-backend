import { Response } from "express";

import { RequestAuth } from "../../interfaces/auth/requestAuth";
import CustomError from "../../interfaces/error/customError";
import Client from "../../DB/models/client";
import Professional from "../../DB/models/professional";

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

const hireProfessional = async (req: RequestAuth, res: Response, next) => {
  const { id: clientID } = req.userData;
  const { id: professionalToHireID } = req.params;

  try {
    const professionalToHire = await Professional.findOneAndUpdate(
      { _id: professionalToHireID },
      { $push: { clients: clientID } }
    );
    const client = await Client.findOneAndUpdate(
      { _id: clientID },
      { $push: { professionals: professionalToHireID } }
    );

    if (!professionalToHire) {
      const error = new CustomError("Professional not found.");
      error.code = 404;
      next(error);
      return;
    }

    if (!client) {
      const error = new CustomError("Client not found.");
      error.code = 404;
      next(error);
      return;
    }

    res.status(200).json(professionalToHire);
  } catch {
    const error = new Error("Error hiring the professional.");
    next(error);
  }
};

const getClient = async (req: RequestAuth, res: Response, next) => {
  const { id } = req.params;
  try {
    const client = await Client.findById(id);

    if (!client) {
      const error = new CustomError("Client not found.");
      error.code = 404;
      next(error);
      return;
    }

    res.status(200).json(client);
  } catch {
    const error = new Error("Error loading the client.");
    next(error);
  }
};

const ejectProfessional = async (req, res, next) => {
  const { id: clientID } = req.userData;
  const { id: professionalToEjectID } = req.params;

  try {
    const professionalToEject = await Professional.findOneAndUpdate(
      { _id: professionalToEjectID },
      { $pull: { clients: clientID } }
    );
    const client = await Client.findOneAndUpdate(
      { _id: clientID },
      { $pull: { professionals: professionalToEjectID } }
    );

    if (!professionalToEject) {
      const error = new CustomError("Professional not found.");
      error.code = 404;
      next(error);
      return;
    }

    if (!client) {
      const error = new CustomError("Client not found.");
      error.code = 404;
      next(error);
      return;
    }

    res.status(200).json(professionalToEject);
  } catch {
    const error = new Error("Error ejecting the professional.");
    next(error);
  }
};

export {
  getClients,
  getClient,
  getClientProfessionals,
  hireProfessional,
  ejectProfessional,
};
