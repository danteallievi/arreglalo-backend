import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import Client from "../../DB/models/client";
import Professional from "../../DB/models/professional";
import CustomError from "../../interfaces/error/customError";

const createProfessional = async (req: Request, res: Response, next) => {
  const { password, ...everythingWithoutPassword } = req.body;

  try {
    const mailProfessionalTaken = await Professional.findOne({
      email: req.body.email,
    });
    const mailClientTaken = await Client.findOne({ email: req.body.email });

    if (mailProfessionalTaken || mailClientTaken) {
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

const createClient = async (req: Request, res: Response, next) => {
  const { password, ...everythingWithoutPassword } = req.body;

  try {
    const mailProfessionalTaken = await Professional.findOne({
      email: req.body.email,
    });
    const mailClientTaken = await Client.findOne({ email: req.body.email });

    if (mailProfessionalTaken || mailClientTaken) {
      const error = new CustomError("Email already exist.");
      error.code = 403;
      next(error);
      return;
    }
    const newClient = await Client.create({
      ...everythingWithoutPassword,
      password: await bcrypt.hash(password, 10),
    });
    res.status(201).json(newClient);
  } catch {
    const error = new Error("Error creating the client.");
    next(error);
  }
};

const loginUser = async (req: Request, res: Response, next) => {
  const { email, password } = req.body;
  try {
    let user;
    user = await Professional.findOne({ email });
    if (!user) {
      user = await Client.findOne({ email });
    }

    if (!user) {
      const error = new CustomError("Wrong credentials.");
      error.code = 401;
      next(error);
      return;
    }
    const rightPassword = await bcrypt.compare(password, user.password);

    if (!rightPassword) {
      const error = new CustomError("Wrong credentials.");
      error.code = 401;
      next(error);
      return;
    }

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: 48 * 60 * 60,
      }
    );

    res.json({ token });
  } catch {
    const error = new Error("Error logging in the user.");
    next(error);
  }
};

export { createProfessional, loginUser, createClient };
