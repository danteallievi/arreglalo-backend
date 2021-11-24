import express from "express";
import checkAuthorization from "../../middlewares/checkAuthorization";
import {
  getProfessionals,
  getProfessional,
  getProfessionalClients,
} from "../controllers/professionalControllers";

const router = express.Router();

router.get("/", getProfessionals);
router.get("/:id", getProfessional);
router.get("/clients", checkAuthorization, getProfessionalClients);

export default router;
