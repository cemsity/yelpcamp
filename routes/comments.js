const express = require("express");
let   router = express.Router({mergeParams: true});
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware");


///+============
//  COMMENTS ROUTES
///+============

router.get('/new', middleware.isLoggedIn,(req, res) => {
   Campground.findById(req.params.id, (err, foundCampground) => {
      if (err){
         req.flash("error","Campground not found");
         console.log(err);
      } else {
          res.render("comments/new", {campground: foundCampground});
      }
   });
  
});

router.post('/', middleware.isLoggedIn ,(req, res) => {
   Campground.findById(req.params.id, (err, campground) =>{
      if (err){
         req.flash("error","Campground not found");
         res.redirect("/campground");
      } else {
         Comment.create(req.body.comment, (err, comment) =>{
            if (err) {
               req.flash("error","Campground not found");
               res.redirect("/campground");
            } else {
                // add username and id to comment
                comment.author.id = req.user._id;
                comment.author.username = req.user.username;
                //console.log("Username for comment: " + req.user.username)
                // save ID
                comment.save();
                campground.comments.push(comment);
                campground.save();
                req.flash("success","Comment successfully added!")
                res.redirect("/campgrounds/" + campground._id);
            }
         });
      }
   });
});

router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
   Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err){
         req.flash("error","Comment not found");
         res.redirect('/campgrounds');
      } else {
         res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
      }
   });
   
});

router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, foundComment) =>{
      if (err){
         req.flash("error","Comment not found");
         res.redirect("/campgrounds");
      } else {
         req.flash("success","Comment successfully edited!");
         res.redirect("/campgrounds/" + req.params.id);
      }
   });
});
//DESTROY COMMENTS ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership ,(req, res) => {
   Comment.findByIdAndRemove(req.params.comment_id, (err) => {
      if (err){
         req.flash("error","Comment not found");
         res.redirect("back");
      } else {
         req.flash("success","Comment successfully deleted!")
         res.redirect('/campgrounds/' + req.params.id);
      }
   });
});


module.exports = router;