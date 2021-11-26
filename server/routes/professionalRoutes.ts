import express from "express";
import checkAuthorization from "../../middlewares/checkAuthorization";
import {
  getProfessionals,
  getProfessional,
  getProfessionalClients,
  deleteProfessionalProfile,
  updateProfessionalProfile,
  rateProfessional,
} from "../controllers/professionalControllers";

const router = express.Router();

router.get("/", getProfessionals);
router.get("/clients", checkAuthorization, getProfessionalClients);
router.get("/:id", getProfessional);
router.delete("/delete", checkAuthorization, deleteProfessionalProfile);
router.put("/update", checkAuthorization, updateProfessionalProfile);
router.patch("/rate/:id", checkAuthorization, rateProfessional);

export default router;
