// IMPORT 
const Campground = require("../models/campground");
const Comment = require("../models/comment");


/// all the middle ware

let middlewareObj = {
};

middlewareObj.isLoggedIn = (req, res, next) => {
   if(req.isAuthenticated()){
      return next();
   } 
   req.flash("error", "Please login first!")
   res.redirect("/login");
}; 

middlewareObj.checkCampgroundOwnership = (req, res, next) => {
   if (req.isAuthenticated()){
         Campground.findById(req.params.id, (err, foundCampground) => {
      if (err) {
         req.flash("error", "Campground not found");
         res.redirect("back");
      } else {
         
         if(!foundCampground){
            req.flash("error", "Campground not found");
            res.redirect("back");
         } 
         
         if(foundCampground.author.id.equals(req.user._id)){
            next();
         } else {
            req.flash('error', "You don't have permision to do that.");
            res.redirect('back');
         }
      }
   });
   } else {
      req.flash("error", "You must be logged in to do that!");
      res.redirect("back");
   }
};

middlewareObj.checkCommentOwnership = (req, res, next) => {
   if (req.isAuthenticated()){
         Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
         req.flash("error", "Comment not found");
         res.redirect('back');
      } else {
         
         if(!foundComment){
            req.flash("error", "Comment not found");
            res.redirect('back');
         }
         
         if(foundComment.author.id.equals(req.user._id)){
            next();
         } else {
            req.flash("error", "You must be logged in to do that!");
            res.redirect('back');
         }
      }
   });
   } else {
      res.redirect("back");
   }
};

module.exports = middlewareObj;