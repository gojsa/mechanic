const express = require("express");
const router = express.Router();
const {protectMiddlwere} = require("../middleware/auth");
const {
    createCar,
    renderCar,
    updateCar,
    deleteCar
} = require("../controllers/carController");

router.get("/onecar",protectMiddlwere, renderCar);
router.post("/",protectMiddlwere, createCar);
router.put("/:car_id",protectMiddlwere, updateCar);
router.delete("/:car_id",protectMiddlwere, deleteCar);

module.exports = router;