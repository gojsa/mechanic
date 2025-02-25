const express = require("express");
const router = express.Router();
const { protectMiddlwere } = require("../middleware/auth");
const {
    findAllOffers,
    createOffer,
    redirectToOffer,
    updateOffer,
    deleteOffer,
    findAllOfferArticles,
    createOfferArticle,
    updateOfferArticle,
    deleteOfferArticle,
    renderPrintOffer
} = require("../controllers/offerController");

router.get("/offer-article-one-offer/:offer_id",protectMiddlwere, findAllOfferArticles);
router.get("/print/:offer_id",protectMiddlwere, renderPrintOffer);
router.get("/redirect-to-all",protectMiddlwere, redirectToOffer);
router.get("/all-offer/:limit/:offset", protectMiddlwere, findAllOffers);
router.post("/",protectMiddlwere, createOffer);
router.post("/article",protectMiddlwere, createOfferArticle);
router.put("/:offer_id",protectMiddlwere, updateOffer);
router.put("/article/:offer_article_id",protectMiddlwere, updateOfferArticle);
router.delete("/:offer_id",protectMiddlwere, deleteOffer);
router.delete("/article/:offer_article_id",protectMiddlwere, deleteOfferArticle);


module.exports = router;