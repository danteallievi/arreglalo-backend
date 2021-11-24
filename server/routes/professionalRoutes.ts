import express from "express";
import checkAuthorization from "../../middlewares/checkAuthorization";
import {
  getProfessionals,
  getProfessionalClients,
} from "../controllers/professionalControllers";
// import { validate } from "express-validation";

const router = express.Router();

router.get("/", getProfessionals);
router.get("/clients", checkAuthorization, getProfessionalClients);

export default router;
