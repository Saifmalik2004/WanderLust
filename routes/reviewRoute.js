const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapasync = require("../utils/wrapasync.js");
const { validatereview, isLoggedIn, isreviewAuthor } = require("../middleware.js")
const ReviewController = require("../controllers/Reviewfn.js")

//reviewpost
router.post("/", isLoggedIn, validatereview, wrapasync(ReviewController.addreview));

//delete review route

router.delete("/:reviewId", isLoggedIn, isreviewAuthor, wrapasync(ReviewController.deletereview));

module.exports = router;