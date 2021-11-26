import express from "express";

import checkAuthorization from "../../middlewares/checkAuthorization";
import {
  getClients,
  getClient,
  getClientProfessionals,
  hireProfessional,
  ejectProfessional,
} from "../controllers/client";

const router = express.Router();

router.get("/", checkAuthorization, getClients);
router.get("/professionals", checkAuthorization, getClientProfessionals);
router.get("/:id", checkAuthorization, getClient);
router.post("/hire/:id", checkAuthorization, hireProfessional);
router.post("/eject/:id", checkAuthorization, ejectProfessional);

export default router;
