import express from "express";
import { validate } from "express-validation";
import {
  professionalRegisterSchema,
  loginSchema,
} from "../../schemas/userRoutes/userRoutesSchema";

const {
  createProfessional,
  loginUser,
} = require("../controllers/userControllers");

const router = express.Router();

router.post("/login", validate(loginSchema), loginUser);

router.post(
  "/professional/register",
  validate(professionalRegisterSchema),
  createProfessional
);

export default router;
