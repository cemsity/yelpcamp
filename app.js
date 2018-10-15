const express           = require("express"),
  app                   = express(),
  bodyParser            = require('body-parser'),
  mongoose              = require("mongoose"),
  Campground            = require("./models/campground"),
  Comment               = require("./models/comment"),
  passport              = require("passport"),
  LocalStrategy         = require("passport-local"),
  passportLocalMongoose = require('passport-local-mongoose'),
  User                  = require("./models/user"),
  methodOverride        = require("method-override"),
  flash                 = require("connect-flash");
  
const commentRoutes     = require("./routes/comments"),
  campgroundRoutes      = require("./routes/campgrounds"),
  indexRoutes           = require("./routes/index");
  
//const seedDB = require('./seed');
app.use(flash());
mongoose.connect("mongodb://dbuser:dbpassword1@ds043378.mlab.com:43378/cemsityyelpcamp", { useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
//seedDB();

// PASSPORT CONGFIGURATION
app.use(require("express-session")({
   secret:"Astrid is my kitten a mitten",
   resave: false,
   saveUninitialized: false  
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});
// use routes
app.use("/",indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

//LISTEN
app.listen(process.env.PORT, process.env.IP, () => {
   console.log("YelpCAMP Server is Running!");
});
