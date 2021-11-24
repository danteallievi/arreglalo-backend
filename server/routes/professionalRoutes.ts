import express from "express";
import { getProfessionals } from "../controllers/professionalControllers";
// import { validate } from "express-validation";

const router = express.Router();

router.get("/", getProfessionals);

export default router;
