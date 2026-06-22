const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { isAdmin } = require("../middlewares/auth");
const upload = require("../middlewares/upload");

router.get("/", isAdmin, adminController.dashboard);
router.get("/produtos/novo", isAdmin, adminController.newProductPage);
router.post("/produtos", isAdmin, upload.single("image"), adminController.createProduct);
router.get("/produtos/:id/editar", isAdmin, adminController.editProductPage);
router.put("/produtos/:id", isAdmin, upload.single("image"), adminController.updateProduct);
router.delete("/produtos/:id", isAdmin, adminController.deleteProduct);
router.get("/clientes", isAdmin, adminController.clients);
router.get("/movimentacoes", isAdmin, adminController.movements);

module.exports = router;
