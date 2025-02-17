const express = require("express");
const router = express.Router(); 
const { createProductionOrder, updateProductionOrder, deleteProductionOrder, getProductionOrders,findAllProductionOrders } = require("../controllers/productionOrderController");

router.get("/", findAllProductionOrders);
router.get("/:car_id", getProductionOrders);
router.post("/", createProductionOrder);
router.put("/:production_order_id", updateProductionOrder);
router.delete("/:production_order_id", deleteProductionOrder);

module.exports = router;