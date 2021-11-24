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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getClients = async (req, res, next) => {
  try {
    const allClients = await Client.find();
    res.status(200).json(allClients);
  } catch {
    const error = new Error("Error loading the clients.");
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

export { getProfessionals, getProfessional, getProfessionalClients };
