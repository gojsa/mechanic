const express = require("express");
const router = express.Router();

const {
    renderInvoice,
    createInovice
} = require("../controllers/invoiceController");

router.get("/render", renderInvoice);
router.post("/", createInovice);

module.exports = router;