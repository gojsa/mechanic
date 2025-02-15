const express = require("express");
const router = express.Router();

const {
    createCar,
    renderCar,
    updateCar,
    deleteCar
} = require("../controllers/carController");

router.get("/onecar", renderCar);
router.post("/", createCar);
router.put("/:car_id", updateCar);
router.delete("/:car_id", deleteCar);

module.exports = router;