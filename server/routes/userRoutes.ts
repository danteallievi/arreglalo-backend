import express from "express";
import { validate } from "express-validation";
import firebase from "../../middlewares/firebase";
import upload from "../../middlewares/upload";
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
  upload.single("avatar"),
  firebase,
  validate(professionalRegisterSchema),
  createProfessional
);

router.post(
  "/client/register",
  upload.single("avatar"),
  firebase,
  validate(clientRegisterSchema),
  createClient
);

export default router;
