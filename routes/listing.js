const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema}=require("../schema.js");
const Listing=require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing}=require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer=require("multer");
const {storage}=require("../cloudconfig.js");
const upload=multer({storage});


router.route("/")
      .get(wrapAsync(listingController.index))
      .post(
        
        upload.single('listing[image][url]'),
        validateListing,
        wrapAsync(listingController.createListing)
        );
    


//New route
router.get("/new",isLoggedIn,listingController.renderNewform); 

router.get("/search", wrapAsync(async (req, res) => {
  const query = req.query.q || "";
  const regex = new RegExp(query, "i"); // case-insensitive match

  const listings = await Listing.find({
    $or: [{ title: regex }, { location: regex }] // search in title or location
  });

  const allListingsFromDB = await Listing.find({}); // for fallback

  res.render("listings/index", {
    allListings: listings,
    allListingsFromDB,
    searchQuery: query
  });
}));

router.route("/:id")
      .get(wrapAsync(listingController.showListing))
      .put(isLoggedIn,isOwner,upload.single('listing[image][url]'),validateListing,wrapAsync(listingController.updateListing))
      .delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));


//Edit Route

router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditform));
router.get("/category/:category", wrapAsync(listingController.filterlisting));


module.exports=router;
