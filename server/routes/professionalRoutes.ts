import express from "express";
import checkAuthorization from "../../middlewares/checkAuthorization";
import {
  getProfessionals,
  getProfessional,
  getProfessionalClients,
  deleteProfessionalProfile,
  updateProfessionalProfile,
} from "../controllers/professionalControllers";

const router = express.Router();

router.get("/", getProfessionals);
router.get("/clients", checkAuthorization, getProfessionalClients);
router.get("/:id", getProfessional);
router.delete("/delete", checkAuthorization, deleteProfessionalProfile);
router.put("/update", checkAuthorization, updateProfessionalProfile);

export default router;
