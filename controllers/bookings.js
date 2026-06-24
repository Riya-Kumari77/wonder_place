const Booking = require("../models/booking");
const Listing = require("../models/listing");

module.exports.createBooking = async (req, res) => {
    const { id } = req.params; // The listing ID
    const { checkIn, checkOut, guests } = req.body;

    const listing = await Listing.findById(id);

    // 1. Calculate the number of nights using Date objects
    const date1 = new Date(checkIn);
    const date2 = new Date(checkOut);
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    // Basic validation: Check-out must be after Check-in
    if (diffDays === 0 || date1 >= date2) {
        req.flash("error", "Invalid dates. Check-out must be after Check-in.");
        return res.redirect(`/listings/${id}`);
    }

    // 2. Calculate Total Price
    const totalPrice = diffDays * listing.price;

    // 3. Create and Save the Booking
    const newBooking = new Booking({
        user: req.user._id,
        listing: listing._id,
        checkIn: date1,
        checkOut: date2,
        guests: guests,
        totalPrice: totalPrice
    });

    await newBooking.save();

    req.flash("success", `Booking Confirmed! Total for ${diffDays} nights: ₹${totalPrice}`);
    res.redirect("/my-trips"); // We will create this page in the next step!
};

// Function to show the user all their booked trips
module.exports.renderMyTrips = async (req, res) => {
    // Find all bookings belonging to the logged-in user and populate the listing details
    const bookings = await Booking.find({ user: req.user._id }).populate("listing");
    res.render("users/trips", { bookings });
};