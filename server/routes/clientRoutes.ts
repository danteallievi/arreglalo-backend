import express from "express";

import checkAuthorization from "../../middlewares/checkAuthorization";
import { getClients, getClientProfessionals } from "../controllers/client";

const router = express.Router();

router.get("/", checkAuthorization, getClients);
router.get("/professionals", checkAuthorization, getClientProfessionals);

export default router;
