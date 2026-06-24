const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn } = require("../middleware.js");
const bookingController = require("../controllers/bookings");

// Route to process the booking form on the listing show page
router.post("/", isLoggedIn, wrapAsync(bookingController.createBooking));

module.exports = router;