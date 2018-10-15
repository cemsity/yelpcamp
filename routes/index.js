const express = require("express");
let   router = express.Router();
const passport = require("passport");
const User = require("../models/user");


router.get("/", (req, res) => {
   res.render("home"); 
});

//================
// AUTH ROUTES
//================

router.get("/register", (req, res) => {
   res.render("register");
});

router.post("/register", (req, res) =>{
   let newUser = new User({username: req.body.username});
   User.register(newUser, req.body.password, (err, user) =>{
      if(err){
         req.flash("error", err.message);
         res.redirect("register");
      }
      passport.authenticate("local")(req, res, () => {
         req.flash("success", "Welcome to YelpCAMP, " + user.username + "!")
         res.redirect("/campgrounds");
      });
   });
});

//Login routes

router.get("/login", (req, res) =>{
   res.render("login");
});

router.post("/login",passport.authenticate("local",{
   successRedirect: "/campgrounds",
   failureRedirect: "/login"
}) ,(req, res) =>{
});

router.get("/logout", (req, res) => {
   req.logout();
   req.flash("success", "Logged Out Successfully!");
   res.redirect('/campgrounds');
});





module.exports = router;