import bcrypt from "bcrypt";

import Professional from "../../DB/models/professional";

const createProfessional = async (req, res, next) => {
  const { password, ...everythingWithoutPassword } = req.body;
  try {
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
