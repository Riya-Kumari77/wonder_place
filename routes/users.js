const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const userController = require("../controllers/users");
const { isLoggedIn } = require("../middleware.js");

router.get("/signup", userController.renderSignupForm);
router.post("/signup", wrapAsync(userController.signup));

router.get("/login", userController.renderLoginForm);
router.post("/login", passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), userController.login);

router.get("/logout", userController.logout);

router.get("/wishlist", isLoggedIn, wrapAsync(userController.renderWishlist));
router.post("/wishlist/:listingId", isLoggedIn, wrapAsync(userController.toggleWishlist));

module.exports = router;