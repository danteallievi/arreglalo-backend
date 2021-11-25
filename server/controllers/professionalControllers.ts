import { Response } from "express";
import { RequestAuth } from "../../interfaces/auth/requestAuth";
import Professional from "../../DB/models/professional";
import Client from "../../DB/models/client";
import CustomError from "../../interfaces/error/customError";

const getProfessionals = async (req, res: Response, next) => {
  try {
    const allProfessionals = await Professional.find();
    res.status(200).json(allProfessionals);
  } catch {
    const error = new Error("Error loading the professionals.");
    next(error);
  }
};

const getProfessional = async (req: RequestAuth, res: Response, next) => {
  const { id } = req.params;
  try {
    const professional = await Professional.findById(id);

    if (!professional) {
      const error = new CustomError("Professional not found.");
      error.code = 404;
      next(error);
      return;
    }

    res.status(200).json(professional);
  } catch {
    const error = new Error("Error loading the professionals.");
    next(error);
  }
};

const hireProfessional = async (req: RequestAuth, res: Response, next) => {
  const { id: clientID } = req.userData;
  const { id: professionalToHireID } = req.params;

  try {
    const professionalToHire = await Professional.findById(
      professionalToHireID
    );
    const client = await Client.findById(clientID);

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

    client.professionals.push(professionalToHire.id);
    professionalToHire.clients.push(client.id);

    await client.save();
    await professionalToHire.save();

    res.status(200).json(professionalToHire);
  } catch {
    const error = new Error("Error hiring the professional.");
    next(error);
  }
};

const getProfessionalClients = async (
  req: RequestAuth,
  res: Response,
  next
) => {
  const { id: myProfessionalID } = req.userData;
  try {
    const myProfessional = await Professional.findById(
      myProfessionalID
    ).populate("clients");

    if (!myProfessional) {
      const error = new CustomError("Professional not found.");
      error.code = 404;
      next(error);
      return;
    }

    return res.json(myProfessional).status(200);
  } catch {
    const error = new CustomError("Error getting the clients.");
    error.code = 500;
    next(error);
  }
};

export {
  getProfessionals,
  getProfessional,
  getProfessionalClients,
  hireProfessional,
};
