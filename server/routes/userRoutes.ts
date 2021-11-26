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
  validate(professionalRegisterSchema),
  upload.single("avatar"),
  firebase,
  createProfessional
);

router.post(
  "/client/register",
  validate(clientRegisterSchema),
  upload.single("avatar"),
  firebase,
  createClient
);

export default router;
