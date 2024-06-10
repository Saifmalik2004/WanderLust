const express = require("express");
const router = express.Router();
const wrapasync = require("../utils/wrapasync.js");
const passport = require("passport");
const { saveUrl } = require("../middleware.js");
const UserController = require("../controllers/Userfn.js");


//renderformforsigup
router.route("/signup")
    .get(UserController.rendersignupform)
    .post(wrapasync(UserController.signp));

//loginformrender
router.route("/login")
    .get(UserController.renderloginform)
    .post(saveUrl, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), UserController.login);

//logout
router.get("/logout", UserController.logout)






module.exports = router;
