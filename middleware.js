const Listing = require("./models/listing.js");
const review = require("./models/review.js");
const ExpressError = require("./utils/expressError.js");
const { listingSchema } = require("./schema.js");
const { reviewSchema } = require("./schema.js");


module.exports.isLoggedIn = (req, res, next) => {

    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in first ");
        return res.redirect("/login")
    }
    next();
};
module.exports.saveUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;

    }
    next();
};

module.exports.isowner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "permission Denied");
        return res.redirect(`/listing/${id}`);
    }
    next();
};
module.exports.validatelisting = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errmsg);
    } else {
        next();
    }
};
module.exports.validatereview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errmsg);
    } else {
        next();
    }
};

module.exports.isreviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;

    let Review = await review.findById(reviewId);


    if (!Review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "permission Denied");
        return res.redirect(`/listing/${id}`);
    }
    next();
};