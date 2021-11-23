const express = require("express");

const { createProfessional } = require("../controllers/userControllers");

const router = express.Router();

router.post("/professional/register", createProfessional);

export default router;
