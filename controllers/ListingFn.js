const geocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingCLient = mbxGeocoding({ accessToken: mapToken })



///index
module.exports.index = async (req, res) => {
  const allListings = await Listing.find()
  res.render("listings/index.ejs", { allListings })

};

//new
module.exports.rendernewform = (req, res) => {

  console.log(req.user);
  res.render("listings/new.ejs");
};

//show
module.exports.showlisting = async (req, res) => {

  let { id } = req.params;
  const listing = await Listing.findById(id).
    populate({
      path: "reviews",
      populate: {
        path: "author",
      }
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "listing Doesn't Exist");
    res.redirect("/listing")
  };
  res.render("listings/show.ejs", { listing })
};


//create
module.exports.createlisting = async (req, res, next) => {

  let response = await geocodingCLient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1
    })
    .send();

  let url = req.file.path;
  let filename = req.file.filename;
  const newlisting = new Listing(req.body.listing);
  newlisting.owner = req.user._id;
  newlisting.image = { url, filename };
  newlisting.geometry = response.body.features[0].geometry
  let savelist = await newlisting.save();
  console.log(savelist);
  req.flash("success", "New Listing Created Successfully");
  res.redirect("/listing");


};

// edit
module.exports.rendereditform = async (req, res) => {

  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "listing Doesn't Exist");
    res.redirect("/listing")
  };
  let originalimageurl = listing.image.url;
  originalimageurl = originalimageurl.replace("/upload", "/upload/,w_250")
  res.render("listings/edit.ejs", { listing, originalimageurl })
};


//update
module.exports.updatelisitng = async (req, res) => {

  let { id } = req.params;

  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let filename = req.file.filename;
    let url = req.file.path;
    listing.image = { url, filename };
    listing.save();
  }
  req.flash("success", "Updated Successfully");
  res.redirect(`/listing/${id}`)
};

//delete
module.exports.deletelisting = async (req, res) => {

  let deletedlisting = await Listing.findByIdAndDelete(id);
  console.log(deletedlisting);
  req.flash("success", "Listing Deleted Successfully");
  res.redirect("/listing");

}
module.exports.indexsearch = async (req, res, next) => {
  const query = req.query.query;
  const allListings = await Listing.find({
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { location: { $regex: query, $options: 'i' } },
      { country: { $regex: query, $options: 'i' } },
      { "category.type": { $regex: query, $options: 'i' } }
    ]
  });

  const data = { allListings, query }; // Create an object with allListings property
  res.render('listings/index.ejs', data); // Pass the object to the render function
};

module.exports.indexByCategory = async (req, res) => {
  const { category } = req.params;

  let allListings;
  if (category === 'Trending') {
    allListings = await Listing.find({ 'category.type': 'not specify' });
  } else {
    allListings = await Listing.find({ 'category.type': category });
  }
  res.render("listings/index.ejs", { allListings });

};