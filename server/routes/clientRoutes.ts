import express from "express";

import checkAuthorization from "../../middlewares/checkAuthorization";
import {
  getClients,
  getClientProfessionals,
  hireProfessional,
} from "../controllers/client";

const router = express.Router();

router.get("/", checkAuthorization, getClients);
router.get("/professionals", checkAuthorization, getClientProfessionals);
router.post("/hire/:id", checkAuthorization, hireProfessional);

export default router;
