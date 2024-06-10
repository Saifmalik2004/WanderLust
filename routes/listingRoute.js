const express = require("express");
const router = express.Router();
const wrapasync = require("../utils/wrapasync.js");
const { isLoggedIn, isowner, validatelisting } = require("../middleware.js");
const listingController = require("../controllers/ListingFn.js");


const multer = require('multer');
const { storage } = require("../cloudconfig.js");
const upload = multer({ storage });


router.route("/")
    .get(wrapasync(listingController.index))
    .post(isLoggedIn, upload.single('listing[image]'), validatelisting, wrapasync(listingController.createlisting));

router.get("/search", wrapasync(listingController.indexsearch));

router.get("/new", isLoggedIn, listingController.rendernewform);


router.route("/:id")
    .get(wrapasync(listingController.showlisting))
    .put(isLoggedIn, isowner, upload.single('listing[image]'), validatelisting, wrapasync(listingController.updatelisitng))
    .delete(isLoggedIn, isowner, wrapasync(listingController.deletelisting));


router.get("/:id/edit", isLoggedIn, isowner, wrapasync(listingController.rendereditform));

router.get("/Category/:category", wrapasync(listingController.indexByCategory))
    ;





module.exports = router;