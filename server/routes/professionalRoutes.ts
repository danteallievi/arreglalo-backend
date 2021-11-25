import express from "express";
import checkAuthorization from "../../middlewares/checkAuthorization";
import {
  getProfessionals,
  getProfessional,
  getProfessionalClients,
  hireProfessional,
  deleteProfessionalProfile,
  updateProfessionalProfile,
} from "../controllers/professionalControllers";

const router = express.Router();

router.get("/", getProfessionals);
router.get("/:id", getProfessional);
router.post("/hire/:id", checkAuthorization, hireProfessional);
router.delete("/delete", checkAuthorization, deleteProfessionalProfile);
router.put("/update", checkAuthorization, updateProfessionalProfile);
router.get("/clients", checkAuthorization, getProfessionalClients);

export default router;
