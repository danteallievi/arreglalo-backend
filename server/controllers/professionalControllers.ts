import { Response } from "express";

import { RequestAuth } from "../../interfaces/auth/requestAuth";
import Professional from "../../DB/models/professional";
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

const deleteProfessionalProfile = async (
  req: RequestAuth,
  res: Response,
  next
) => {
  const { id } = req.userData;
  try {
    const professionalToRemove = await Professional.findByIdAndDelete(id);

    if (!professionalToRemove) {
      const error = new CustomError("Professional not found.");
      error.code = 404;
      next(error);
      return;
    }
    res.status(200).json({ message: "Professional deleted." });
  } catch {
    const error = new Error("Error deleting the professional.");
    next(error);
  }
};

const updateProfessionalProfile = async (
  req: RequestAuth,
  res: Response,
  next
) => {
  const { id: userId } = req.userData;

  try {
    const professional = await Professional.findByIdAndUpdate(
      userId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!professional) {
      const error = new CustomError("Professional not found.");
      error.code = 404;
      next(error);
      return;
    }

    res.status(200).json(professional);
  } catch {
    const error = new Error("Error updating the professional profile.");
    next(error);
  }
};

const getProfessionalClients = async (
  req: RequestAuth,
  res: Response,
  next
) => {
  const { id: professionalID } = req.userData;
  try {
    const professionalFound = await Professional.findById(
      professionalID
    ).populate("clients");

    if (!professionalFound) {
      const error = new CustomError("Professional not found.");
      error.code = 404;
      next(error);
      return;
    }

    return res.json(professionalFound).status(200);
  } catch {
    const error = new CustomError("Error getting the professional clients.");
    error.code = 500;
    next(error);
  }
};

export {
  getProfessionals,
  getProfessional,
  getProfessionalClients,
  deleteProfessionalProfile,
  updateProfessionalProfile,
};
