const express = require("express");
const   router = express.Router();
const Campground = require("../models/campground");
const middleware = require("../middleware");

//INDEX
router.get('/', (req, res) =>{
   //get campgrounds
   Campground.find({}, (err, allCampgrounds) => {
      if (err){
         console.log(err);
      } else {
         res.render("campgrounds/campgrounds", {campgrounds: allCampgrounds});
      }
   });
   
});

//CREATE
router.post('/', middleware.isLoggedIn, (req, res) => {
   // get data form form and add to campgrounds array 
   let name = req.body.name;
   let image = req.body.image; 
   let description = req.body.description; 
   let author = {
       id: req.user._id,
       username : req.user.username,
   };
   let newCampground = {name: name, image: image, description: description, author: author};
   // Creat new Campgound and save to data base
   Campground.create(newCampground, (err, newlyCampground) =>{
      if (err){
         console.log(err);
      } else {
         res.redirect("/campgrounds");
      }
   });
});

//NEW
router.get("/new", middleware.isLoggedIn ,(req, res) =>{
   res.render("campgrounds/new");
});

//SHOW
router.get("/:id", (req, res) => {
   Campground.findById(req.params.id).populate("comments").exec( (err, foundCampground) => {
      if (err){
         req.flash('error', "Could not find Campground!" )
      } else {
         res.render("campgrounds/show", {campground: foundCampground});
      }
   });
});

//EDIT CAMPGROUND 
router.get("/:id/edit" , middleware.checkCampgroundOwnership,(req, res) => {
   Campground.findById(req.params.id, (err, foundCampground) => {
      if(err){
         req.flash('error', "Could not find Campground!" )
      }
      res.render("campgrounds/edit", {campground: foundCampground});
   });
});

// UPDATE CAMPGROUND
router.put("/:id", middleware.checkCampgroundOwnership ,(req, res) => {
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, foundCampground) =>{
      if (err){
         req.flash("error","Campground not found");;
         res.redirect("/campgrounds");
      } else {
         req.flash("success","Campground successfully Edited");
         res.redirect("/campgrounds/" + req.params.id);
      }
   });
});
//DESTROY

router.delete('/:id', middleware.checkCampgroundOwnership,(req, res) => {
   Campground.findByIdAndRemove(req.params.id, (err) =>{
      if (err){
         console.log(err);
         res.redirect("/campgrounds");
      } else {
         res.redirect("/campgrounds");
      }
   });
});



module.exports = router;