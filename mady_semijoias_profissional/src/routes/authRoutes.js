const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.get("/login", authController.loginPage);
router.post("/login", authController.login);
router.get("/cadastro", authController.registerPage);
router.post("/cadastro", authController.register);
router.post("/logout", authController.logout);

module.exports = router;
