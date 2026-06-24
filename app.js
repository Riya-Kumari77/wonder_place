if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync"); 

// Routers
const listingsRouter = require("./routes/listings");
const userRouter = require("./routes/users");
const reviewsRouter = require("./routes/reviews");
const bookingsRouter = require("./routes/bookings");

// Controllers & Middleware for top-level routes
const bookingController = require("./controllers/bookings");
const { isLoggedIn } = require("./middleware.js");

const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/wonderplace";
const port = process.env.PORT || 3000;
const sessionSecret = process.env.SESSION_SECRET;

if (process.env.NODE_ENV === "production" && !sessionSecret) {
  throw new Error("SESSION_SECRET must be set in production");
}

main().then(() => console.log("Connected to MongoDB!")).catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// --- 1. SESSION & SECURITY MUST LOAD FIRST ---
const sessionOptions = {
    secret: sessionSecret || "dev_only_change_this_session_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

// --- 2. ROUTES MUST GO HERE (After Session, Before Errors) ---
app.use("/listings", listingsRouter);
app.use("/", userRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/listings/:id/bookings", bookingsRouter);

app.get("/my-trips", isLoggedIn, wrapAsync(bookingController.renderMyTrips));

app.get("/", (req, res) => {
  res.redirect("/listings"); 
});

// --- 3. ERROR HANDLERS MUST BE AT THE VERY BOTTOM ---
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).send(message); 
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
