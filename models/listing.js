const { urlencoded } = require("express");
const mongoose=require("mongoose");
const Review=require("./review");
const { required } = require("joi");
const Schema=mongoose.Schema;

const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
        filename:String,
        url:{
            type:String,
            default:"https://unsplash.com/photos/landscape-photography-of-mountain-hit-by-sun-rays-78A265wPiO4",
            set:(v) => v === "" ? "https://unsplash.com/photos/landscape-photography-of-mountain-hit-by-sun-rays-78A265wPiO4" : v,


        },
       
       //default:"https://unsplash.com/photos/landscape-photography-of-mountain-hit-by-sun-rays-78A265wPiO4",
       //set:(v) => v === "" ? "https://unsplash.com/photos/landscape-photography-of-mountain-hit-by-sun-rays-78A265wPiO4" : v,
    },   
    price:Number,
    location:String,
    country:String,
    review:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Review"
    }],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    geometry:{
        type:{
            type:String,
            enum:['Point'],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        }
    }
});

listingSchema.post("findOneAndDelete",async (listing)=>{
    if(listing){
    await Review.deleteMany({_id:{$in:listing.review}});
    }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports= Listing;