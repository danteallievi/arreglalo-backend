import express from "express";
import { validate } from "express-validation";
import userRoutesSchema from "../../schemas/userRoutes/userRoutesSchema";

const { createProfessional } = require("../controllers/userControllers");

const router = express.Router();

router.post(
  "/professional/register",
  validate(userRoutesSchema),
  createProfessional
);

export default router;
