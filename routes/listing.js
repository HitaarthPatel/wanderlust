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

router.route("/:id")
      .get(wrapAsync(listingController.showListing))
      .put(isLoggedIn,isOwner,upload.single('listing[image][url]'),validateListing,wrapAsync(listingController.updateListing))
      .delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));


//Edit Route

router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditform));
router.get("/category/:category", wrapAsync(listingController.filterlisting));


module.exports=router;
