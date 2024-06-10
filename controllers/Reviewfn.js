
const Listing = require("../models/listing.js");
const review = require("../models/review");



//addreview
module.exports.addreview=async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newreview= new review(req.body.review)
    newreview.author = req.user._id;
    listing.reviews.push(newreview);
    await newreview.save();
    await listing.save();
    req.flash("success","Review Added Successfully");
    res.redirect(`/listing/${listing._id}`)

};

//deletereview
module.exports.deletereview=async(req,res)=>{
    let {id,reviewId}= req.params;
   await review.findByIdAndDelete(reviewId);
  await Listing.findByIdAndUpdate(id,{ $pull:{reviews:reviewId}});
  req.flash("success","Review Deleted successfully");
   res.redirect(`/listing/${id}`);

}