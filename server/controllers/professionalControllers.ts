import { Request, Response } from "express";
import Professional from "../../DB/models/professional";

const getProfessionals = async (req: Request, res: Response, next) => {
  try {
    const allProfessionals = await Professional.find();
    res.status(200).json(allProfessionals);
  } catch {
    const error = new Error("Error loading the users");
    next(error);
  }
};

// eslint-disable-next-line import/prefer-default-export
export { getProfessionals };
