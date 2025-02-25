const express = require("express");
const router = express.Router();
const { protectMiddlwere } = require("../middleware/auth");
const {
    renderInvoice,
    createInovice,
    updateInvoiceStatus,
    createInvoiceArticle,
    allInvoices,
    redirectToAll,
    updateInvoice,
    pdfInvoice,
    deleteInvoice,
    invoiceArticleOneInvoice,
    updateinvoiceArticle,
    deleteInvoiceArticle
} = require("../controllers/invoiceController");

router.get("/invoice-article-one-invoice/:invoice_id",protectMiddlwere, invoiceArticleOneInvoice);
router.get("/pdf-invoice/:invoice_id",protectMiddlwere, pdfInvoice);
router.get("/all-invoices/:limit/:offset",protectMiddlwere, allInvoices);
router.get("/render",protectMiddlwere, renderInvoice);
router.get("/redirect-to-all",protectMiddlwere, redirectToAll);
router.post("/",protectMiddlwere, createInovice);
router.post("/create-invoice-article",protectMiddlwere, createInvoiceArticle);
router.put("/update-status",protectMiddlwere, updateInvoiceStatus);
router.put("/update-invoice/:invoice_id",protectMiddlwere, updateInvoice);
router.put("/update-invoice-article/:invoice_article_id",protectMiddlwere, updateinvoiceArticle);
router.delete("/:invoice_id",protectMiddlwere, deleteInvoice);
router.delete("/delete-invoice-article/:invoice_article_id",protectMiddlwere, deleteInvoiceArticle);


module.exports = router;