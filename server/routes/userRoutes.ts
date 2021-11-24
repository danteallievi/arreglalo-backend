import express from "express";
import { validate } from "express-validation";
import {
  professionalRegisterSchema,
  clientRegisterSchema,
  loginSchema,
} from "../../schemas/userRoutes/userRoutesSchema";

const {
  createProfessional,
  createClient,
  loginUser,
} = require("../controllers/userControllers");

const router = express.Router();

router.post("/login", validate(loginSchema), loginUser);

router.post(
  "/professional/register",
  validate(professionalRegisterSchema),
  createProfessional
);

router.post("/client/register", validate(clientRegisterSchema), createClient);

export default router;
