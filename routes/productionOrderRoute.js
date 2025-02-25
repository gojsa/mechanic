const express = require("express");
const router = express.Router();
const {protectMiddlwere} = require("../middleware/auth");
const { detailProduction, findAllProductionOrdersTable, createProductionOrder, updateProductionOrder, deleteProductionOrder, getProductionOrders, findAllProductionOrders, carProduction } = require("../controllers/productionOrderController");


router.get('/allProductions',protectMiddlwere, findAllProductionOrders);
router.get('/detail/:production_order_id',protectMiddlwere, detailProduction);
router.get("/", protectMiddlwere,findAllProductionOrdersTable);
router.get("/:car_id", protectMiddlwere,getProductionOrders);
router.get("/carProduction/render",protectMiddlwere, carProduction);
router.post("/",protectMiddlwere, createProductionOrder);
router.put("/:production_order_id",protectMiddlwere, updateProductionOrder);
router.delete("/:production_order_id",protectMiddlwere, deleteProductionOrder);

module.exports = router;