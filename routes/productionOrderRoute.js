const express = require("express");
const router = express.Router();
const { detailProduction, findAllProductionOrdersTable, createProductionOrder, updateProductionOrder, deleteProductionOrder, getProductionOrders, findAllProductionOrders, carProduction } = require("../controllers/productionOrderController");


router.get('/allProductions', findAllProductionOrders);
router.get('/detail/:production_order_id', detailProduction);
router.get("/", findAllProductionOrdersTable);
router.get("/:car_id", getProductionOrders);
router.get("/carProduction/render", carProduction);
router.post("/", createProductionOrder);
router.put("/:production_order_id", updateProductionOrder);
router.delete("/:production_order_id", deleteProductionOrder);

module.exports = router;