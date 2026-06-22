const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { isClient } = require("../middlewares/auth");

router.get("/", isClient, userController.dashboard);
router.post("/produtos/:id/adicionar", isClient, userController.addProductToAccount);
router.get("/minha-conta", isClient, userController.myAccount);

module.exports = router;
