import bcrypt from "bcrypt";

import Professional from "../../DB/models/professional";
import CustomError from "../../interfaces/error/customError";

const createProfessional = async (req, res, next) => {
  const { password, ...everythingWithoutPassword } = req.body;

  try {
    const mailTaken = await Professional.findOne({ email: req.body.email });
    if (mailTaken) {
      const error = new CustomError("Email already exist.");
      error.code = 403;
      next(error);
      return;
    }
    const newProfessional = await Professional.create({
      ...everythingWithoutPassword,
      password: await bcrypt.hash(password, 10),
    });
    res.status(201).json(newProfessional);
  } catch {
    const error = new Error("Error creating the professional");
    next(error);
  }
};

// eslint-disable-next-line import/prefer-default-export
export { createProfessional };
